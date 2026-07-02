<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  import MenuDishCard from './MenuDishCard.svelte';
  import MenuModal from './MenuModal.svelte';
  import rawMenu from '$lib/data/menu.json';

  gsap.registerPlugin(ScrollTrigger);

  type Dish = {
    id: string; name: string; tagline: string; description: string;
    story: string; ingredients: string[]; price: string; image: string;
  };
  type Category = {
    name: string; particleTheme: string; color: string;
    orbColor1: number[]; orbColor2: number[]; items: Dish[];
  };

  const menu = rawMenu as { categories: Category[] };

  let sectionRef: HTMLElement;
  let activeDish = $state<Dish | null>(null);
  let activeCategory = $state<Category | null>(null);

  function openDish(dish: Dish, category: Category) {
    activeDish = dish;
    activeCategory = category;
  }

  function closeDish() {
    activeDish = null;
    activeCategory = null;
  }

  onMount(() => {
    // Section header
    gsap.from('.menu-heading', {
      y: 40, opacity: 0, stagger: 0.1, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef, start: 'top 78%' },
    });

    // Category labels
    gsap.from('.cat-label', {
      x: -24, opacity: 0, stagger: 0.12, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: sectionRef, start: 'top 70%' },
    });

    // Cards — staggered per row
    const cards = gsap.utils.toArray<HTMLElement>('.menu-card-wrap');
    cards.forEach((card, i) => {
      gsap.fromTo(card,
        { y: 70, opacity: 0, scale: 0.95 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 1.1,
          delay: (i % 3) * 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          }
        }
      );
    });
  });
</script>

<section bind:this={sectionRef} class="relative py-36 px-8 md:px-16 bg-secondary overflow-hidden">

  <!-- Background texture — warm noise gradient -->
  <div class="absolute inset-0 pointer-events-none"
    style="background: radial-gradient(ellipse 80% 60% at 20% 40%, #8b735508 0%, transparent 60%),
                        radial-gradient(ellipse 60% 50% at 80% 70%, #4a3a2808 0%, transparent 60%);">
  </div>

  <div class="max-w-7xl mx-auto relative z-10">
    <!-- Header -->
    <div class="text-center mb-24">
      <p class="menu-heading text-accent text-xs tracking-[0.5em] uppercase mb-5">La Nostra Cucina</p>
      <h2 class="menu-heading text-5xl md:text-7xl font-light tracking-wide text-primary leading-none">The Offering</h2>
      <div class="menu-heading w-12 h-px bg-accent/40 mx-auto mt-8"></div>
      <p class="menu-heading text-primary/40 text-sm mt-6 tracking-wide max-w-sm mx-auto leading-relaxed">
        Each dish carries a season, a memory, a name. Hover to feel it. Click to know its story.
      </p>
    </div>

    <!-- Categories -->
    <div class="space-y-24">
      {#each menu.categories as cat}
        <div>
          <!-- Category label -->
          <div class="cat-label flex items-center gap-5 mb-10">
            <div class="h-px flex-1" style="background: linear-gradient(90deg, {cat.color}50, transparent)"></div>
            <h3 class="text-xs tracking-[0.5em] uppercase font-light" style="color:{cat.color}">{cat.name}</h3>
            <div class="h-px w-12" style="background: {cat.color}30"></div>
          </div>

          <!-- Dish Cards Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
            {#each cat.items as dish}
              <div class="menu-card-wrap">
                <MenuDishCard
                  {dish}
                  category={cat}
                  onOpen={() => openDish(dish, cat)}
                />
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>

    <!-- Bottom note -->
    <p class="text-center text-primary/25 text-xs tracking-widest mt-24">
      Menu changes with the season and the sea. Ask your host for today's specials.
    </p>
  </div>
</section>

<!-- Dish Detail Modal -->
{#if activeDish && activeCategory}
  <MenuModal
    dish={activeDish}
    category={activeCategory}
    onClose={closeDish}
  />
{/if}
