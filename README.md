# Ristorante da Silve

A cinematic, premium, and deeply alive website for a tiny family-run restaurant in Fasano, Puglia.

This redesign combines the powerful scroll-driven storytelling of sites like cravburgers.shop with warm, elegant Italian soul — using heavy GSAP + ScrollTrigger and subtle, refined Three.js interactions (especially in the Menu).

## Key Features
- GSAP ScrollTrigger for rich section reveals, parallax, and staggered animations
- Elegant @react-three/fiber 3D dish previews in the Menu (gentle mouse tilt + breathing motion)
- Lenis smooth scrolling
- JSON-powered menu + reservations
- Intimate, high-end, hand-crafted feel

## Animation Strategy
- **GSAP + ScrollTrigger** is the backbone (staggers, scrubs, parallax, section triggers)
- **Three.js** is used sparingly and elegantly for the menu — each dish has a small refined 3D preview that reacts to hover with tilt and subtle animation. Never flashy.
- Micro interactions use GSAP timelines for premium feel.

The site should feel alive while staying warm and personal.

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

