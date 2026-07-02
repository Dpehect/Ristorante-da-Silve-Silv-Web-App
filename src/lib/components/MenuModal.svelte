<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import gsap from 'gsap';

  let { dish, category, onClose }: {
    dish: {
      name: string; tagline: string; description: string;
      story: string; ingredients: string[]; price: string; image: string;
    };
    category: {
      name: string; particleTheme: string;
      orbColor1: number[]; orbColor2: number[]; color: string;
    };
    onClose: () => void;
  } = $props();

  let panelRef: HTMLElement;
  let canvasRef: HTMLCanvasElement;

  // Three.js — not reactive state
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let orbMesh: THREE.Mesh;
  let particleMesh: THREE.Points;
  let rafId: number;
  let orbUniforms: Record<string, { value: any }>;
  let particleUniforms: Record<string, { value: any }>;

  // — ORB SHADERS —
  const ORB_VERT = `
    varying vec2 vUv;
    varying vec3 vNormal;
    varying vec3 vWorldPos;
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      vWorldPos = (modelMatrix * vec4(position,1.0)).xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
    }
  `;

  const ORB_FRAG = `
    uniform float uTime;
    uniform vec3 uColor1;
    uniform vec3 uColor2;
    varying vec2 vUv;
    varying vec3 vNormal;

    // simple hash
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5); }

    float smoothNoise(vec2 p) {
      vec2 i = floor(p);
      vec2 f = fract(p);
      f = f * f * (3.0 - 2.0 * f);
      float a = hash(i);
      float b = hash(i + vec2(1.0,0.0));
      float c = hash(i + vec2(0.0,1.0));
      float d = hash(i + vec2(1.0,1.0));
      return mix(mix(a,b,f.x), mix(c,d,f.x), f.y);
    }

    void main() {
      // Fresnel rim
      vec3 viewDir = normalize(cameraPosition - vWorldPos);
      float fresnel = 1.0 - dot(vNormal, viewDir);
      fresnel = pow(fresnel, 2.8);

      // Animated noise
      float n = smoothNoise(vUv * 4.0 + uTime * 0.18);
      float n2 = smoothNoise(vUv * 7.0 - uTime * 0.12);
      float pattern = n * 0.6 + n2 * 0.4;

      vec3 col = mix(uColor1, uColor2, pattern);

      // Rim glow — colour 2 at edges
      col = mix(col, uColor2 * 1.6, fresnel * 0.7);

      // Inner luminosity
      float inner = 1.0 - fresnel;
      col += inner * uColor1 * 0.15;

      // Pulsing alpha
      float alpha = 0.65 + fresnel * 0.35 + sin(uTime * 1.2) * 0.04;

      gl_FragColor = vec4(col, alpha);
    }
  `;

  // — PARTICLE SHADERS (shared, theme colours set via uniforms) —
  const PART_VERT = `
    attribute float aSize;
    attribute float aSpeed;
    attribute float aPhase;
    attribute float aAmp;
    uniform float uTime;
    void main() {
      vec3 pos = position;
      float t = uTime * aSpeed + aPhase;
      // Theme motion: leaves drift, wheat swirls, embers rise fast
      pos.y  = mod(pos.y + uTime * aSpeed * 0.22, 4.0) - 2.0;
      pos.x += sin(t * 0.8) * aAmp;
      pos.z += cos(t * 0.5) * aAmp * 0.4;
      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = aSize * (260.0 / -mv.z);
      gl_Position = projectionMatrix * mv;
    }
  `;

  const PART_FRAG = `
    uniform vec3 uColor;
    uniform float uTime;
    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      float a = (0.5 - d) * 2.0;
      a = a * a * 0.5;
      gl_FragColor = vec4(uColor, a);
    }
  `;

  // Theme configs
  type Theme = { count: number; color: number[]; ampRange: [number, number]; speedRange: [number, number] };
  const THEMES: Record<string, Theme> = {
    leaves: { count: 110, color: [0.38, 0.62, 0.22], ampRange: [0.12, 0.28], speedRange: [0.3, 0.7] },
    wheat:  { count: 140, color: [0.88, 0.72, 0.38], ampRange: [0.08, 0.18], speedRange: [0.5, 0.9] },
    embers: { count: 90,  color: [0.9,  0.32, 0.10], ampRange: [0.04, 0.12], speedRange: [0.8, 1.4] },
  };

  function initScene() {
    const w = canvasRef.clientWidth  || 420;
    const h = canvasRef.clientHeight || 420;

    renderer = new THREE.WebGLRenderer({ canvas: canvasRef, alpha: true, antialias: true });
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.z = 2.4;

    // Orb
    const c1 = new THREE.Color(...(category.orbColor1 as [number,number,number]));
    const c2 = new THREE.Color(...(category.orbColor2 as [number,number,number]));

    orbUniforms = {
      uTime:   { value: 0 },
      uColor1: { value: c1 },
      uColor2: { value: c2 },
    };

    const orbGeo = new THREE.SphereGeometry(0.65, 64, 64);
    const orbMat = new THREE.ShaderMaterial({
      vertexShader:   ORB_VERT,
      fragmentShader: ORB_FRAG,
      uniforms:       orbUniforms,
      transparent:    true,
      side:           THREE.FrontSide,
    });

    orbMesh = new THREE.Mesh(orbGeo, orbMat);
    scene.add(orbMesh);

    // Category particles
    const theme = THEMES[category.particleTheme] ?? THEMES.embers;
    const { count, color, ampRange, speedRange } = theme;

    const pos    = new Float32Array(count * 3);
    const sizes  = new Float32Array(count);
    const speeds = new Float32Array(count);
    const phases = new Float32Array(count);
    const amps   = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * 3.5;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.2 - 0.6;
      sizes[i]  = Math.random() * 3.5 + 1.0;
      speeds[i] = speedRange[0] + Math.random() * (speedRange[1] - speedRange[0]);
      phases[i] = Math.random() * Math.PI * 2;
      amps[i]   = ampRange[0] + Math.random() * (ampRange[1] - ampRange[0]);
    }

    const pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute('position', new THREE.BufferAttribute(pos,    3));
    pgeo.setAttribute('aSize',    new THREE.BufferAttribute(sizes,  1));
    pgeo.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds, 1));
    pgeo.setAttribute('aPhase',   new THREE.BufferAttribute(phases, 1));
    pgeo.setAttribute('aAmp',     new THREE.BufferAttribute(amps,   1));

    particleUniforms = {
      uTime:  { value: 0 },
      uColor: { value: new THREE.Color(...(color as [number,number,number])) },
    };

    const pmat = new THREE.ShaderMaterial({
      vertexShader:   PART_VERT,
      fragmentShader: PART_FRAG,
      uniforms:       particleUniforms,
      transparent:    true,
      depthWrite:     false,
    });

    particleMesh = new THREE.Points(pgeo, pmat);
    scene.add(particleMesh);
  }

  function tick() {
    rafId = requestAnimationFrame(tick);
    const t = performance.now() * 0.001;
    if (orbUniforms)      orbUniforms.uTime.value = t;
    if (particleUniforms) particleUniforms.uTime.value = t;
    if (orbMesh) {
      orbMesh.rotation.y = t * 0.18;
      orbMesh.rotation.x = Math.sin(t * 0.25) * 0.12;
    }
    renderer?.render(scene, camera);
  }

  function close() {
    gsap.to(panelRef, {
      clipPath: 'inset(0% 0% 100% 0%)',
      duration: 0.6,
      ease: 'power3.in',
      onComplete: onClose,
    });
  }

  onMount(() => {
    initScene();
    tick();

    // Clip-path wipe from bottom
    gsap.set(panelRef, { clipPath: 'inset(100% 0% 0% 0%)' });
    gsap.to(panelRef, {
      clipPath: 'inset(0% 0% 0% 0%)',
      duration: 0.85,
      ease: 'power4.out',
    });

    // Stagger content
    gsap.from('.modal-text-el', {
      y: 28, opacity: 0, stagger: 0.08, delay: 0.45,
      duration: 0.75, ease: 'power3.out',
    });
  });

  onDestroy(() => {
    cancelAnimationFrame(rafId);
    renderer?.dispose();
  });
