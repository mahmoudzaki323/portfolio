# Immersive Portfolio

A modern, immersive portfolio website built with React, TypeScript, Three.js (React Three Fiber), and Tailwind CSS. Features an interactive 3D Earth for photography exploration and parallax-driven project showcases.

![Portfolio Preview](https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200)

## Features

### Photography Section
- **Interactive 3D Earth** with photorealistic satellite textures and atmospheric glow
- **Scroll-driven camera transitions** that fly between locations
- **Location markers** with pulsing animations
- **Trip cards** with smooth transitions
- **Album galleries** with photo lightbox viewer
- **EXIF data display** (camera settings, location, date)

### Projects Section
- **Parallax-driven layout** with scroll-triggered animations
- **Featured projects** with immersive presentations
- **Tech stack tags** and project statistics
- **Smooth reveal animations** using GSAP ScrollTrigger

### Technical Highlights
- Smooth scrolling with Lenis
- Custom cursor with hover states
- Page loader with progress animation
- Responsive design for all devices
- Performance optimized with code splitting
- GSAP animations throughout

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Three.js + React Three Fiber** - 3D graphics
- **Tailwind CSS** - Styling
- **GSAP** - Animations
- **Lenis** - Smooth scrolling

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone or navigate to the project
cd portfolio

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── earth/           # 3D Earth components
│   │   ├── Earth.tsx
│   │   ├── Atmosphere.tsx
│   │   ├── Stars.tsx
│   │   ├── LocationMarkers.tsx
│   │   ├── CameraController.tsx
│   │   └── EarthScene.tsx
│   ├── photography/     # Photography section
│   │   ├── TripCard.tsx
│   │   ├── AlbumGallery.tsx
│   │   └── PhotographySection.tsx
│   ├── projects/        # Projects section
│   │   ├── ProjectCard.tsx
│   │   ├── FeaturedProject.tsx
│   │   └── ProjectsSection.tsx
│   ├── CustomCursor.tsx
│   ├── Footer.tsx
│   ├── Hero.tsx
│   ├── Navigation.tsx
│   └── PageLoader.tsx
├── data/
│   ├── trips.ts         # Photography data
│   └── projects.ts      # Projects data
├── hooks/
│   ├── useLenis.ts
│   └── useScrollProgress.ts
├── lib/
│   └── utils.ts
├── App.tsx
├── main.tsx
└── index.css
```

## Data Structure

### Adding a New Trip

Edit `src/data/trips.ts`:

```typescript
{
  id: "unique-id",
  name: "Destination Name",
  country: "Country",
  coordinates: { lat: 0.0, lng: 0.0 },
  dateRange: { start: "2024-01-01", end: "2024-01-10" },
  description: "Trip description...",
  thumbnail: "https://image-url.jpg",
  color: "#hexcolor",
  albums: [
    {
      id: "album-id",
      title: "Album Title",
      description: "Album description...",
      coverImage: "https://image-url.jpg",
      photos: [
        {
          id: "photo-id",
          url: "https://full-size-image.jpg",
          thumbnail: "https://thumbnail-image.jpg",
          caption: "Photo caption",
          location: "Specific location",
          date: "2024-01-01",
          camera: "Camera model",
          settings: {
            aperture: "f/2.8",
            shutter: "1/1000s",
            iso: 100,
            focalLength: "24mm"
          }
        }
      ]
    }
  ]
}
```

### Adding a New Project

Edit `src/data/projects.ts`:

```typescript
{
  id: "unique-id",
  title: "Project Name",
  description: "Short description",
  longDescription: "Detailed description...",
  thumbnail: "https://image-url.jpg",
  images: ["https://image1.jpg", "https://image2.jpg"],
  tags: ["React", "TypeScript", "Three.js"],
  links: {
    demo: "https://demo-url.com",
    github: "https://github.com/repo",
    caseStudy: "#case-study"
  },
  stats: [
    { label: "Metric", value: "Value" }
  ],
  color: "#hexcolor",
  year: "2024",
  featured: true // or false
}
```

## Customization

### Colors

The color scheme is defined in `src/index.css` using Tailwind's CSS variables:

```css
@theme {
  --color-background: #0a0a0a;
  --color-foreground: #fafafa;
  --color-accent: #3b82f6;
  /* ... */
}
```

### Earth Textures

The Earth component uses these texture URLs (defined in `src/components/earth/Earth.tsx`):

```typescript
const TEXTURE_URLS = {
  map: "https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg",
  bumpMap: "https://unpkg.com/three-globe/example/img/earth-topology.png",
  specularMap: "https://unpkg.com/three-globe/example/img/earth-water.png",
  clouds: "https://unpkg.com/three-globe/example/img/earth-clouds.png",
  night: "https://unpkg.com/three-globe/example/img/earth-night.jpg",
};
```

You can replace these with your own high-resolution textures.

## Performance Considerations

1. **Lazy Loading**: Heavy sections are lazy-loaded for better initial load time
2. **Texture Optimization**: Earth textures are loaded asynchronously
3. **Code Splitting**: Vendor libraries are split into separate chunks
4. **ScrollTrigger**: Animations are optimized with `will-change` and proper cleanup

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## License

MIT License - feel free to use this as a template for your own portfolio!

## Credits

- Earth textures from [three-globe](https://github.com/vasturiano/three-globe)
- Fonts: Inter and JetBrains Mono from Google Fonts
- Icons: Lucide React
