# Design System: Cinematic Explorer

## Aesthetic Direction
Dark, immersive, editorial - a high-end travel documentary interface that puts the photography first while showcasing technical prowess through the 3D globe.

## Color Palette
```css
--color-background: #0a0a0f      /* Deep obsidian */
--color-surface: #12121a         /* Card surfaces */
--color-surface-hover: #1a1a25   /* Interactive hover */
--color-border: rgba(255,255,255,0.08)
--color-text-primary: #fafafa
--color-text-secondary: rgba(255,255,255,0.6)
--color-text-tertiary: rgba(255,255,255,0.4)
```

## Typography
- Display: "Space Grotesk" - Bold, technical, distinctive
- Body: "Inter" - Clean, readable
- Mono: "JetBrains Mono" - Data, coordinates

## Motion Principles
- Easing: `cubic-bezier(0.16, 1, 0.3, 1)` (expo out) for reveals
- Duration: 400-600ms for UI, 800-1200ms for camera
- Stagger: 50-100ms between list items

## Globe Specifications
- Bright daytime lighting with warm sun
- Subtle atmosphere glow (not bubble effect)
- 2D circular markers using Drei Billboard
- Smooth camera transitions between locations
