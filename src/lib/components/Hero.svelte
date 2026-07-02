<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';

  gsap.registerPlugin(ScrollTrigger);

  let heroRef: HTMLElement;
  let bgImgRef: HTMLElement;

  // Split "da Silve" into characters for stagger animation
  const mainTitle = 'da Silve';
  const chars = mainTitle.split('').map((c, i) => ({ c, i }));
  const subtitleParts = ['FASANO', '·', 'PUGLIA', '·', '1987'];

  onMount(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Background image reveal
    tl.from(bgImgRef, { scale: 1.08, opacity: 0, duration: 2.2, ease: 'power2.out' }, 0);

    // Supertitle
    tl.from('.hero-supertitle', { y: 24, opacity: 0, duration: 0.8 }, 0.4);

    // Character-by-character reveal
    tl.from('.hero-char', {
      y: 80, opacity: 0, rotateX: 60,
      stagger: 0.045,
      duration: 0.9,
      transformOrigin: 'bottom center',
    }, 0.65);

    // Subtitle words
    tl.from('.hero-sub-word', {
      y: 16, opacity: 0, stagger: 0.07, duration: 0.6
    }, 1.15);

    // Divider
    tl.from('.hero-divider', { scaleX: 0, transformOrigin: 'left', duration: 0.9 }, 1.4);

    // CTA
    tl.from('.hero-cta', { y: 18, opacity: 0, duration: 0.7 }, 1.6);

    // Scroll indicator
    tl.from('.hero-scroll-indicator', { opacity: 0, y: -8, duration: 0.7 }, 2.0);

    // ── Parallax on scroll ──
    gsap.to(bgImgRef, {
      yPercent: 22,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef,
        start: 'top top',
        end: 'bottom top',
        scrub: 2,
      }
    });

    gsap.to('.hero-content', {
      y: 60,
      opacity: 0,
      ease: 'none',
      scrollTrigger: {
        trigger: heroRef,
        start: 'top top',
        end: '50% top',
        scrub: 1.5,
      }
    });
  });
</script>

<section bind:this={heroRef} class="relative h-screen flex flex-col items-center justify-center overflow-hidden" id="hero">

  <!-- Background image with parallax -->
  <div bind:this={bgImgRef} class="absolute inset-0 scale-110 will-change-transform">
    <img
      src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1920&q=85&auto=format&fit=crop"
      alt="Ristorante da Silve — interior"
      class="w-full h-full object-cover"
      fetchpriority="high"
    />
    <!-- Multi-stop overlay for depth -->
    <div class="absolute inset-0" style="background: linear-gradient(to bottom, rgba(19,17,9,0.55) 0%, rgba(19,17,9,0.30) 45%, rgba(30,27,23,0.85) 100%);"></div>
  </div>

  <!-- Grain overlay via CSS -->
  <div class="absolute inset-0 opacity-[0.03] pointer-events-none"
    style="background-image:url('https://grainy-gradients.vercel.app/noise.svg');">
  </div>

  <!-- Main content -->
  <div class="hero-content relative z-10 text-center px-6 select-none" style="perspective: 1200px;">

    <!-- Supertitle -->
    <p class="hero-supertitle font-sans text-[11px] tracking-[0.65em] uppercase text-accent/80 mb-8">
      Ristorante
    </p>

    <!-- Main title: character split -->
    <div class="overflow-hidden" style="perspective: 1000px">
      <h1 class="font-serif font-light text-primary leading-none"
        style="font-size: clamp(72px, 14vw, 160px); letter-spacing: 0.06em; transform-style: preserve-3d;">
        {#each chars as { c, i }}
          <span
            class="hero-char inline-block"
            style="transform-style: preserve-3d; display: inline-block; {c === ' ' ? 'width:0.3em;' : ''}"
          >
            {c === ' ' ? '\u00a0' : c}
          </span>
        {/each}
      </h1>
    </div>

    <!-- Subtitle -->
    <div class="flex items-center justify-center gap-3 md:gap-5 mt-7 mb-12">
      {#each subtitleParts as word}
        <span class="hero-sub-word font-sans text-[10px] md:text-xs tracking-[0.45em] uppercase text-primary/45">
          {word}
        </span>
      {/each}
    </div>

    <!-- Divider -->
    <div class="hero-divider w-28 h-px bg-accent/40 mx-auto mb-10 origin-left"></div>

    <!-- CTA -->
    <a
      href="#reservation"
      class="hero-cta font-sans inline-block text-[11px] tracking-[0.4em] uppercase border border-primary/20 px-10 py-4 text-primary/60 hover:text-primary hover:border-accent/60 transition-all duration-500"
    >
      Reserve Your Table
    </a>
  </div>

  <!-- Scroll indicator -->
  <div class="hero-scroll-indicator absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5">
    <span class="font-sans text-[9px] tracking-[0.55em] uppercase text-primary/25">Discover</span>
    <div class="w-px h-14 overflow-hidden">
      <div class="w-full h-full bg-gradient-to-b from-accent/50 to-transparent animate-[scrollDot_2s_ease-in-out_infinite]"></div>
    </div>
  </div>
</section>

<style>
  @keyframes scrollDot {
    0%   { transform: translateY(-100%); opacity: 0; }
    30%  { opacity: 1; }
    100% { transform: translateY(100%); opacity: 0; }
  }
</style>
