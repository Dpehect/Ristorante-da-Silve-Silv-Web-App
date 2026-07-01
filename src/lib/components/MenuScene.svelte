<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import * as THREE from 'three';
  import { tweened } from 'svelte/motion';
  import { cubicOut } from 'svelte/easing';

  let { isHovered = false, mousePos = { x: 0, y: 0 } } = $props();

  const hoverVertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const hoverFragmentShader = `
    uniform vec2 uMouse;
    uniform float uTime;
    uniform float uHoverState;
    varying vec2 vUv;

    void main() {
      vec2 center = vec2(0.5);
      float dist = distance(vUv, center);
      
      // Soft glow based on hover
      float alpha = smoothstep(0.5, 0.0, dist) * uHoverState * 0.15;
      
      // Add some noise or particle-like variance
      float noise = fract(sin(dot(vUv, vec2(12.9898, 78.233))) * 43758.5453);
      vec3 color = mix(vec3(0.54, 0.45, 0.33), vec3(0.96, 0.94, 0.90), noise * 0.5);
      
      gl_FragColor = vec4(color, alpha);
    }
  `;

  let material: THREE.ShaderMaterial | undefined = $state();
  const hoverTarget = tweened(0, { duration: 500, easing: cubicOut });

  $effect(() => {
    hoverTarget.set(isHovered ? 1.0 : 0.0);
  });

  const uniforms = {
    uTime: { value: 0 },
    uHoverState: { value: 0 },
    uMouse: { value: new THREE.Vector2(0, 0) }
  };

  useTask((delta) => {
    if (material) {
      material.uniforms.uTime.value += delta;
      material.uniforms.uHoverState.value = $hoverTarget;
      material.uniforms.uMouse.value.set(
        (mousePos.x / window.innerWidth) * 2 - 1,
        -(mousePos.y / window.innerHeight) * 2 + 1
      );
    }
  });
</script>

<T.OrthographicCamera makeDefault position={[0, 0, 1]} zoom={100} />

<T.Mesh position={[0, 0, -1]} scale={[10, 10, 1]}>
  <T.PlaneGeometry args={[1, 1, 32, 32]} />
  <T.ShaderMaterial
    bind:ref={material}
    vertexShader={hoverVertexShader}
    fragmentShader={hoverFragmentShader}
    {uniforms}
    transparent={true}
    depthWrite={false}
    blending={THREE.AdditiveBlending}
  />
</T.Mesh>
