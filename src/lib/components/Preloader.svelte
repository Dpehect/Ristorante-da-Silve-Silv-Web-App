<script lang="ts">
  import { onMount, createEventDispatcher } from 'svelte';
  import { Canvas } from '@threlte/core';
  import PreloaderScene from './PreloaderScene.svelte';
  import gsap from 'gsap';

  const dispatch = createEventDispatcher();
  
  let containerRef: HTMLDivElement;
  let textRef: HTMLDivElement;

  onMount(() => {
    // Artificial delay for the cinematic effect
    const timer = setTimeout(() => {
      const tl = gsap.timeline({
        onComplete: () => dispatch('complete')
      });

      tl.to(textRef, {
        opacity: 1,
        duration: 2,
        ease: "power2.inOut",
      })
      .to(textRef, {
        opacity: 0,
        duration: 1.5,
        delay: 1,
        ease: "power2.inOut",
      })
      .to(containerRef, {
        opacity: 0,
        duration: 2,
        ease: "power2.inOut",
      }, "-=0.5");
    }, 100);

    return () => clearTimeout(timer);
  });
</script>

<div bind:this={containerRef} class="fixed inset-0 z-50 flex items-center justify-center bg-secondary">
  <div class="absolute inset-0 z-0">
    <Canvas>
      <PreloaderScene />
    </Canvas>
  </div>
  
  <div bind:this={textRef} class="relative z-10 opacity-0 pointer-events-none mix-blend-difference text-primary text-center">
    <h1 class="text-4xl md:text-6xl tracking-[0.2em] uppercase font-light">
      Ristorante<br/>da Silve
    </h1>
    <p class="mt-4 text-sm tracking-widest text-accent uppercase">
      Fasano, Puglia
    </p>
  </div>
</div>
