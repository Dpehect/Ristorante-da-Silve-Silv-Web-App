<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import * as THREE from 'three';
  import gsap from 'gsap';

  export type GalleryImage = { src: string; title: string };

  let { images, startIndex = 0, onClose }: {
    images: GalleryImage[];
    startIndex: number;
    onClose: () => void;
  } = $props();

  let currentIndex = $state(0);
  $effect.pre(() => { currentIndex = startIndex; });
  let modalRef: HTMLElement;
  let canvasRef: HTMLCanvasElement;
  let isNavigating = false;

  // Three.js refs (not reactive state — only touch in lifecycle)
  let renderer: THREE.WebGLRenderer;
  let scene: THREE.Scene;
  let camera: THREE.PerspectiveCamera;
  let imageMesh: THREE.Mesh;
  let particleMesh: THREE.Points;
  let rafId: number;
  let imageUniforms: Record<string, { value: any }>;
  let particleUniforms: Record<string, { value: any }>;
  let mouseTarget = { x: 0.5, y: 0.5 };
  let mouseSmooth = { x: 0.5, y: 0.5 };

  // — GLSL —
  const IMAGE_VERT = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const IMAGE_FRAG = `
    uniform sampler2D uTexture;
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uAlpha;
    varying vec2 vUv;

    void main() {
      // Parallax
      vec2 uv = vUv + (uMouse - 0.5) * 0.022;

      // Chromatic aberration — stronger at edges
      float dist = length(uv - 0.5);
      vec2 aberDir = normalize(uv - 0.5 + vec2(0.0001));
      float ab = 0.005 * dist;
      float r = texture2D(uTexture, uv + aberDir * ab).r;
      float g = texture2D(uTexture, uv).g;
      float b = texture2D(uTexture, uv - aberDir * ab).b;
      vec3 col = vec3(r, g, b);

      // Warm color grade
      col.r = min(1.0, col.r * 1.09 + 0.015);
      col.g = min(1.0, col.g * 0.96);
      col.b = min(1.0, col.b * 0.87);

      // Vignette
      float vig = 1.0 - dot(uv - 0.5, uv - 0.5) * 2.0;
      vig = clamp(vig, 0.0, 1.0);
      col *= vig;

      // Light leak — gentle horizontal sweep
      float phase = mod(uTime * 0.06, 1.0);
      float leak = smoothstep(phase - 0.12, phase, vUv.x) * smoothstep(phase + 0.12, phase, vUv.x);
      leak *= (1.0 - abs(vUv.y - 0.45) * 2.5);
      leak = max(0.0, leak);
      col += vec3(0.65, 0.28, 0.08) * leak * 0.14;

      gl_FragColor = vec4(col, uAlpha);
    }
  `;

  const PARTICLE_VERT = `
    attribute float aSize;
    attribute float aSpeed;
    attribute float aPhase;
    uniform float uTime;
    void main() {
      vec3 pos = position;
      float t = uTime * aSpeed;
      pos.y = mod(pos.y + t * 0.18, 5.0) - 2.5;
      pos.x += sin(t * 0.7 + aPhase) * 0.14;
      vec4 mv = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = aSize * (280.0 / -mv.z);
      gl_Position = projectionMatrix * mv;
    }
  `;

  const PARTICLE_FRAG = `
    void main() {
      float d = length(gl_PointCoord - 0.5);
      if (d > 0.5) discard;
      float a = (0.5 - d) * 2.0;
      a = a * a * 0.35;
      gl_FragColor = vec4(0.95, 0.72, 0.28, a);
    }
  `;

  function initScene() {
    const canvas = canvasRef;
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
    renderer.setSize(w, h, false);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);

    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, w / h, 0.1, 100);
    camera.position.z = 2.2;

    // Image plane — sized for 4:3 images
    const planeH = 1.35;
    const planeW = planeH * (4 / 3);
    const geo = new THREE.PlaneGeometry(planeW, planeH, 1, 1);

    imageUniforms = {
      uTexture: { value: new THREE.Texture() },
      uTime:    { value: 0 },
      uMouse:   { value: new THREE.Vector2(0.5, 0.5) },
      uAlpha:   { value: 0 },
    };

    const mat = new THREE.ShaderMaterial({
      vertexShader:   IMAGE_VERT,
      fragmentShader: IMAGE_FRAG,
      uniforms:       imageUniforms,
      transparent:    true,
      depthWrite:     false,
    });

    imageMesh = new THREE.Mesh(geo, mat);
    scene.add(imageMesh);

    // Particles
    const COUNT = 450;
    const positions = new Float32Array(COUNT * 3);
    const sizes     = new Float32Array(COUNT);
    const speeds    = new Float32Array(COUNT);
    const phases    = new Float32Array(COUNT);

    for (let i = 0; i < COUNT; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 5;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 5;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5 - 0.8;
      sizes[i]  = Math.random() * 2.8 + 0.8;
      speeds[i] = Math.random() * 0.6 + 0.4;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const pgeo = new THREE.BufferGeometry();
    pgeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pgeo.setAttribute('aSize',    new THREE.BufferAttribute(sizes, 1));
    pgeo.setAttribute('aSpeed',   new THREE.BufferAttribute(speeds, 1));
    pgeo.setAttribute('aPhase',   new THREE.BufferAttribute(phases, 1));

    particleUniforms = { uTime: { value: 0 } };

    const pmat = new THREE.ShaderMaterial({
      vertexShader:   PARTICLE_VERT,
      fragmentShader: PARTICLE_FRAG,
      uniforms:       particleUniforms,
      transparent:    true,
      depthWrite:     false,
    });

    particleMesh = new THREE.Points(pgeo, pmat);
    scene.add(particleMesh);

    // Load initial image
    loadImage(images[currentIndex].src, true);
  }

  function loadImage(src: string, initial = false) {
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = 'anonymous';

    if (!initial) {
      gsap.to(imageUniforms.uAlpha, {
        value: 0, duration: 0.35, ease: 'power2.in',
        onComplete: () => {
          loader.load(src, (tex) => {
            tex.colorSpace = THREE.SRGBColorSpace;
            imageUniforms.uTexture.value = tex;
            gsap.to(imageUniforms.uAlpha, { value: 1, duration: 0.7, ease: 'power2.out' });
            isNavigating = false;
          });
        }
      });
    } else {
      loader.load(src, (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        imageUniforms.uTexture.value = tex;
        gsap.to(imageUniforms.uAlpha, { value: 1, duration: 0.9, ease: 'power2.out' });
      });
    }
  }

  function tick() {
    rafId = requestAnimationFrame(tick);
    const t = performance.now() * 0.001;

    // Smooth mouse
    mouseSmooth.x += (mouseTarget.x - mouseSmooth.x) * 0.06;
    mouseSmooth.y += (mouseTarget.y - mouseSmooth.y) * 0.06;

    if (imageUniforms) {
      imageUniforms.uTime.value = t;
      (imageUniforms.uMouse.value as THREE.Vector2).set(mouseSmooth.x, mouseSmooth.y);
    }
    if (particleUniforms) particleUniforms.uTime.value = t;

    // Mesh parallax tilt
    if (imageMesh) {
      imageMesh.rotation.y += ((mouseSmooth.x - 0.5) * 0.1 - imageMesh.rotation.y) * 0.05;
      imageMesh.rotation.x += ((mouseSmooth.y - 0.5) * -0.06 - imageMesh.rotation.x) * 0.05;
    }

    if (particleMesh) particleMesh.rotation.z = Math.sin(t * 0.05) * 0.015;

    renderer?.render(scene, camera);
  }

  function navigate(dir: 1 | -1) {
    if (isNavigating) return;
    isNavigating = true;
    currentIndex = (currentIndex + dir + images.length) % images.length;
    loadImage(images[currentIndex].src);
  }

  function close() {
    gsap.to(modalRef, { opacity: 0, duration: 0.5, ease: 'power2.in', onComplete: onClose });
  }

  function handleMouseMove(e: MouseEvent) {
    mouseTarget.x = e.clientX / window.innerWidth;
    mouseTarget.y = 1 - e.clientY / window.innerHeight;
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'Escape')     close();
    if (e.key === 'ArrowRight') navigate(1);
    if (e.key === 'ArrowLeft')  navigate(-1);
  }

  onMount(() => {
    initScene();
    tick();

    // Entry
    gsap.fromTo(modalRef,
      { opacity: 0 },
      { opacity: 1, duration: 0.6, ease: 'power2.out' }
    );

    window.addEventListener('keydown', handleKey);
    window.addEventListener('mousemove', handleMouseMove);
  });

  onDestroy(() => {
    cancelAnimationFrame(rafId);
    window.removeEventListener('keydown', handleKey);
    window.removeEventListener('mousemove', handleMouseMove);
    renderer?.dispose();
  });
