<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';

  let heroRef: HTMLElement;
  let textRef: HTMLDivElement;

  onMount(() => {
    // Parallax effect on scroll
    gsap.to(textRef, {
      y: 150,
      opacity: 0.2,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef,
        start: 'top top',
        end: 'bottom top',
        scrub: true
      }
    });
  });
</script>

<section bind:this={heroRef} class="relative h-screen flex flex-col items-center justify-center overflow-hidden">
  <!-- Fallback Background Image -->
  <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516684732162-798a0062be99?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-20"></div>
  <div class="absolute inset-0 bg-gradient-to-b from-secondary/50 via-secondary/80 to-secondary"></div>
  
  <div bind:this={textRef} class="relative z-10 text-center px-4">
    <h1 class="text-5xl md:text-8xl tracking-[0.15em] uppercase font-light mb-6 text-primary">
      Da Silve
    </h1>
    <p class="text-accent tracking-[0.3em] uppercase text-xs md:text-sm">
      Ristorante • Fasano
    </p>
  </div>
</section>
