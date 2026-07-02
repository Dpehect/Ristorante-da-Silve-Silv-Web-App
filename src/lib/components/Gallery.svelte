<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  import GalleryModal from './GalleryModal.svelte';

  gsap.registerPlugin(ScrollTrigger);

  export type GalleryImage = { src: string; title: string };

  const images: GalleryImage[] = [
    { src: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&q=80&auto=format&fit=crop', title: 'La Cucina' },
    { src: 'https://images.unsplash.com/photo-1551183053-bf91798d792b?w=1400&q=80&auto=format&fit=crop', title: 'I Sapori' },
    { src: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&q=80&auto=format&fit=crop', title: 'Il Mercato' },
    { src: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=1400&q=80&auto=format&fit=crop', title: 'La Tradizione' },
    { src: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=80&auto=format&fit=crop', title: 'La Sala' },
    { src: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1400&q=80&auto=format&fit=crop', title: "L'Arte" },
  ];

  let selectedIndex = $state<number | null>(null);
  let sectionRef: HTMLElement;

  function handleTilt(e: MouseEvent, el: HTMLElement) {
    const rect = el.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    const dy = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotateX: -dy * 14,
      rotateY: dx * 14,
      transformPerspective: 900,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  function resetTilt(el: HTMLElement) {
    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 0.8, ease: 'elastic.out(1, 0.6)', overwrite: 'auto' });
  }

  onMount(() => {
    const cards = gsap.utils.toArray<HTMLElement>('.g-card');
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { y: 80, opacity: 0, scale: 0.94, filter: 'blur(4px)' },
        {
          y: 0, opacity: 1, scale: 1, filter: 'blur(0px)',
          duration: 1.1,
          delay: i * 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef,
            start: 'top 78%',
          },
        }
      );
    });

    // Section header reveal
    gsap.from('.gallery-header > *', {
      y: 30, opacity: 0, stagger: 0.12, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef, start: 'top 80%' },
    });
  });
</script>

