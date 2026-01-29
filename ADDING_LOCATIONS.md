# How to Add Locations, Albums, and Photos

This guide explains how to manage the photography content in your portfolio.

## File Location

All trip/location data is stored in:
```
portfolio/src/data/trips.ts
```

## Data Structure Overview

```
Trip (Location)
├── id: unique identifier (lowercase, hyphenated)
├── name: display name
├── country: country name
├── coordinates: { lat, lng }
├── dateRange: { start, end }
├── description: short description
├── thumbnail: cover image URL
├── color: accent color (hex)
└── albums: Album[]
        ├── id: unique identifier
        ├── title: album title
        ├── description: album description
        ├── coverImage: album cover URL
        └── photos: Photo[]
                ├── id: unique identifier
                ├── url: full-size image URL
                ├── thumbnail: thumbnail URL
                ├── caption: photo caption
                ├── location: specific location
                ├── date: date taken
                ├── camera: camera used (optional)
                └── settings: { aperture, shutter, iso, focalLength } (optional)
```

---

## Adding a New Location (Trip)

1. Open `portfolio/src/data/trips.ts`
2. Add a new object to the `trips` array:

```typescript
{
  id: "paris",                              // Unique ID (lowercase, hyphenated)
  name: "Paris",                            // Display name
  country: "France",                        // Country
  coordinates: { lat: 48.8566, lng: 2.3522 }, // Get from Google Maps
  dateRange: { start: "2024-10-15", end: "2024-10-22" },
  description: "The City of Light. Iconic architecture, world-class art, and romantic boulevards.",
  thumbnail: "https://your-image-host.com/paris-cover.jpg",
  color: "#e11d48",                         // Accent color for this location
  albums: []                                // Start with empty, add albums below
}
```

### Getting Coordinates

1. Go to [Google Maps](https://maps.google.com)
2. Right-click on the location
3. Click the coordinates to copy them
4. Format: `{ lat: FIRST_NUMBER, lng: SECOND_NUMBER }`

### Choosing Colors

Pick a color that represents the location. Use hex format:
- `#f97316` - Orange
- `#eab308` - Yellow
- `#22c55e` - Green
- `#3b82f6` - Blue
- `#8b5cf6` - Purple
- `#f472b6` - Pink
- `#06b6d4` - Cyan

---

## Adding an Album to a Location

Find the location's `albums: []` array and add:

```typescript
albums: [
  {
    id: "paris-eiffel",                     // Unique ID within this trip
    title: "Eiffel Tower",                  // Album title
    description: "The iconic iron lattice tower",
    coverImage: "https://your-image-host.com/eiffel-cover.jpg",
    photos: []                              // Add photos here
  },
  {
    id: "paris-louvre",
    title: "The Louvre",
    description: "World's largest art museum",
    coverImage: "https://your-image-host.com/louvre-cover.jpg",
    photos: []
  }
]
```

---

## Adding Photos to an Album

Find the album's `photos: []` array and add:

```typescript
photos: [
  {
    id: "paris-eiffel-1",                   // Unique ID
    url: "https://your-host.com/eiffel-full.jpg",      // Full-size image
    thumbnail: "https://your-host.com/eiffel-thumb.jpg", // Thumbnail (400px width)
    caption: "Eiffel Tower at sunset",      // Photo caption
    location: "Champ de Mars, Paris",       // Specific location
    date: "2024-10-16",                     // Date taken (YYYY-MM-DD)
    camera: "Sony A7R IV",                  // Optional: Camera used
    settings: {                             // Optional: Camera settings
      aperture: "f/8",
      shutter: "1/250s",
      iso: 100,
      focalLength: "24mm"
    }
  },
  {
    id: "paris-eiffel-2",
    url: "https://your-host.com/eiffel-night.jpg",
    thumbnail: "https://your-host.com/eiffel-night-thumb.jpg",
    caption: "Sparkling lights at midnight",
    location: "Trocadéro, Paris",
    date: "2024-10-17"
    // camera and settings are optional
  }
]
```

---

## Complete Example

Here's a complete trip with one album and two photos:

```typescript
{
  id: "paris",
  name: "Paris",
  country: "France",
  coordinates: { lat: 48.8566, lng: 2.3522 },
  dateRange: { start: "2024-10-15", end: "2024-10-22" },
  description: "The City of Light. Iconic architecture and romantic boulevards.",
  thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
  color: "#e11d48",
  albums: [
    {
      id: "paris-landmarks",
      title: "Landmarks",
      description: "Iconic Parisian architecture",
      coverImage: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800",
      photos: [
        {
          id: "paris-eiffel-1",
          url: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1600",
          thumbnail: "https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400",
          caption: "Eiffel Tower at golden hour",
          location: "Champ de Mars, Paris",
          date: "2024-10-16",
          camera: "Sony A7R IV",
          settings: { aperture: "f/8", shutter: "1/250s", iso: 100, focalLength: "24mm" }
        },
        {
          id: "paris-arc-1",
          url: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=1600",
          thumbnail: "https://images.unsplash.com/photo-1549144511-f099e773c147?w=400",
          caption: "Arc de Triomphe",
          location: "Place Charles de Gaulle, Paris",
          date: "2024-10-17"
        }
      ]
    }
  ]
}
```

---

## Location Order Matters!

The order of trips in the array determines the camera travel path. Order them geographically for smooth camera transitions:

```typescript
// Good order (follows geographic path):
1. San Francisco (West Coast)
2. San Diego (South)
3. Durham (East Coast)
4. Iceland (North Atlantic)
5. Morocco (Africa)
6. Cairo (Middle East)
7. Japan (Asia)
8. New Zealand (Oceania)
9. Patagonia (South America)

// Bad order (camera jumps around):
1. San Francisco
2. Japan (jumps across Pacific!)
3. Morocco (jumps back west!)
```

---

## Image Hosting Options

For hosting your photos, you can use:

1. **Unsplash** (for demo/placeholder images):
   - Format: `https://images.unsplash.com/photo-XXXXX?w=800`

2. **Cloudinary** (recommended for production):
   - Free tier: 25GB storage
   - Auto-optimization and thumbnails

3. **AWS S3 + CloudFront**:
   - Best for high-traffic sites

4. **Your own server**:
   - Store in `/public/photos/` folder
   - Reference as `/photos/your-image.jpg`

---

## Tips

1. **Thumbnails**: Use 400px width for thumbnails, 1600px for full-size
2. **Unique IDs**: Always use unique IDs across all trips/albums/photos
3. **Test**: After adding content, refresh the page and scroll through
4. **Backup**: Keep a backup of your trips.ts file
