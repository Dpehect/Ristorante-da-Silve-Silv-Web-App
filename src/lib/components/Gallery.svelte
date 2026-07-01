<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';
  import { fade, scale } from 'svelte/transition';
  import { cubicOut } from 'svelte/easing';

  const placeholderImages = [
    "https://images.unsplash.com/photo-1544148103-0773bf10d330?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=2070&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1512152272829-e3139592d56f?q=80&w=2070&auto=format&fit=crop"
  ];

  let containerRef: HTMLElement;
  let selectedImg: string | null = $state(null);

  onMount(() => {
    const images = gsap.utils.toArray('.gallery-item');
    images.forEach((img: any) => {
      gsap.from(img, {
        scrollTrigger: {
          trigger: img,
          start: "top 85%",
          end: "top 50%",
          scrub: 1,
        },
        y: 50,
        opacity: 0,
        scale: 0.95,
        duration: 1,
        ease: "power2.out",
      });
    });
  });

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') selectedImg = null;
  }
</script>

<svelte:window on:keydown={handleKeydown} />

<section bind:this={containerRef} class="py-32 px-8 md:px-24 bg-secondary">
  <div class="max-w-6xl mx-auto">
    <h2 class="text-sm tracking-[0.3em] uppercase text-accent mb-16 text-center">Visual Diary</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      {#each placeholderImages as src}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
          class="gallery-item cursor-pointer overflow-hidden aspect-[4/3] relative group"
          onclick={() => selectedImg = src}
        >
          <div 
            class="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-105"
            style="background-image: url({src})"
          ></div>
          <div class="absolute inset-0 bg-secondary/20 group-hover:bg-transparent transition-colors duration-700"></div>
        </div>
      {/each}
    </div>
  </div>

  {#if selectedImg}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      transition:fade={{ duration: 400, easing: cubicOut }}
      class="fixed inset-0 z-50 flex items-center justify-center bg-secondary/95 backdrop-blur-md cursor-zoom-out p-8"
      onclick={() => selectedImg = null}
    >
      <img
        transition:scale={{ duration: 500, start: 0.9, easing: cubicOut }}
        src={selectedImg}
        alt="Gallery Preview"
        class="max-w-full max-h-full object-contain shadow-2xl"
      />
    </div>
  {/if}
</section>
