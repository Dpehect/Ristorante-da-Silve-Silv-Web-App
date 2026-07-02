<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import gsap from 'gsap';

  type WinePairing = { name: string; grape: string; note: string };
  type Dish = {
    name: string; tagline: string; description: string;
    story: string; ingredients: string[]; price: string; image: string;
    winePairing?: WinePairing;
  };
  type Category = {
    name: string; particleTheme: string; color: string;
    orbColor1: number[]; orbColor2: number[];
  };

  let { dish, category, onClose }: { dish: Dish; category: Category; onClose: () => void } = $props();

  let modalRef: HTMLElement;
  let imgPanelRef: HTMLElement;
  let contentPanelRef: HTMLElement;
  let canvasRef: HTMLCanvasElement;
  let activeTab = $state<'story' | 'ingredients' | 'wine'>('story');

  // Three.js
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let particleMesh: THREE.Points;
  let particleUniforms: Record<string, { value: any }>;
  let rafId: number;

  const PART_VERT = `
    attribute float aSize;
    attribute float aSpeed;
    attribute float aPhase;
    uniform float uTime;
    void main() {
      vec3 pos = position;
      float t = uTime * aSpeed + aPhase;
      pos.y = mod(pos.y + uTime * aSpeed * 0.15, 5.0) - 2.5;
      pos.x += sin(t * 0.6) * 0.18;
      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = aSize * (240.0 / -mv.z);
      gl_Position = projectionMatrix * mv;
    }
  `;
  const PART_FRAG = `
    uniform vec3 uColor;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      float a = (0.5 - d) * 2.0;
      a = a * a * 0.4;
      gl_FragColor = vec4(uColor, a);
    }
  `;

  const THEME_COLORS: Record<string, [number, number, number]> = {
    leaves: [0.30, 0.55, 0.18],
    wheat:  [0.85, 0.68, 0.30],
    embers: [0.88, 0.28, 0.08],
  };

  function initParticles() {
    const w = canvasRef.clientWidth  || 500;
    const h = canvasRef.clientHeight || 600;

    renderer = new THREE.WebGLRenderer({ canvas: canvasRef, alpha: true, antialias: false });
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setClearColor(0x000000, 0);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.z = 2.5;

    const count = 200;
    const pos    = new Float32Array(count * 3);
    const sizes  = new Float32Array(count);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 4;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1;
      sizes[i]  = Math.random() * 3 + 0.8;
      speeds[i] = Math.random() * 0.5 + 0.3;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds, 1));
    geo.setAttribute('aPhase',   new THREE.BufferAttribute(phases, 1));

    const c = THEME_COLORS[category.particleTheme] ?? THEME_COLORS.embers;
    particleUniforms = {
      uTime:  { value: 0 },
      uColor: { value: new THREE.Color(...c) },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader: PART_VERT, fragmentShader: PART_FRAG,
      uniforms: particleUniforms, transparent: true, depthWrite: false,
    });

    particleMesh = new THREE.Points(geo, mat);
    scene.add(particleMesh);
  }

  function tick() {
    rafId = requestAnimationFrame(tick);
    if (particleUniforms) particleUniforms.uTime.value = performance.now() * 0.001;
    renderer?.render(scene, camera);
  }

  function close() {
    const tl = gsap.timeline({ onComplete: onClose });
    tl.to(contentPanelRef, { x: '100%', duration: 0.5, ease: 'power3.in' }, 0);
    tl.to(imgPanelRef,     { x: '-100%', duration: 0.5, ease: 'power3.in' }, 0.05);
    tl.to(modalRef,        { opacity: 0, duration: 0.3, ease: 'power2.in' }, 0.3);
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Escape') close();
  }

  onMount(() => {
    initParticles();
    tick();

    // Entry: panels slide in from sides
    gsap.set(imgPanelRef,     { x: '-100%' });
    gsap.set(contentPanelRef, { x: '100%' });
    gsap.set(modalRef,        { opacity: 0 });

    const tl = gsap.timeline();
    tl.to(modalRef,        { opacity: 1, duration: 0.3, ease: 'power2.out' }, 0);
    tl.to(imgPanelRef,     { x: '0%', duration: 0.75, ease: 'power4.out' }, 0.1);
    tl.to(contentPanelRef, { x: '0%', duration: 0.75, ease: 'power4.out' }, 0.15);

    // Stagger content
    tl.from('.modal-el', {
      y: 22, opacity: 0, stagger: 0.07, duration: 0.65, ease: 'power3.out'
    }, 0.55);

    window.addEventListener('keydown', handleKey);
  });

  onDestroy(() => {
    cancelAnimationFrame(rafId);
    renderer?.dispose();
    window.removeEventListener('keydown', handleKey);
  });
</script>

