export interface Photo {
  id: string;
  url: string;
  thumbnail: string;
  caption: string;
  location: string;
  date: string;
  camera?: string;
  settings?: {
    aperture?: string;
    shutter?: string;
    iso?: number;
    focalLength?: string;
  };
}

export interface Album {
  id: string;
  title: string;
  description: string;
  coverImage: string;
  photos: Photo[];
}

export interface Trip {
  id: string;
  name: string;
  country: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  dateRange: {
    start: string;
    end: string;
  };
  description: string;
  thumbnail: string;
  albums: Album[];
  color: string;
}

// Trips are ordered by geographic proximity for smooth camera travel:
// West Coast USA -> South USA -> East Coast USA -> North Atlantic (Iceland) -> Europe (Morocco) -> Middle East (Cairo) -> Asia (Japan) -> Oceania (New Zealand) -> South America (Patagonia)
export const trips: Trip[] = [
  {
    id: "san-francisco",
    name: "San Francisco",
    country: "USA",
    coordinates: { lat: 37.7749, lng: -122.4194 },
    dateRange: { start: "2024-06-01", end: "2024-06-05" },
    description: "Golden Gate City. Foggy mornings, steep hills, and the iconic bridge spanning the bay.",
    thumbnail: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800",
    color: "#f97316",
    albums: [
      {
        id: "sf-golden-gate",
        title: "Golden Gate",
        description: "The iconic orange bridge through the fog",
        coverImage: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800",
        photos: [
          {
            id: "sf-gg-1",
            url: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=400",
            caption: "Golden Gate Bridge at sunrise",
            location: "San Francisco, CA",
            date: "2024-06-02",
            camera: "Sony A7R IV",
            settings: { aperture: "f/8", shutter: "1/250s", iso: 100, focalLength: "24mm" }
          }
        ]
      }
    ]
  },
  {
    id: "san-diego",
    name: "San Diego",
    country: "USA",
    coordinates: { lat: 32.7157, lng: -117.1611 },
    dateRange: { start: "2024-07-10", end: "2024-07-15" },
    description: "Perfect weather, beautiful beaches, and the stunning coastline of Southern California.",
    thumbnail: "https://images.unsplash.com/photo-1538099130811-745e64318258?w=800",
    color: "#eab308",
    albums: [
      {
        id: "sd-beaches",
        title: "Coastal Views",
        description: "Sunset cliffs and Pacific waves",
        coverImage: "https://images.unsplash.com/photo-1538099130811-745e64318258?w=800",
        photos: [
          {
            id: "sd-1",
            url: "https://images.unsplash.com/photo-1538099130811-745e64318258?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1538099130811-745e64318258?w=400",
            caption: "Sunset at La Jolla Cove",
            location: "San Diego, CA",
            date: "2024-07-12",
            camera: "Sony A7R IV",
            settings: { aperture: "f/11", shutter: "1/125s", iso: 100, focalLength: "35mm" }
          }
        ]
      }
    ]
  },
  {
    id: "durham",
    name: "Durham",
    country: "USA",
    coordinates: { lat: 35.9940, lng: -78.8986 },
    dateRange: { start: "2024-08-01", end: "2024-08-03" },
    description: "Research Triangle charm. Historic tobacco warehouses transformed into vibrant cultural spaces.",
    thumbnail: "https://images.unsplash.com/photo-1562592306-5496ed1b9478?w=800",
    color: "#3b82f6",
    albums: [
      {
        id: "durham-downtown",
        title: "Bull City",
        description: "Historic downtown and modern revival",
        coverImage: "https://images.unsplash.com/photo-1562592306-5496ed1b9478?w=800",
        photos: [
          {
            id: "durham-1",
            url: "https://images.unsplash.com/photo-1562592306-5496ed1b9478?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1562592306-5496ed1b9478?w=400",
            caption: "American Tobacco Campus",
            location: "Durham, NC",
            date: "2024-08-02",
            camera: "Fujifilm X-T4",
            settings: { aperture: "f/4", shutter: "1/500s", iso: 200, focalLength: "23mm" }
          }
        ]
      }
    ]
  },
  {
    id: "iceland",
    name: "Iceland",
    country: "Iceland",
    coordinates: { lat: 64.9631, lng: -19.0208 },
    dateRange: { start: "2024-03-15", end: "2024-03-22" },
    description: "Land of fire and ice. A journey through volcanic landscapes, glacial lagoons, and the dancing aurora borealis.",
    thumbnail: "https://images.unsplash.com/photo-1520769945061-0a448c463865?w=800",
    color: "#06b6d4",
    albums: [
      {
        id: "iceland-aurora",
        title: "Northern Lights",
        description: "Chasing the aurora across the Icelandic highlands",
        coverImage: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
        photos: [
          {
            id: "iceland-aurora-1",
            url: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=400",
            caption: "Aurora dancing over Kirkjufell",
            location: "Kirkjufell, Iceland",
            date: "2024-03-17",
            camera: "Sony A7R IV",
            settings: { aperture: "f/2.8", shutter: "15s", iso: 3200, focalLength: "14mm" }
          },
          {
            id: "iceland-aurora-2",
            url: "https://images.unsplash.com/photo-1483347752412-bf2e99e67ba4?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1483347752412-bf2e99e67ba4?w=400",
            caption: "Green curtains of light over the frozen lake",
            location: "Jökulsárlón, Iceland",
            date: "2024-03-18",
            camera: "Sony A7R IV",
            settings: { aperture: "f/1.4", shutter: "10s", iso: 1600, focalLength: "24mm" }
          }
        ]
      },
      {
        id: "iceland-waterfalls",
        title: "Waterfalls",
        description: "The powerful cascades of Iceland's glacial rivers",
        coverImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
        photos: [
          {
            id: "iceland-waterfall-1",
            url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
            caption: "Skógafoss at golden hour",
            location: "Skógafoss, Iceland",
            date: "2024-03-16",
            camera: "Sony A7R IV",
            settings: { aperture: "f/11", shutter: "1/4s", iso: 100, focalLength: "16mm" }
          },
          {
            id: "iceland-waterfall-2",
            url: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1476610182048-b716b8518aae?w=400",
            caption: "Seljalandsfoss from behind the curtain",
            location: "Seljalandsfoss, Iceland",
            date: "2024-03-16",
            camera: "Sony A7R IV",
            settings: { aperture: "f/8", shutter: "1/8s", iso: 200, focalLength: "16mm" }
          }
        ]
      }
    ]
  },
  {
    id: "morocco",
    name: "Morocco",
    country: "Morocco",
    coordinates: { lat: 31.7917, lng: -7.0926 },
    dateRange: { start: "2024-05-10", end: "2024-05-20" },
    description: "From the blue streets of Chefchaouen to the golden dunes of the Sahara.",
    thumbnail: "https://images.unsplash.com/photo-1539020140153-e479b8c22e70?w=800",
    color: "#f59e0b",
    albums: [
      {
        id: "morocco-desert",
        title: "Sahara",
        description: "Sunrise and sunset over endless dunes",
        coverImage: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800",
        photos: [
          {
            id: "morocco-desert-1",
            url: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=400",
            caption: "First light on the dunes",
            location: "Erg Chebbi, Morocco",
            date: "2024-05-15",
            camera: "Sony A7R IV",
            settings: { aperture: "f/8", shutter: "1/250s", iso: 100, focalLength: "24mm" }
          },
          {
            id: "morocco-desert-2",
            url: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1489493887464-892be6d1daae?w=400",
            caption: "Camel caravan at sunset",
            location: "Merzouga, Morocco",
            date: "2024-05-15",
            camera: "Sony A7R IV",
            settings: { aperture: "f/5.6", shutter: "1/500s", iso: 200, focalLength: "70mm" }
          }
        ]
      },
      {
        id: "morocco-blue",
        title: "The Blue City",
        description: "Wandering through the azure alleyways of Chefchaouen",
        coverImage: "https://images.unsplash.com/photo-1553244619-cfd23e3e4ed6?w=800",
        photos: [
          {
            id: "morocco-blue-1",
            url: "https://images.unsplash.com/photo-1553244619-cfd23e3e4ed6?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1553244619-cfd23e3e4ed6?w=400",
            caption: "Blue walls and flower pots",
            location: "Chefchaouen, Morocco",
            date: "2024-05-12",
            camera: "Sony A7R IV",
            settings: { aperture: "f/2.8", shutter: "1/500s", iso: 400, focalLength: "35mm" }
          },
          {
            id: "morocco-blue-2",
            url: "https://images.unsplash.com/photo-1564507004663-b6dfb3c5dd0e?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1564507004663-b6dfb3c5dd0e?w=400",
            caption: "Narrow blue alley",
            location: "Chefchaouen, Morocco",
            date: "2024-05-12",
            camera: "Sony A7R IV",
            settings: { aperture: "f/4", shutter: "1/250s", iso: 800, focalLength: "24mm" }
          }
        ]
      }
    ]
  },
  {
    id: "cairo",
    name: "Cairo",
    country: "Egypt",
    coordinates: { lat: 30.0444, lng: 31.2357 },
    dateRange: { start: "2024-09-15", end: "2024-09-22" },
    description: "Ancient wonders meet modern chaos. The Pyramids of Giza stand tall against the desert sky.",
    thumbnail: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800",
    color: "#d97706",
    albums: [
      {
        id: "cairo-pyramids",
        title: "Pyramids of Giza",
        description: "The last remaining wonder of the ancient world",
        coverImage: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800",
        photos: [
          {
            id: "cairo-1",
            url: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=400",
            caption: "The Great Pyramid at sunset",
            location: "Giza, Egypt",
            date: "2024-09-17",
            camera: "Sony A7R IV",
            settings: { aperture: "f/8", shutter: "1/250s", iso: 100, focalLength: "24mm" }
          }
        ]
      }
    ]
  },
  {
    id: "japan",
    name: "Japan",
    country: "Japan",
    coordinates: { lat: 36.2048, lng: 138.2529 },
    dateRange: { start: "2024-04-01", end: "2024-04-15" },
    description: "Cherry blossoms, ancient temples, and the contrast between tradition and hyper-modernity.",
    thumbnail: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
    color: "#f472b6",
    albums: [
      {
        id: "japan-sakura",
        title: "Sakura Season",
        description: "Cherry blossoms in full bloom across Kyoto and Tokyo",
        coverImage: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=800",
        photos: [
          {
            id: "japan-sakura-1",
            url: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=400",
            caption: "Philosopher's Path at dawn",
            location: "Kyoto, Japan",
            date: "2024-04-05",
            camera: "Fujifilm GFX 100S",
            settings: { aperture: "f/2.8", shutter: "1/500s", iso: 400, focalLength: "63mm" }
          },
          {
            id: "japan-sakura-2",
            url: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?w=400",
            caption: "Senso-ji temple with cherry blossoms",
            location: "Tokyo, Japan",
            date: "2024-04-08",
            camera: "Fujifilm GFX 100S",
            settings: { aperture: "f/4", shutter: "1/250s", iso: 200, focalLength: "45mm" }
          }
        ]
      },
      {
        id: "japan-streets",
        title: "Urban Nights",
        description: "Neon-lit streets and cyberpunk aesthetics",
        coverImage: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
        photos: [
          {
            id: "japan-street-1",
            url: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400",
            caption: "Shibuya Crossing at night",
            location: "Tokyo, Japan",
            date: "2024-04-09",
            camera: "Fujifilm GFX 100S",
            settings: { aperture: "f/1.7", shutter: "1/60s", iso: 1600, focalLength: "45mm" }
          },
          {
            id: "japan-street-2",
            url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400",
            caption: "Golden Gai alleyways",
            location: "Shinjuku, Tokyo",
            date: "2024-04-10",
            camera: "Fujifilm GFX 100S",
            settings: { aperture: "f/2", shutter: "1/125s", iso: 3200, focalLength: "45mm" }
          }
        ]
      }
    ]
  },
  {
    id: "new-zealand",
    name: "New Zealand",
    country: "New Zealand",
    coordinates: { lat: -40.9006, lng: 174.8869 },
    dateRange: { start: "2023-12-10", end: "2024-01-05" },
    description: "Middle-earth landscapes, from volcanic plateaus to fjords and pristine beaches.",
    thumbnail: "https://images.unsplash.com/photo-1507699622108-4be3abd695ad?w=800",
    color: "#8b5cf6",
    albums: [
      {
        id: "nz-milford",
        title: "Milford Sound",
        description: "Dramatic fiords and cascading waterfalls",
        coverImage: "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=800",
        photos: [
          {
            id: "nz-milford-1",
            url: "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=400",
            caption: "Mitre Peak emerging from the mist",
            location: "Milford Sound, NZ",
            date: "2023-12-18",
            camera: "Sony A7R IV",
            settings: { aperture: "f/8", shutter: "1/125s", iso: 200, focalLength: "24mm" }
          }
        ]
      },
      {
        id: "nz-tongariro",
        title: "Tongariro",
        description: "Volcanic landscapes and emerald lakes",
        coverImage: "https://images.unsplash.com/photo-1580835128180-d14b0608a05d?w=800",
        photos: [
          {
            id: "nz-tongariro-1",
            url: "https://images.unsplash.com/photo-1580835128180-d14b0608a05d?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1580835128180-d14b0608a05d?w=400",
            caption: "Emerald Lakes on the Alpine Crossing",
            location: "Tongariro NP, NZ",
            date: "2023-12-22",
            camera: "Sony A7R IV",
            settings: { aperture: "f/11", shutter: "1/250s", iso: 100, focalLength: "16mm" }
          }
        ]
      }
    ]
  },
  {
    id: "patagonia",
    name: "Patagonia",
    country: "Argentina/Chile",
    coordinates: { lat: -50.9346, lng: -73.0275 },
    dateRange: { start: "2024-02-01", end: "2024-02-20" },
    description: "Raw wilderness at the end of the world. Towering peaks, glaciers, and untamed nature.",
    thumbnail: "https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800",
    color: "#10b981",
    albums: [
      {
        id: "patagonia-torres",
        title: "Torres del Paine",
        description: "The iconic granite towers of Patagonia",
        coverImage: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=800",
        photos: [
          {
            id: "patagonia-torres-1",
            url: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1531761535209-180857e963b9?w=400",
            caption: "Sunrise alpenglow on the towers",
            location: "Torres del Paine, Chile",
            date: "2024-02-08",
            camera: "Nikon Z9",
            settings: { aperture: "f/11", shutter: "1/125s", iso: 100, focalLength: "70mm" }
          },
          {
            id: "patagonia-torres-2",
            url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400",
            caption: "Cuernos del Paine reflected in Lake Pehoé",
            location: "Torres del Paine, Chile",
            date: "2024-02-09",
            camera: "Nikon Z9",
            settings: { aperture: "f/8", shutter: "1/60s", iso: 100, focalLength: "24mm" }
          }
        ]
      },
      {
        id: "patagonia-glaciers",
        title: "Glaciers",
        description: "Ancient ice formations of the Southern Patagonian Ice Field",
        coverImage: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800",
        photos: [
          {
            id: "patagonia-glacier-1",
            url: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=1600",
            thumbnail: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=400",
            caption: "Perito Moreno Glacier calving",
            location: "Los Glaciares NP, Argentina",
            date: "2024-02-14",
            camera: "Nikon Z9",
            settings: { aperture: "f/5.6", shutter: "1/1000s", iso: 400, focalLength: "200mm" }
          }
        ]
      }
    ]
  }
];

export const getTripById = (id: string): Trip | undefined => {
  return trips.find(trip => trip.id === id);
};

export const getAlbumById = (tripId: string, albumId: string): Album | undefined => {
  const trip = getTripById(tripId);
  return trip?.albums.find(album => album.id === albumId);
};
