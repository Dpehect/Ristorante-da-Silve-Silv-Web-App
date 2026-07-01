# Ristorante-da-Silve-Silv-Web-App

A premium, intimate portfolio project: the complete digital presence for **Ristorante da Silve (Silvè)** — a tiny, family-run restaurant with no written menu. Maria cooks what the season offers. Silve serves. Guests are invited into their home.

This is designed to be one of the most emotionally resonant and elegant restaurant websites a developer can include in a portfolio.

---

## ✨ Design & Experience Philosophy

- **Warm rustic-luxury Italian**: Terracotta, warm beige, olive, deep wood, cream, natural textures.
- **Typography**: Playfair Display (serif) for soulful headings. Inter for clean, readable body.
- **UX**: Slow, deliberate, delightful. Subtle Framer Motion fades, elegant reveals, generous spacing, meaningful micro-interactions. No flashy animations.
- **Tone**: Personal invitation, never corporate. It should feel like you have already been welcomed to the table.

---

## 🗂 Complete Recommended Project Structure

```
.
├── app/
│   ├── api/
│   │   ├── menu/
│   │   │   └── route.ts          # GET — reads data/menu.json (fs/promises)
│   │   └── reservations/
│   │       └── route.ts          # POST — validates + appends to reservations.json
│   ├── admin/
│   │   └── reservations/
│   │       └── page.tsx          # Simple gated view of all reservations
│   ├── layout.tsx                # Fonts + global metadata + Sonner Toaster
│   ├── page.tsx                  # Full single-page experience
│   └── globals.css               # Premium color system + elegant micro-styles
├── components/
│   ├── Navbar.tsx                # Sticky + scroll blur + beautiful mobile menu
│   ├── Hero.tsx                  # Cinematic hero with delicate scroll cue
│   ├── Story.tsx                 # Emotional cards about Maria & Silve
│   ├── Experience.tsx            # "Tonight at Our Table" principles
│   ├── MenuSection.tsx           # *The creative centerpiece* — live JSON, tabs, expandable poetic cards
│   ├── Gallery.tsx               # Masonry + elegant full-screen modal
│   ├── ReservationForm.tsx       # RHF + Zod + beautiful success state + API
│   ├── FindUs.tsx                # Address + elegant custom "map" + WhatsApp CTA
│   └── Footer.tsx
├── data/
│   ├── menu.json                 # The living seasonal tasting menu
│   └── reservations.json         # All bookings (file-based "database")
├── lib/
│   ├── types.ts                  # Strict TypeScript interfaces
│   └── utils.ts                  # cn(), formatting helpers, time slots
├── public/
└── README.md
```

---

## 🔧 Technical Architecture (JSON Backend — 100% File-Based)

The project **does not use any database**.

All persistence is achieved using Node.js `fs/promises` inside Next.js API routes:

### `/api/menu` (GET)
```ts
const filePath = path.join(process.cwd(), "data", "menu.json");
const contents = await fs.readFile(filePath, "utf8");
```
Returns the full seasonal menu with categories and dishes.

### `/api/reservations` (POST)
- Accepts validated payload (Zod)
- Reads the current JSON file
- Appends the new reservation object (with generated id + ISO timestamp)
- Writes it back with pretty formatting (`JSON.stringify(..., null, 2)`)

The same route also supports `GET` for the admin view.

You can inspect or seed reservations at any time by editing `data/reservations.json` directly.

**Why this approach?** It is explicit, inspectable, and perfect for a portfolio. Every change is visible in git.

---

## 📍 Core Features Implemented

- **Elegant Navbar** — sticky, scroll-triggered blur + gorgeous mobile menu
- **Cinematic Hero** — warm overlay, refined typography, smooth scroll CTA
- **Our Story** — staggered emotional cards telling the Maria + Silve narrative
- **The Experience** — "Tonight at Our Table" cards explaining the ritual
- **Menu Section** (standout piece)
  - Fetches live from `/api/menu`
  - Category tabs with elegant underline transitions
  - Expandable dish cards that animate open with Framer Motion
  - Italian + English names, poetic descriptions, diet tags
- **Gallery** — Masonry-style responsive grid with cinematic full-screen modal
- **Reservation Form** (the emotional peak)
  - React Hook Form + Zod validation
  - Spacious, luxurious inputs
  - Native date picker + curated time slots
  - On success: beautiful animated confirmation + the data is actually written to `reservations.json`
- **Find Us** — Address, phone, elegant hand-crafted map visual, WhatsApp link to Silve
- **Admin** — `/admin/reservations` — simple passphrase gate ("silve") showing live reservations
- Full responsiveness and mobile excellence

---

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Visit:
- http://localhost:3000 — The full experience
- http://localhost:3000/admin/reservations — The reservation book (passphrase: `silve`)

---

## 🛠 Tech Stack

- **Next.js 15/16** (App Router) + TypeScript
- Tailwind CSS (custom premium design tokens)
- Framer Motion — tasteful, considered animations only
- React Hook Form + Zod
- Sonner — elegant toast notifications
- Lucide icons
- Pure JSON + Node `fs/promises` for backend

---

## 📸 Image Strategy

Images are currently loaded from Unsplash (high-quality curated food + interior). For a real production site, replace with:
- Professional photography of the actual restaurant
- Add images into `public/images/` and update `src` accordingly

---

## 💡 Why This Stands Out as a Portfolio Project

1. **Storytelling first** — The entire site is an emotional narrative rather than a menu dump.
2. **Technical rigor** — Real working file-based backend visible in the API routes.
3. **Creative UX** — The Menu section and Reservation flow feel thoughtful and special.
4. **Polish** — Beautiful typography system, generous whitespace, micro-details everywhere (scroll indicator, expanding cards, success state).
5. **Production-ready patterns** — TypeScript types, clean folder structure, accessible focus states, loading states, proper metadata/SEO.

---

## 📝 Notes & Future Enhancements

- Add real photography + a few interior videos for the hero.
- Consider a small Node script to seed sample reservations.
- For production, add a proper password-protected admin route or basic auth.
- The “no menu” philosophy is faithfully honored in the UI.

---

Built with love and attention to every detail — just like Maria’s cooking.

---

*da Silve • Via Tinella 18, Fasano • A table at home.*
