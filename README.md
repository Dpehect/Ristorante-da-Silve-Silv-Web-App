# Ristorante da Silve

A premium, dynamic, and emotionally rich website for a tiny family-run restaurant in Fasano, Puglia.

This version takes inspiration from high-end scroll-driven experiences (like cravburgers.shop) while remaining warm, intimate and hand-crafted.

## Tech & Motion
- Next.js 15 + TypeScript
- **GSAP + ScrollTrigger** (primary animation engine)
- Lenis for buttery smooth scrolling
- React Hook Form + Zod
- Pure file-based JSON backend (`fs/promises`)

## Key Motion Highlights
- Parallax + scrub animations in Hero
- Staggered scroll reveals throughout (Story, Experience, Gallery)
- Menu: Staggered card entrance + GSAP hover + beautiful GSAP detail expansion + category transitions
- Reservation form with GSAP micro interactions

## Running

```bash
npm install
npm run dev
```

## Folder Structure
```
app/
  api/ (menu + reservations)
components/
  providers/GSAPProvider.tsx
  providers/LenisProvider.tsx
  Hero.tsx
  Story.tsx
  Experience.tsx
  Menu.tsx          ← Highly dynamic
  Gallery.tsx
  Reservation.tsx
data/menu.json
data/reservations.json
```

The site should feel alive and special. Every scroll interaction was designed with care.

