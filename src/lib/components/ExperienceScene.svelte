<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import * as THREE from 'three';

  const ExperienceShader = `
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      vec2 center = vec2(0.5);
      float dist = distance(vUv, center);
      
      // Ambient heat haze/distortion
      float distortion = sin(uTime * 0.5 + dist * 10.0) * 0.05;
      vec3 color = mix(vec3(0.1, 0.09, 0.08), vec3(0.54, 0.45, 0.33), dist + distortion);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  let material: THREE.ShaderMaterial | undefined = $state();

  const uniforms = {
    uTime: { value: 0 }
  };

  useTask((delta) => {
    if (material) {
      material.uniforms.uTime.value += delta;
    }
  });
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 5]} />

<T.Mesh position={[0, 0, -5]} scale={[20, 20, 1]}>
  <T.PlaneGeometry args={[1, 1]} />
  <T.ShaderMaterial
    bind:ref={material}
    vertexShader={"varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }"}
    fragmentShader={ExperienceShader}
    {uniforms}
    depthWrite={false}
  />
</T.Mesh>