<section bind:this={sectionRef} class="py-32 px-8 md:px-16 bg-dark relative overflow-hidden">
  <!-- Subtle dot grid background -->
  <div
    class="absolute inset-0 opacity-[0.04] pointer-events-none"
    style="background-image: radial-gradient(circle at 1px 1px, #f5f0e6 1px, transparent 0); background-size: 28px 28px;"
  ></div>

  <div class="max-w-7xl mx-auto relative z-10">
    <!-- Header -->
    <div class="gallery-header text-center mb-20">
      <p class="text-accent text-xs tracking-[0.5em] uppercase mb-5">Visual Diary</p>
      <h2 class="text-5xl md:text-7xl font-light tracking-wide text-primary leading-none">Il Nostro Mondo</h2>
      <div class="w-12 h-px bg-accent/40 mx-auto mt-8"></div>
    </div>

    <!-- Grid: col-span and aspect-ratio classes define layout -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">

      <!-- Image 0 — hero (2 cols × 2 rows) -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="g-card md:col-span-2 relative overflow-hidden cursor-pointer group"
        style="aspect-ratio: 16/9; transform-style: preserve-3d;"
        onclick={() => selectedIndex = 0}
        onmousemove={(e) => handleTilt(e, e.currentTarget as HTMLElement)}
        onmouseleave={(e) => resetTilt(e.currentTarget as HTMLElement)}
      >
        <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style="background-image:url({images[0].src})"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent"></div>
        <div class="card-hover-layer absolute inset-0 bg-accent/0 group-hover:bg-accent/8 transition-all duration-500"></div>
        <div class="absolute bottom-5 left-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
          <p class="text-xs tracking-[0.4em] uppercase text-primary/80">{images[0].title}</p>
        </div>
        <div class="absolute top-4 right-4 w-8 h-8 border-t border-r border-primary/20 group-hover:border-accent/50 transition-colors duration-400"></div>
      </div>

      <!-- Image 1 (1 col) -->
      <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
      <div
        class="g-card relative overflow-hidden cursor-pointer group"
        style="aspect-ratio: 3/4; transform-style: preserve-3d;"
        onclick={() => selectedIndex = 1}
        onmousemove={(e) => handleTilt(e, e.currentTarget as HTMLElement)}
        onmouseleave={(e) => resetTilt(e.currentTarget as HTMLElement)}
      >
        <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style="background-image:url({images[1].src})"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-dark/50 via-transparent to-transparent"></div>
        <div class="card-hover-layer absolute inset-0 bg-accent/0 group-hover:bg-accent/8 transition-all duration-500"></div>
        <div class="absolute bottom-4 left-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
          <p class="text-xs tracking-[0.4em] uppercase text-primary/80">{images[1].title}</p>
        </div>
        <div class="absolute top-4 right-4 w-8 h-8 border-t border-r border-primary/20 group-hover:border-accent/50 transition-colors duration-400"></div>
      </div>

      <!-- Image 2 (1 col) -->
      <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
      <div
        class="g-card relative overflow-hidden cursor-pointer group"
        style="aspect-ratio: 4/3; transform-style: preserve-3d;"
        onclick={() => selectedIndex = 2}
        onmousemove={(e) => handleTilt(e, e.currentTarget as HTMLElement)}
        onmouseleave={(e) => resetTilt(e.currentTarget as HTMLElement)}
      >
        <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style="background-image:url({images[2].src})"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-dark/50 via-transparent to-transparent"></div>
        <div class="card-hover-layer absolute inset-0 bg-accent/0 group-hover:bg-accent/8 transition-all duration-500"></div>
        <div class="absolute bottom-4 left-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
          <p class="text-xs tracking-[0.4em] uppercase text-primary/80">{images[2].title}</p>
        </div>
        <div class="absolute top-4 right-4 w-8 h-8 border-t border-r border-primary/20 group-hover:border-accent/50 transition-colors duration-400"></div>
      </div>

      <!-- Image 3 (1 col) -->
      <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
      <div
        class="g-card relative overflow-hidden cursor-pointer group"
        style="aspect-ratio: 4/3; transform-style: preserve-3d;"
        onclick={() => selectedIndex = 3}
        onmousemove={(e) => handleTilt(e, e.currentTarget as HTMLElement)}
        onmouseleave={(e) => resetTilt(e.currentTarget as HTMLElement)}
      >
        <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style="background-image:url({images[3].src})"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-dark/50 via-transparent to-transparent"></div>
        <div class="card-hover-layer absolute inset-0 bg-accent/0 group-hover:bg-accent/8 transition-all duration-500"></div>
        <div class="absolute bottom-4 left-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
          <p class="text-xs tracking-[0.4em] uppercase text-primary/80">{images[3].title}</p>
        </div>
        <div class="absolute top-4 right-4 w-8 h-8 border-t border-r border-primary/20 group-hover:border-accent/50 transition-colors duration-400"></div>
      </div>

      <!-- Image 4 (2 cols, panoramic) -->
      <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
      <div
        class="g-card md:col-span-2 relative overflow-hidden cursor-pointer group"
        style="aspect-ratio: 21/9; transform-style: preserve-3d;"
        onclick={() => selectedIndex = 4}
        onmousemove={(e) => handleTilt(e, e.currentTarget as HTMLElement)}
        onmouseleave={(e) => resetTilt(e.currentTarget as HTMLElement)}
      >
        <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style="background-image:url({images[4].src})"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-dark/50 via-transparent to-transparent"></div>
        <div class="card-hover-layer absolute inset-0 bg-accent/0 group-hover:bg-accent/8 transition-all duration-500"></div>
        <div class="absolute bottom-5 left-5 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
          <p class="text-xs tracking-[0.4em] uppercase text-primary/80">{images[4].title}</p>
        </div>
        <div class="absolute top-4 right-4 w-8 h-8 border-t border-r border-primary/20 group-hover:border-accent/50 transition-colors duration-400"></div>
      </div>

      <!-- Image 5 (1 col) -->
      <!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
      <div
        class="g-card relative overflow-hidden cursor-pointer group"
        style="aspect-ratio: 4/3; transform-style: preserve-3d;"
        onclick={() => selectedIndex = 5}
        onmousemove={(e) => handleTilt(e, e.currentTarget as HTMLElement)}
        onmouseleave={(e) => resetTilt(e.currentTarget as HTMLElement)}
      >
        <div class="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" style="background-image:url({images[5].src})"></div>
        <div class="absolute inset-0 bg-gradient-to-t from-dark/50 via-transparent to-transparent"></div>
        <div class="card-hover-layer absolute inset-0 bg-accent/0 group-hover:bg-accent/8 transition-all duration-500"></div>
        <div class="absolute bottom-4 left-4 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400 ease-out">
          <p class="text-xs tracking-[0.4em] uppercase text-primary/80">{images[5].title}</p>
        </div>
        <div class="absolute top-4 right-4 w-8 h-8 border-t border-r border-primary/20 group-hover:border-accent/50 transition-colors duration-400"></div>
      </div>

    </div>
  </div>
</section>

{#if selectedIndex !== null}
  <GalleryModal {images} startIndex={selectedIndex} onClose={() => (selectedIndex = null)} />
{/if}
