<script lang="ts">
  import { onMount } from 'svelte';
  import gsap from 'gsap';

  let { dish, category, onOpen }: {
    dish: {
      id: string; name: string; tagline: string;
      description: string; story: string;
      ingredients: string[]; price: string; image: string;
    };
    category: { name: string; color: string };
    onOpen: () => void;
  } = $props();

  let cardRef: HTMLElement;
  let sparkleContainer: HTMLElement;
  let sparkles: HTMLElement[] = [];

  // ── 3D Tilt ──────────────────────────────────
  function onMouseMove(e: MouseEvent) {
    const rect = cardRef.getBoundingClientRect();
    const dx = (e.clientX - rect.left) / rect.width - 0.5;
    const dy = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(cardRef, {
      rotateX: -dy * 16,
      rotateY: dx * 16,
      transformPerspective: 900,
      duration: 0.35,
      ease: 'power2.out',
      overwrite: 'auto',
    });
  }

  function onMouseLeave() {
    gsap.to(cardRef, {
      rotateX: 0, rotateY: 0,
      duration: 0.9, ease: 'elastic.out(1, 0.55)',
      overwrite: 'auto',
    });
    killSparkles();
  }

  // ── Sparkle particles ─────────────────────────
  function spawnSparkles() {
    for (let i = 0; i < 8; i++) {
      const dot = document.createElement('span');
      dot.className = 'dish-sparkle';
      dot.style.cssText = `
        position:absolute;
        width:4px; height:4px;
        border-radius:50%;
        background:${category.color};
        pointer-events:none;
        left:${Math.random() * 100}%;
        top:${Math.random() * 100}%;
        opacity:0;
        z-index:20;
      `;
      sparkleContainer.appendChild(dot);
      sparkles.push(dot);

      gsap.to(dot, {
        y: -50 - Math.random() * 60,
        x: (Math.random() - 0.5) * 60,
        opacity: [0, 0.8, 0],
        scale: [0, 1.2, 0],
        duration: 0.9 + Math.random() * 0.6,
        delay: Math.random() * 0.3,
        ease: 'power2.out',
        onComplete: () => dot.remove(),
      });
    }
  }

  function killSparkles() {
    sparkles.forEach(d => d.remove());
    sparkles = [];
  }

  function onMouseEnter() {
    spawnSparkles();
    gsap.to(cardRef.querySelector('.dish-img'), {
      scale: 1.06, duration: 0.6, ease: 'power2.out'
    });
  }

  function onMouseLeaveCard() {
    gsap.to(cardRef.querySelector('.dish-img'), {
      scale: 1, duration: 0.7, ease: 'power2.out'
    });
    onMouseLeave();
  }

  onMount(() => {
    // Warm shimmer on mount — subtle initial glow
    gsap.fromTo(cardRef.querySelector('.card-glow'),
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: 'power1.out' }
    );
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions a11y_click_events_have_key_events -->
<div
  bind:this={cardRef}
  class="dish-card group relative overflow-hidden cursor-pointer bg-secondary/50 border border-primary/6"
  style="transform-style: preserve-3d; will-change: transform;"
  onmousemove={onMouseMove}
  onmouseenter={onMouseEnter}
  onmouseleave={onMouseLeaveCard}
  onclick={onOpen}
>
  <!-- Sparkle container -->
  <div bind:this={sparkleContainer} class="absolute inset-0 z-10 pointer-events-none overflow-hidden"></div>

  <!-- Glow overlay -->
  <div class="card-glow absolute inset-0 pointer-events-none z-0"
    style="background: radial-gradient(ellipse at 50% 50%, {category.color}12 0%, transparent 70%);">
  </div>

  <!-- Image -->
  <div class="relative h-52 overflow-hidden">
    <div
      class="dish-img absolute inset-0 bg-cover bg-center"
      style="background-image: url({dish.image})"
    ></div>
    <!-- Warm gradient over image -->
    <div class="absolute inset-0 bg-gradient-to-t from-secondary via-secondary/20 to-transparent"></div>
    <!-- Category chip -->
    <div class="absolute top-3 left-3 px-2.5 py-1 text-[10px] tracking-[0.25em] uppercase"
      style="background: {category.color}22; color: {category.color}; border: 1px solid {category.color}40;">
      {category.name}
    </div>
    <!-- Price chip -->
    <div class="absolute top-3 right-3 px-2.5 py-1 text-[11px] font-mono tracking-wider text-primary/60 border border-primary/10 bg-dark/40">
      {dish.price}
    </div>
  </div>

  <!-- Content -->
  <div class="p-5 pt-4 relative z-5">
    <p class="text-[10px] tracking-[0.35em] uppercase mb-1.5" style="color:{category.color}88">{dish.tagline}</p>
    <h3 class="text-lg font-light tracking-wide text-primary mb-2 leading-tight">{dish.name}</h3>
    <p class="text-primary/45 text-sm leading-relaxed line-clamp-2">{dish.description}</p>

    <!-- CTA -->
    <div class="mt-4 flex items-center gap-2 text-xs tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-400" style="color:{category.color}">
      <span>Discover</span>
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" stroke-width="1" stroke-linecap="round"/>
      </svg>
    </div>
  </div>

  <!-- Bottom border accent -->
  <div class="absolute bottom-0 left-0 right-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
    style="background: linear-gradient(90deg, transparent, {category.color}60, transparent);">
  </div>
</div>
