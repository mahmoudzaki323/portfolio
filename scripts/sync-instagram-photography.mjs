import { access, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import config from "./instagram.photography.config.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");
const instagramAppId = "936619743392459";
const defaultHeaders = {
  "user-agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36",
  "x-ig-app-id": instagramAppId,
  "x-requested-with": "XMLHttpRequest",
};

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function truncate(value, maxLength) {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(0, maxLength - 1).trim()}…`;
}

function inferExtension(url) {
  const cleanUrl = url.split("?")[0];
  const ext = path.extname(cleanUrl).toLowerCase();
  return ext || ".jpg";
}

function formatDate(tsSeconds) {
  return new Date(tsSeconds * 1000).toISOString().slice(0, 10);
}

function cleanCaption(caption) {
  return (caption || "").replace(/\s+/g, " ").trim();
}

function deriveAlbumTitle(item, override) {
  if (override?.title) {
    return override.title;
  }

  const caption = (item.caption?.text || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .find(Boolean);

  if (caption) {
    return truncate(caption.replace(/^["“]|["”]$/g, ""), 56);
  }

  if (item.location?.name) {
    return item.location.name;
  }

  return `Instagram Post ${item.code}`;
}

function deriveAlbumDescription(item, override, trip) {
  if (override?.description) {
    return override.description;
  }

  const caption = cleanCaption(item.caption?.text || "");
  if (caption) {
    return truncate(caption, 180);
  }

  return trip.description;
}

function buildReferer(username) {
  return `https://www.instagram.com/${username}/`;
}

async function fetchJson(url, referer) {
  const response = await fetch(url, {
    headers: {
      ...defaultHeaders,
      referer,
    },
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Request failed (${response.status}) for ${url}\n${body.slice(0, 400)}`);
  }

  return response.json();
}

async function fetchProfile(username) {
  const data = await fetchJson(
    `https://www.instagram.com/api/v1/users/web_profile_info/?username=${encodeURIComponent(username)}`,
    buildReferer(username)
  );

  const user = data?.data?.user;
  if (!user) {
    throw new Error(`Instagram profile payload missing for ${username}.`);
  }

  return user;
}

async function fetchAllItems(userId, username) {
  const items = [];
  let maxId = null;

  while (true) {
    const search = new URLSearchParams({ count: "12" });
    if (maxId) {
      search.set("max_id", maxId);
    }

    const data = await fetchJson(
      `https://www.instagram.com/api/v1/feed/user/${userId}/?${search.toString()}`,
      buildReferer(username)
    );

    items.push(...(data.items || []));

    if (!data.more_available || !data.next_max_id) {
      break;
    }

    maxId = data.next_max_id;
  }

  return items;
}

function getLocationField(item, override) {
  return override?.locationName || item.location?.name || "";
}

function inferTripId(item) {
  const override = config.posts[item.code];
  if (override?.tripId) {
    return override.tripId;
  }

  const locationText = cleanCaption(
    [item.location?.name, item.location?.short_name, item.location?.city, item.location?.address]
      .filter(Boolean)
      .join(" ")
  ).toLowerCase();
  const captionText = cleanCaption(item.caption?.text || "").toLowerCase();

  for (const [tripId, trip] of Object.entries(config.trips)) {
    const locationMatches =
      trip.match?.locations?.some((needle) => locationText.includes(needle.toLowerCase())) ?? false;
    const captionMatches =
      trip.match?.captions?.some((needle) => captionText.includes(needle.toLowerCase())) ?? false;

    if (locationMatches || captionMatches) {
      return tripId;
    }
  }

  return null;
}

function getMediaNodes(item) {
  if (item.media_type === 8 && Array.isArray(item.carousel_media) && item.carousel_media.length > 0) {
    return item.carousel_media.filter((media) => media.image_versions2?.candidates?.length);
  }

  if (item.image_versions2?.candidates?.length) {
    return [item];
  }

  return [];
}

function chooseImageCandidate(media) {
  const candidates = [...(media.image_versions2?.candidates || [])].sort((left, right) => {
    const leftPixels = (left.width || 0) * (left.height || 0);
    const rightPixels = (right.width || 0) * (right.height || 0);
    return rightPixels - leftPixels;
  });

  return candidates.find((candidate) => (candidate.width || 0) <= 1440) || candidates[0] || null;
}

async function ensureFile(url, destinationPath) {
  try {
    await access(destinationPath);
    return;
  } catch {
    // File does not exist yet.
  }

  const response = await fetch(url, { headers: { "user-agent": defaultHeaders["user-agent"] } });
  if (!response.ok) {
    throw new Error(`Media download failed (${response.status}) for ${url}`);
  }

  const buffer = Buffer.from(await response.arrayBuffer());
  await mkdir(path.dirname(destinationPath), { recursive: true });
  await writeFile(destinationPath, buffer);
}

async function runWithConcurrency(tasks, limit) {
  const queue = [...tasks];
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, async () => {
    while (queue.length > 0) {
      const task = queue.shift();
      if (task) {
        await task();
      }
    }
  });

  await Promise.all(workers);
}

