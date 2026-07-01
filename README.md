# Ristorante da Silve — A Cinematic Digital Experience

A completely hand-crafted, premium website for a tiny family-run restaurant in Fasano, Puglia.

Built to feel like an intimate invitation rather than a commercial website.

## Design Philosophy
- Apple-level minimalism + warm Italian soul
- Every motion is deliberate and slow
- Heavy but tasteful use of Framer Motion
- Subtle, poetic Three.js used only in Hero and menu interactions
- Smooth Lenis scrolling

## Tech
- Next.js 15 + TypeScript
- Framer Motion
- @react-three/fiber + drei + three.js
- Lenis (smooth scroll)
- React Hook Form + Zod
- Pure JSON file backend (fs/promises)

## Running the project

```bash
cd /path/to/trygrok1
npm install
npm run dev
```

Visit http://localhost:3000

## Key Highlights
- Cinematic Hero with subtle light-ray WebGL
- Scroll-driven personal story
- Highly interactive menu with 3D tilt cards + luxurious detail panels
- Refined reservation flow with beautiful success state
- JSON-driven menu + reservations

## Folder Structure

```
app/
  api/               # JSON backend routes
  layout.tsx
  page.tsx
components/
  Hero.tsx           # + ThreeHeroBackground
  Story.tsx          # Scroll cinematic storytelling
  Menu.tsx           # Star of the site — tilt + detail
  Reservation.tsx
  Gallery.tsx
  ...
data/
  menu.json
  reservations.json
```

## Notes
The backend is intentionally file-based. All reservations are appended to `data/reservations.json`.

This project was rebuilt from the ground up to feel personal, emotional, and hand-crafted.