</script>

<!-- Modal Overlay -->
<div bind:this={modalRef} class="fixed inset-0 z-50 flex items-center justify-center" style="background: rgba(15,14,12,0.96);">

  <!-- Three.js Canvas — fullscreen background -->
  <canvas bind:this={canvasRef} class="absolute inset-0 w-full h-full"></canvas>

  <!-- Title -->
  <div class="absolute top-10 left-0 right-0 text-center z-10 pointer-events-none">
    <p class="text-primary/50 text-xs tracking-[0.5em] uppercase font-light">{images[currentIndex].title}</p>
  </div>

  <!-- Counter -->
  <div class="absolute bottom-10 left-0 right-0 flex items-center justify-center gap-6 z-10 pointer-events-none">
    <div class="h-px w-16 bg-primary/15"></div>
    <p class="text-primary/35 text-[11px] tracking-[0.3em] font-mono">
      {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
    </p>
    <div class="h-px w-16 bg-primary/15"></div>
  </div>

  <!-- Prev / Next -->
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button
    onclick={() => navigate(-1)}
    class="absolute left-5 md:left-10 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-primary/15 flex items-center justify-center text-primary/50 hover:text-primary hover:border-accent/50 transition-all duration-300"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M10 3L5 8L10 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
    </svg>
  </button>

  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button
    onclick={() => navigate(1)}
    class="absolute right-5 md:right-10 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full border border-primary/15 flex items-center justify-center text-primary/50 hover:text-primary hover:border-accent/50 transition-all duration-300"
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M6 3L11 8L6 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
    </svg>
  </button>

  <!-- Close -->
  <!-- svelte-ignore a11y_consider_explicit_label -->
  <button
    onclick={close}
    class="absolute top-6 right-6 z-10 w-10 h-10 rounded-full border border-primary/15 flex items-center justify-center text-primary/40 hover:text-primary hover:border-accent/50 transition-all duration-300"
  >
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
    </svg>
  </button>

  <!-- Click backdrop to close -->
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="absolute inset-0 z-0" onclick={close}></div>
</div>
