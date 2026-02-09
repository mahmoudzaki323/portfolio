# Easy Photo Management Guide

## The Simple Workflow

1. **Upload photos** to Cloudinary in organized folders
2. **List filenames** in trips.ts (just filenames, not full URLs!)
3. **Push to GitHub** → auto-deploys

---

## Step 1: Cloudinary Setup

1. Sign up: [cloudinary.com/users/register_free](https://cloudinary.com/users/register_free)
2. Note your **Cloud Name** (e.g., `dxyz123abc`)
3. Create `.env` file in portfolio folder:
   ```
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   ```

---

## Step 2: Upload Photos

In Cloudinary Media Library, create this folder structure:
```
portfolio/
├── paris/
│   ├── eiffel-1.jpg
│   ├── eiffel-2.jpg
│   ├── louvre-1.jpg
│   └── ...
├── tokyo/
│   ├── shibuya-1.jpg
│   ├── temple-1.jpg
│   └── ...
└── iceland/
    ├── aurora-1.jpg
    └── ...
```

---

## Step 3: Add Location to trips.ts

```typescript
import { createPhotosFromFolder, getCloudinaryUrl } from '../lib/cloudinary';

// Just list the filenames - URLs are generated automatically!
{
  id: "paris",
  name: "Paris",
  country: "France",
  coordinates: { lat: 48.8566, lng: 2.3522 },
  dateRange: { start: "2024-10-15", end: "2024-10-22" },
  description: "The City of Light",
  thumbnail: getCloudinaryUrl("portfolio/paris/eiffel-1.jpg", { width: 800 }),
  color: "#e11d48",
  albums: [
    {
      id: "paris-main",
      title: "Paris Highlights",
      description: "Best shots from the trip",
      coverImage: getCloudinaryUrl("portfolio/paris/eiffel-1.jpg", { width: 800 }),
      
      // EASY WAY: Just list filenames!
      photos: createPhotosFromFolder("portfolio/paris", [
        "eiffel-1.jpg",
        "eiffel-2.jpg",
        "louvre-1.jpg",
        "seine-sunset.jpg",
        "montmartre-1.jpg",
        // Add as many as you want...
      ], "Paris, France")
    }
  ]
}
```

---

## Getting Coordinates

1. Go to [Google Maps](https://maps.google.com)
2. Right-click on location → Click coordinates to copy
3. Format: `{ lat: FIRST_NUMBER, lng: SECOND_NUMBER }`

---

## Deploy

```bash
git add .
git commit -m "Add Paris photos"
git push
```

Vercel auto-deploys! Your photos appear on the live site in ~1 minute.

---

## Tips

- **Folder names** = location names in Cloudinary
- **Filenames** = become captions (eiffel-sunset.jpg → "Eiffel sunset")
- **Order** = photos appear in the order you list them
- **Thumbnails** = generated automatically at 400px width
