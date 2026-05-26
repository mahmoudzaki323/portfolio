# More Work Card Expansion Design

## Summary

The "More work" cards in the projects section currently truncate detail because they must fit inside compact carousel tiles. The change will keep each tile concise in the carousel, then let desktop users click a card to open a centered popup with the full project description and project link. Mobile will keep the current layout and compact presentation.

## Goals

- Preserve the current short card description as the teaser inside the carousel.
- Let users expand a "More work" card into a centered popup on larger screens.
- Show the long description in the popup without truncation.
- Dismiss the popup by clicking outside it or pressing `Escape`.
- Add a light backdrop blur and smooth, restrained motion.
- Keep the existing mobile layout unchanged.

## Non-Goals

- Do not redesign the featured projects carousel.
- Do not change the mobile card layout into a sheet or full-screen dialog.
- Do not introduce route changes, deep linking, or URL-based modal state.
- Do not add a new global modal system for unrelated sections.

## Current State

The "More work" cards are rendered by `Gallery4` in `src/components/ui/gallery4.tsx`. Each card currently uses the `description` field directly and wraps the entire card in an anchor when the project has a link. That creates two problems:

1. The card surface is too small for the fuller project copy.
2. Linked cards navigate immediately, which prevents an intermediate expanded view.

The project data already distinguishes between short and long copy in `src/data/projects.ts`:

- `description`: concise teaser
- `longDescription`: fuller explanation

That existing structure is enough to support the desired interaction.

## Chosen Approach

Use a local modal interaction inside `Gallery4` for desktop and tablet breakpoints, while keeping the current compact card behavior on mobile.

The card itself becomes a button-like trigger instead of a direct anchor. When activated on larger screens, it opens a popup that reuses the same project data but presents:

- image
- title
- year
- long description
- stats
- tags
- project link button when available

This keeps the carousel readable while moving the dense content into a focused layer.

## Interaction Design

### Card Surface

- Keep the short description on the card.
- Keep the visual treatment, image, title, stats, and tags aligned with the existing gallery style.
- Add a subtle "expand" affordance through cursor, hover, and link-row wording rather than extra explanatory copy.

### Expanded Popup

- Open centered within the viewport on non-mobile breakpoints.
- Use a constrained width so the content reads like a focused project detail card rather than a full page.
- Preserve the dark site palette and warm accent treatment already used in the projects section.
- Place the project link inside the popup as the only navigation action.

### Dismissal

- Clicking outside the popup closes it.
- Pressing `Escape` closes it.
- A visible close button in the top-right corner closes it.

## Layout and Visual Behavior

### Backdrop

- Use a dark overlay with a small blur amount.
- Keep the blur lighter than the photography gallery modal so the background still reads as context.

### Motion

- Animate backdrop opacity in.
- Animate the popup with a slight upward settle and mild scale transition.
- Keep timing near the existing modal motion already used elsewhere in the site so the behavior feels native to this codebase.

### Responsive Rules

- On mobile, keep the current compact layout and description clamp unchanged.
- On `md` and above, enable the centered popup behavior.

## Component Design

### Data Shape

Extend the `Gallery4Item` type with an optional `longDescription` field. `ProjectsSection` will pass both the short `description` and the fuller `longDescription`.

### Local State

`Gallery4` will own:

- the currently active item id or object for the popup
- open/closed modal state derived from that active item

This keeps the behavior isolated to the "More work" gallery and avoids introducing broader app state.

### Rendering Changes

- Replace the direct full-card anchor wrapper with a clickable card trigger.
- Render the popup through a portal to `document.body` so it layers cleanly above the page.
- Keep the external link as a dedicated button inside the popup.

### Accessibility

- Use a dialog container with `role="dialog"` and `aria-modal="true"`.
- Preserve keyboard access for the trigger.
- Support `Escape` dismissal.
- Keep focusable controls visible and styled with the existing focus ring treatment.

## Error Handling and Edge Cases

- If a project has no external link, the popup still opens and shows the project details without a CTA.
- If `longDescription` is missing, fall back to the short description in the popup.
- If the portal target is unavailable during server render, render no modal until the client is mounted.

## Testing Strategy

### Behavior to Verify

- Desktop card click opens the popup.
- Popup shows full project detail content.
- Outside click closes the popup.
- `Escape` closes the popup.
- Link button appears only when the project has a destination.
- Mobile layout remains visually unchanged.

### Verification Methods

- Add a focused UI test around any logic that is practical to isolate.
- Run the project build to catch type or JSX regressions.
- Verify the interaction manually in the local browser at desktop and mobile widths.

## Implementation Boundaries

Files expected to change:

- `src/components/ui/gallery4.tsx`
- `src/components/projects/ProjectsSection.tsx`
- `src/index.css`

No changes are needed to featured project components or the photography modal behavior beyond borrowing the established interaction pattern.