</script>

<div
  bind:this={panelRef}
  class="fixed inset-0 z-50 flex overflow-hidden"
  style="background: #0f0e0c;"
>
  <!-- Left: Three.js orb + particles -->
  <div class="hidden md:flex w-2/5 relative items-center justify-center shrink-0">
    <canvas bind:this={canvasRef} class="w-full h-full" style="max-width:420px; max-height:420px;"></canvas>
    <!-- Radial glow behind orb -->
    <div class="absolute inset-0 pointer-events-none"
      style="background: radial-gradient(ellipse at 50% 50%, {category.color}18 0%, transparent 65%);">
    </div>
  </div>

  <!-- Right: Dish detail content -->
  <div class="flex-1 flex flex-col justify-center px-10 md:px-14 py-16 overflow-y-auto">

    <div class="modal-text-el">
      <p class="text-[10px] tracking-[0.5em] uppercase mb-2" style="color:{category.color}">{category.name}</p>
    </div>

    <h2 class="modal-text-el text-4xl md:text-5xl font-light tracking-wide text-primary leading-tight mb-2">{dish.name}</h2>

    <p class="modal-text-el text-base italic text-primary/50 mb-8 font-light tracking-wide">{dish.tagline}</p>

    <!-- Divider -->
    <div class="modal-text-el h-px mb-8" style="background: linear-gradient(90deg, {category.color}50, transparent)"></div>

    <!-- Story -->
    <p class="modal-text-el text-primary/65 leading-relaxed text-sm md:text-base mb-10 max-w-lg">{dish.story}</p>

    <!-- Ingredients -->
    <div class="modal-text-el mb-10">
      <p class="text-[10px] tracking-[0.4em] uppercase text-primary/30 mb-4">Ingredients</p>
      <div class="flex flex-wrap gap-2">
        {#each dish.ingredients as ing}
          <span class="px-3 py-1 text-xs tracking-wider text-primary/60 border border-primary/10"
            style="background:{category.color}0a">
            {ing}
          </span>
        {/each}
      </div>
    </div>

    <!-- Price + close -->
    <div class="modal-text-el flex items-center justify-between">
      <p class="text-3xl font-light text-primary/90 font-mono tracking-wider">{dish.price}</p>
      <button
        onclick={close}
        class="text-[11px] tracking-[0.3em] uppercase border border-primary/20 px-6 py-3 text-primary/60 hover:text-primary hover:border-accent/50 transition-all duration-300"
      >
        Close
      </button>
    </div>
  </div>

  <!-- Mobile canvas — shown at top on small screens -->
  <div class="md:hidden absolute top-0 left-0 right-0 h-48 pointer-events-none"
    style="background: radial-gradient(ellipse at 50% 50%, {category.color}20 0%, transparent 70%);">
  </div>
</div>
