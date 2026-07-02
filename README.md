# Ristorante da Silve

**Live Site:** https://ristorante-da-silve-silv-web-app.vercel.app

## Project Overview

Ristorante da Silve is a high-performance, cinematic web application engineered to deliver a premium digital experience. The architecture emphasizes advanced motion design, WebGL-based rendering, and precise state orchestration without compromising on frame rates or structural integrity. 

## Architecture & Technology Stack

- **Core Framework:** SvelteKit, Svelte 5 (Runes), TypeScript
- **Styling Architecture:** Tailwind CSS, PostCSS, Custom CSS Variables
- **Animation Orchestration:** GSAP (GreenSock), ScrollTrigger
- **WebGL & 3D Rendering:** Three.js, Threlte (@threlte/core, @threlte/extras)
- **Custom Graphics Pipeline:** Custom GLSL (Vertex and Fragment shaders)
- **Smooth Scroll:** Lenis
- **Build & Deployment:** Vite, Vercel (adapter-vercel)

## Technical Implementation Details

### State Management & Reactivity
Leveraging Svelte 5's Runes (`$state`, `$derived`, `$effect`), the application achieves fine-grained reactivity. This architectural decision enables highly efficient DOM updates without virtual DOM overhead, a critical requirement when synchronizing UI state with intensive WebGL render loops and complex GSAP timelines.

### WebGL & Custom Shader Pipeline
The application bypasses standard DOM rendering in key areas to utilize hardware-accelerated WebGL through Three.js and Threlte, ensuring 60fps performance during complex visual sequences.
- **Custom GLSL Shaders:** Implemented bespoke shaders for non-standard visual effects, including:
  - Procedural noise generation (`fractalNoise`, `smoothNoise`) for dynamic materials and atmospheric depth.
  - Fresnel rim lighting calculations within fragment shaders, utilizing camera position and surface normals for dynamic 3D lighting.
  - Instanced rendering and custom particle systems utilizing `gl_PointSize` and time-based trigonometric functions for organic, physics-simulated movement.
- **Threlte Integration:** Seamlessly bridged declarative Svelte components with the imperative Three.js scene graph. Memory allocation, texture loading, and geometry disposal are strictly managed within Svelte's lifecycle hooks (`onMount`, `onDestroy`) to guarantee zero memory leaks.

### Advanced Animation Orchestration
- **GSAP Timelines:** Complex, multi-stage entrance animations (e.g., the cinematic preloader, hero character-split reveal, and spatial modal transitions) are orchestrated using tightly synchronized GSAP timelines.
- **Scroll-Driven Physics:** ScrollTrigger maps scroll velocity and progress directly to CSS transforms and WebGL uniforms.
- **Performance Optimization:** Critical rendering paths are optimized. Animations strictly utilize composited properties (`transform`, `opacity`) to avoid layout thrashing and paint bottlenecks. `will-change` hints and hardware acceleration are applied strategically.

### Application Lifecycle & Routing
- **Preloader Logic:** Implemented a session-storage gated preloading sequence. The application conditionally blocks the initial render tree until the WebGL context is initialized and the introductory timeline completes, gracefully bypassing on subsequent client-side routes.
- **SPA Configuration:** Configured SvelteKit for strict Single Page Application (SPA) mode (`ssr = false`) to accommodate immediate client-side Three.js canvas generation, bypassing SSR hydration mismatches with WebGL contexts.

## Developer Proficiency Demonstrated

This repository serves as a comprehensive demonstration of advanced frontend engineering capabilities, specifically highlighting:
- Deep understanding of modern JavaScript/TypeScript ecosystems, component-driven architecture, and reactive paradigms.
- Proficiency in low-level graphics programming (GLSL, Three.js) and bridging isolated 3D contexts with standard DOM environments.
- Mastery of complex animation orchestration, easing algorithms, and browser rendering performance optimization.
- Ability to architect maintainable, strongly-typed codebases capable of handling heavy visual computation.
