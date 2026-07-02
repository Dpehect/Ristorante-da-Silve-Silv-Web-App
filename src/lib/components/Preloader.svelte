<script lang="ts">
  import { onMount } from 'svelte';
  import { Canvas } from '@threlte/core';
  import PreloaderScene from './PreloaderScene.svelte';
  import gsap from 'gsap';

  let { onComplete }: { onComplete?: () => void } = $props();

  let containerRef: HTMLDivElement;
  let textRef: HTMLDivElement;
  let barRef: HTMLDivElement;

  onMount(() => {
    // ── First-visit check via sessionStorage ──
    if (typeof sessionStorage !== 'undefined' && sessionStorage.getItem('silve_visited')) {
      // Repeat visit: skip preloader entirely
      onComplete?.();
      return;
    }
    sessionStorage.setItem('silve_visited', '1');

    // ── Cinematic preloader sequence ──
    const tl = gsap.timeline({
      onComplete: () => onComplete?.()
    });

    // Progress bar fills
    tl.to(barRef, {
      scaleX: 1,
      duration: 2.5,
      ease: 'power2.inOut',
    }, 0);

    // Text fades in
    tl.to(textRef, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power3.out',
    }, 0.3);

    // Subtitle fades in
    tl.to('.preloader-sub', {
      opacity: 1,
      duration: 1.0,
      ease: 'power2.out',
    }, 1.0);

    // Hold, then fade the whole screen out
    tl.to(textRef, {
      opacity: 0,
      y: -20,
      duration: 0.8,
      ease: 'power3.in',
    }, 2.8);

    tl.to(containerRef, {
      opacity: 0,
      duration: 0.9,
      ease: 'power2.in',
    }, 3.0);
  });
</script>

<div bind:this={containerRef} class="fixed inset-0 z-[100] flex flex-col items-center justify-center overflow-hidden" style="background:#131109;">

  <!-- Three.js particle scene -->
  <div class="absolute inset-0 z-0">
    <Canvas>
      <PreloaderScene />
    </Canvas>
  </div>

  <!-- Radial warm glow -->
  <div class="absolute inset-0 pointer-events-none z-0"
    style="background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(184,115,58,0.12) 0%, transparent 70%);">
  </div>

  <!-- Content -->
  <div bind:this={textRef} class="relative z-10 text-center opacity-0 translate-y-8 pointer-events-none">
    <p class="text-xs tracking-[0.55em] uppercase text-accent/70 mb-6 font-sans">Ristorante</p>
    <h1 class="font-serif text-6xl md:text-8xl font-light text-primary leading-none tracking-wide">
      da Silve
    </h1>
    <p class="preloader-sub mt-5 text-xs tracking-[0.5em] uppercase text-primary/30 font-sans opacity-0">
      Fasano · Puglia
    </p>
  </div>

  <!-- Progress bar -->
  <div class="absolute bottom-0 left-0 right-0 h-px bg-primary/5">
    <div bind:this={barRef} class="h-full bg-accent/60 origin-left scale-x-0"></div>
  </div>
</div>