function createGeneratedModule(trips) {
  return `import type { Trip } from "./trips.types";\n\nexport const trips: Trip[] = ${JSON.stringify(
    trips,
    null,
    2
  )};\n`;
}

async function main() {
  const username = config.profileUsername;
  const outputDir = path.join(projectRoot, config.outputDir);
  const feedSnapshotDir = path.join(projectRoot, "content", "instagram");

  const profile = await fetchProfile(username);
  const items = await fetchAllItems(profile.id, username);

  const tripMap = new Map();
  const downloadTasks = [];

  for (const item of items) {
    const tripId = inferTripId(item);
    if (!tripId) {
      throw new Error(`No trip mapping found for post ${item.code}. Add an override in instagram.photography.config.mjs.`);
    }

    const tripConfig = config.trips[tripId];
    if (!tripConfig) {
      throw new Error(`Trip config "${tripId}" is missing.`);
    }

    const override = config.posts[item.code];
    const mediaNodes = getMediaNodes(item);
    if (mediaNodes.length === 0) {
      continue;
    }

    const postDate = formatDate(item.taken_at);
    const albumId = slugify(`${tripId}-${item.code}`);
    const albumTitle = deriveAlbumTitle(item, override);
    const albumDescription = deriveAlbumDescription(item, override, tripConfig);
    const albumLocation = getLocationField(item, override) || tripConfig.name;

    const photos = mediaNodes.map((media, index) => {
      const candidate = chooseImageCandidate(media);
      if (!candidate?.url) {
        throw new Error(`No image candidate found for ${item.code} slide ${index + 1}.`);
      }

      const ext = inferExtension(candidate.url);
      const filename = `${postDate}-${item.code}-${String(index + 1).padStart(2, "0")}${ext}`;
      const publicPath = path.posix.join("photography", "instagram", tripId, filename);
      const absolutePath = path.join(outputDir, tripId, filename);

      downloadTasks.push(() => ensureFile(candidate.url, absolutePath));

      return {
        id: slugify(`${item.code}-${index + 1}`),
        url: `/${publicPath}`,
        thumbnail: `/${publicPath}`,
        caption:
          mediaNodes.length === 1 ? albumTitle : `${albumTitle} · Frame ${String(index + 1).padStart(2, "0")}`,
        location: albumLocation,
        date: postDate,
      };
    });

    const album = {
      id: albumId,
      title: albumTitle,
      description: albumDescription,
      coverImage: photos[0].url,
      photos,
      _takenAt: item.taken_at,
    };

    if (!tripMap.has(tripId)) {
      tripMap.set(tripId, []);
    }

    tripMap.get(tripId).push(album);
  }

  await runWithConcurrency(downloadTasks, 6);

  const trips = config.tripOrder
    .map((tripId) => {
      const tripConfig = config.trips[tripId];
      const albums = (tripMap.get(tripId) || [])
        .sort((left, right) => right._takenAt - left._takenAt)
        .map(({ _takenAt, ...album }) => album);

      if (albums.length === 0) {
        return null;
      }

      const timestamps = (tripMap.get(tripId) || []).map((album) => album._takenAt).sort((a, b) => a - b);

      return {
        id: tripId,
        name: tripConfig.name,
        country: tripConfig.country,
        coordinates: tripConfig.coordinates,
        dateRange: {
          start: formatDate(timestamps[0]),
          end: formatDate(timestamps[timestamps.length - 1]),
        },
        description: tripConfig.description,
        thumbnail: albums[0].coverImage,
        albums,
        color: tripConfig.color,
      };
    })
    .filter(Boolean);

  await mkdir(feedSnapshotDir, { recursive: true });
  await writeFile(
    path.join(feedSnapshotDir, `${username}.feed.json`),
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        profile: {
          id: profile.id,
          username: profile.username,
          fullName: profile.full_name,
          biography: profile.biography,
          totalPosts: profile.edge_owner_to_timeline_media?.count ?? items.length,
        },
        items,
      },
      null,
      2
    )
  );

  await writeFile(path.join(projectRoot, "src", "data", "trips.generated.ts"), createGeneratedModule(trips));

  console.log(`Synced ${items.length} Instagram posts into ${trips.length} photography destinations.`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
