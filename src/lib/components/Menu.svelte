<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Canvas } from '@threlte/core';
  import gsap from 'gsap';
  import MenuScene from './MenuScene.svelte';
  import menuData from '../data/menu.json';
  import { spring } from 'svelte/motion';

  let containerRef: HTMLElement;
  let hoveredDish: string | null = $state(null);
  let mousePos = $state({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    mousePos = { x: e.clientX, y: e.clientY };
  };

  onMount(() => {
    window.addEventListener("mousemove", handleMouseMove);
    
    const sections = gsap.utils.toArray('.menu-category');
    sections.forEach((section: any) => {
      gsap.from(section, {
        y: 100,
        opacity: 0,
        duration: 1.5,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          end: "top 50%",
          scrub: 1,
        }
      });

      const items = section.querySelectorAll(".menu-item");
      gsap.from(items, {
        y: 50,
        opacity: 0,
        stagger: 0.1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: section,
          start: "top 75%",
          end: "top 45%",
          scrub: 1,
        }
      });
    });
  });

  onDestroy(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener("mousemove", handleMouseMove);
    }
  });

  // Array of springs for hover state
  const springs: Record<string, any> = {};
  menuData.categories.forEach(c => {
    c.items.forEach(i => {
      springs[i.id] = spring({ x: 0 }, { stiffness: 0.1, damping: 0.4 });
    });
  });

  function handleMouseEnter(id: string) {
    hoveredDish = id;
    springs[id].set({ x: 10 });
  }

  function handleMouseLeave(id: string) {
    hoveredDish = null;
    springs[id].set({ x: 0 });
  }
</script>

<section bind:this={containerRef} class="relative min-h-screen py-32 px-8 md:px-24 bg-secondary">
  <div class="pointer-events-none fixed inset-0 z-0">
    <Canvas>
      <MenuScene isHovered={hoveredDish !== null} {mousePos} />
    </Canvas>
  </div>

  <div class="relative z-10 max-w-4xl mx-auto">
    <div class="text-center mb-24">
      <h2 class="text-sm tracking-[0.3em] uppercase text-accent mb-4">The Offering</h2>
      <h3 class="text-4xl md:text-6xl font-light tracking-wide text-primary">La Nostra Cucina</h3>
    </div>

    <div class="space-y-32">
      {#each menuData.categories as category}
        <div class="menu-category">
          <h4 class="text-2xl italic font-serif text-primary/80 border-b border-accent/20 pb-4 mb-12">
            {category.name}
          </h4>
          <div class="space-y-12">
            {#each category.items as item}
              <!-- svelte-ignore a11y_no_static_element_interactions -->
              <div
                class="menu-item group cursor-pointer"
                onmouseenter={() => handleMouseEnter(item.id)}
                onmouseleave={() => handleMouseLeave(item.id)}
                style="transform: translateX({$springs[item.id].x}px);"
              >
                <div class="flex justify-between items-baseline mb-2">
                  <h5 class="text-xl tracking-wider text-primary group-hover:text-accent transition-colors duration-500">
                    {item.name}
                  </h5>
                  <span class="text-accent/60 font-mono tracking-widest">{item.price}</span>
                </div>
                <p class="text-primary/50 text-sm tracking-wide max-w-2xl leading-relaxed">
                  {item.description}
                </p>
              </div>
            {/each}
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>
