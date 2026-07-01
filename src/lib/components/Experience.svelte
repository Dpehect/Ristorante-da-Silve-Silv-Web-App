<script lang="ts">
  import { onMount } from 'svelte';
  import { Canvas } from '@threlte/core';
  import gsap from 'gsap';
  import ExperienceScene from './ExperienceScene.svelte';

  let containerRef: HTMLElement;
  let elementsRef: HTMLDivElement;

  onMount(() => {
    const items = elementsRef.children;
    gsap.from(items, {
      y: 100,
      opacity: 0,
      stagger: 0.2,
      duration: 1.5,
      ease: "power3.out",
      scrollTrigger: {
        trigger: containerRef,
        start: "top 60%",
        end: "center center",
        scrub: 1,
      }
    });
  });
</script>

<section bind:this={containerRef} class="relative py-48 min-h-screen overflow-hidden">
  <div class="absolute inset-0 z-0">
    <Canvas>
      <ExperienceScene />
    </Canvas>
  </div>

  <div class="relative z-10 px-8 md:px-24 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh]">
    <div bind:this={elementsRef} class="space-y-16 text-center">
      <h2 class="text-4xl md:text-6xl font-light tracking-wide text-primary">The Atmosphere</h2>
      
      <div class="grid grid-cols-1 md:grid-cols-3 gap-12 text-primary/80">
        <div class="space-y-4">
          <h3 class="text-xl italic font-serif text-accent">Intimate</h3>
          <p class="text-sm tracking-wide leading-relaxed">Only five tables per evening. Ensuring an environment of peace, connection, and full attention.</p>
        </div>
        <div class="space-y-4">
          <h3 class="text-xl italic font-serif text-accent">Curated</h3>
          <p class="text-sm tracking-wide leading-relaxed">A cellar built over decades. Wines selected to complement the hyper-seasonal ingredients.</p>
        </div>
        <div class="space-y-4">
          <h3 class="text-xl italic font-serif text-accent">Timeless</h3>
          <p class="text-sm tracking-wide leading-relaxed">Puglian stone, warm lighting, and the scent of wild herbs. A space where time slows down.</p>
        </div>
      </div>
    </div>
  </div>
</section>
