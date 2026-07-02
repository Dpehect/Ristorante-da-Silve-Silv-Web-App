<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';

  let containerRef: HTMLElement;

  onMount(() => {
    gsap.from('.story-eyebrow', {
      y: 20, opacity: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: containerRef, start: 'top 80%' }
    });

    gsap.from('.story-quote', {
      y: 40, opacity: 0, duration: 1.2, ease: 'power3.out', delay: 0.1,
      scrollTrigger: { trigger: containerRef, start: 'top 75%' }
    });

    const paras = containerRef.querySelectorAll('.story-para');
    paras.forEach((p, i) => {
      gsap.from(p, {
        y: 50, opacity: 0, duration: 1.4, ease: 'power2.out', delay: i * 0.08,
        scrollTrigger: { trigger: p, start: 'top 82%', scrub: false }
      });
    });

    gsap.from('.story-image', {
      x: 60, opacity: 0, duration: 1.4, ease: 'power3.out',
      scrollTrigger: { trigger: containerRef, start: 'top 70%' }
    });

    gsap.from('.story-line', {
      scaleY: 0, transformOrigin: 'top', duration: 1.2, ease: 'power3.out',
      scrollTrigger: { trigger: containerRef, start: 'top 72%' }
    });
  });
</script>

<section bind:this={containerRef} class="relative py-40 px-8 md:px-20 overflow-hidden" style="background: #1a1713;">

  <!-- Background subtle gradient -->
  <div class="absolute inset-0 pointer-events-none"
    style="background: radial-gradient(ellipse 70% 50% at 80% 60%, rgba(184,115,58,0.06) 0%, transparent 65%);">
  </div>

  <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24 items-center relative z-10">

    <!-- Left: Text -->
    <div>
      <!-- Eyebrow -->
      <p class="story-eyebrow font-sans text-[10px] tracking-[0.55em] uppercase text-accent mb-10">La Nostra Storia</p>

      <!-- Large pull quote -->
      <blockquote class="story-quote font-serif text-3xl md:text-4xl font-light text-primary leading-snug mb-12 italic"
        style="font-size: clamp(1.6rem, 3.5vw, 2.5rem);">
        "We serve what we<br/>would serve our family."
      </blockquote>

      <!-- Story paragraphs -->
      <div class="space-y-6 text-primary/60 leading-relaxed font-sans" style="font-size: 0.9rem; font-weight: 300;">
        <p class="story-para">
          Da Silve is not a restaurant. It is our home, opened to those who seek not just a meal, but an experience of genuine Apulian hospitality.
        </p>
        <p class="story-para">
          Maria cooks what the sea and the land offer each morning. Silve pours the wine. The rhythm of the evening is dictated by the season, the catch, and the light.
        </p>
        <p class="story-para">
          We have been here since 1987. The table near the window has the best view of the trulli. We always keep it free until seven.
        </p>
      </div>

      <!-- Decorative detail -->
      <div class="flex items-center gap-4 mt-12">
        <div class="h-px w-16 bg-accent/40"></div>
        <span class="font-sans text-[10px] tracking-[0.4em] uppercase text-accent/60">Fasano · Since 1987</span>
      </div>
    </div>

    <!-- Right: Image + decorative line -->
    <div class="relative">
      <!-- Vertical accent line -->
      <div class="story-line absolute -left-8 top-0 w-px h-full bg-accent/20 hidden md:block"></div>

      <!-- Image -->
      <div class="story-image relative overflow-hidden" style="aspect-ratio: 4/5;">
        <img
          src="https://images.unsplash.com/photo-1559339352-11d035aa65de?w=900&q=85&auto=format&fit=crop"
          alt="Maria e Silve — la famiglia"
          class="w-full h-full object-cover"
          loading="lazy"
        />
        <!-- Warm overlay -->
        <div class="absolute inset-0" style="background: linear-gradient(to bottom, transparent 60%, rgba(26,23,19,0.7) 100%);"></div>
        <!-- Image caption -->
        <p class="absolute bottom-5 left-5 right-5 font-sans text-[10px] tracking-[0.4em] uppercase text-primary/50">
          Maria e Silve · Fasano, 1987
        </p>
      </div>

      <!-- Offset decorative frame -->
      <div class="absolute -top-4 -right-4 w-32 h-32 border border-accent/15 pointer-events-none"></div>
    </div>

  </div>
</section>