<!-- Backdrop -->
<div bind:this={modalRef} class="fixed inset-0 z-50 flex overflow-hidden" style="background:rgba(19,17,9,0.97);">

  <!-- Three.js particle canvas — full-screen atmospheric layer -->
  <canvas
    bind:this={canvasRef}
    class="absolute inset-0 w-full h-full pointer-events-none"
    style="opacity:0.5; z-index:0;"
  ></canvas>

  <!-- ─── LEFT: Dish Image (SHARP native <img>) ─── -->
  <div bind:this={imgPanelRef} class="hidden md:flex w-[46%] relative shrink-0 overflow-hidden" style="z-index:1;">
    <!-- Sharp dish image -->
    <img
      src={dish.image}
      alt={dish.name}
      class="absolute inset-0 w-full h-full object-cover object-center"
      loading="eager"
      decoding="async"
    />
    <!-- Dark-to-right gradient so image bleeds into content panel -->
    <div class="absolute inset-0" style="background: linear-gradient(to right, rgba(19,17,9,0.1) 0%, rgba(19,17,9,0.55) 85%, rgba(19,17,9,0.95) 100%);"></div>
    <!-- Bottom gradient -->
    <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(19,17,9,0.8) 0%, transparent 40%);"></div>

    <!-- Image overlay text: dish name large, bottom-left -->
    <div class="absolute bottom-10 left-8 right-8">
      <p class="font-sans text-[10px] tracking-[0.5em] uppercase mb-2" style="color:{category.color}99">{category.name}</p>
      <h2 class="font-serif font-light text-primary leading-tight"
        style="font-size:clamp(2rem,4vw,3.2rem);">{dish.name}</h2>
    </div>
  </div>

  <!-- ─── RIGHT: Content panel ─── -->
  <div bind:this={contentPanelRef}
    class="flex-1 flex flex-col overflow-y-auto px-8 md:px-12 py-12 md:py-16 relative"
    style="z-index:1; scrollbar-width:none;"
  >
    <!-- Close button -->
    <div class="modal-el flex justify-end mb-8">
      <button
        onclick={close}
        class="font-sans text-[10px] tracking-[0.4em] uppercase text-primary/40 hover:text-primary transition-colors duration-300 border border-primary/10 hover:border-accent/50 px-5 py-2.5"
      >
        Close
      </button>
    </div>

    <!-- Mobile: image (shown on small screens only) -->
    <div class="modal-el md:hidden mb-8 relative overflow-hidden" style="aspect-ratio:16/9;">
      <img
        src={dish.image}
        alt={dish.name}
        class="w-full h-full object-cover object-center"
        loading="eager"
      />
    </div>

    <!-- Category + tagline -->
    <div class="modal-el mb-2">
      <p class="font-sans text-[10px] tracking-[0.5em] uppercase" style="color:{category.color}">{category.name}</p>
    </div>

    <!-- Dish name (mobile only) -->
    <h2 class="modal-el md:hidden font-serif font-light text-4xl text-primary mb-2 leading-tight">{dish.name}</h2>

    <p class="modal-el font-serif italic text-primary/50 text-lg mb-8 font-light leading-snug">{dish.tagline}</p>

    <!-- Divider with category color -->
    <div class="modal-el h-px mb-8" style="background:linear-gradient(90deg,{category.color}55,transparent)"></div>

    <!-- Price -->
    <p class="modal-el font-mono text-3xl font-light text-primary/80 tracking-wider mb-10">{dish.price}</p>

    <!-- Tabs -->
    <div class="modal-el flex gap-1 mb-8">
      {#each [['story', 'Story'], ['ingredients', 'Ingredients'], ['wine', 'Wine Pairing']] as [tab, label]}
        <button
          onclick={() => (activeTab = tab as any)}
          class="font-sans text-[10px] tracking-[0.3em] uppercase px-4 py-2 transition-all duration-300 {activeTab === tab
            ? 'text-primary border-b'
            : 'text-primary/30 hover:text-primary/60'}"
          style={activeTab === tab ? `border-color:${category.color}` : ''}
        >
          {label}
        </button>
      {/each}
    </div>

    <!-- Tab content -->
    {#if activeTab === 'story'}
      <div class="modal-el flex-1 text-primary/65 leading-relaxed text-sm md:text-base font-sans font-light" style="font-weight:300; line-height:1.85;">
        {dish.story}
      </div>

    {:else if activeTab === 'ingredients'}
      <div class="modal-el flex-1">
        <div class="flex flex-col gap-2.5">
          {#each dish.ingredients as ing}
            <div class="flex items-center gap-3 py-2.5 border-b border-primary/6">
              <span class="w-1.5 h-1.5 rounded-full shrink-0" style="background:{category.color}"></span>
              <span class="font-sans text-sm text-primary/60 font-light tracking-wide">{ing}</span>
            </div>
          {/each}
        </div>
      </div>

    {:else if activeTab === 'wine'}
      {#if dish.winePairing}
        <div class="modal-el flex-1">
          <!-- Wine name -->
          <div class="mb-6 p-5 border border-primary/8" style="background:rgba(255,255,255,0.02);">
            <div class="flex items-start gap-3 mb-4">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" class="mt-0.5 shrink-0" style="color:{category.color}">
                <path d="M8 2h8l1 8c0 3.314-2.686 6-6 6S5 13.314 5 10L8 2z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/>
                <path d="M12 18v4M9 22h6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
              </svg>
              <div>
                <p class="font-serif text-xl font-light text-primary mb-1">{dish.winePairing.name}</p>
                <p class="font-sans text-[10px] tracking-[0.3em] uppercase text-primary/35">{dish.winePairing.grape}</p>
              </div>
            </div>
            <p class="font-sans text-sm text-primary/55 leading-relaxed font-light">{dish.winePairing.note}</p>
          </div>

          <p class="font-sans text-[10px] tracking-[0.35em] uppercase text-primary/25">
            Our cellar holds over 80 Puglian labels. Ask Silve for a pairing from the open list.
          </p>
        </div>
      {:else}
        <p class="modal-el font-sans text-sm text-primary/40 font-light">Ask Silve for tonight's pairing.</p>
      {/if}
    {/if}

    <!-- Spacer -->
    <div class="h-8"></div>
  </div>
</div>
