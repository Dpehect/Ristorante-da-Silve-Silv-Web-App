<script lang="ts">
  import { T, useTask } from '@threlte/core';
  import * as THREE from 'three';

  const particlesCount = 2000;
  
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);
  const sizes = new Float32Array(particlesCount);
  
  const colorPrimary = new THREE.Color("#f5f0e6");
  const colorAccent = new THREE.Color("#8b7355");

  for (let i = 0; i < particlesCount; i++) {
    positions[i * 3] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20;

    const mixedColor = colorPrimary.clone().lerp(colorAccent, Math.random());
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;

    sizes[i] = Math.random() * 2.0;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const vertexShader = `
    uniform float uTime;
    attribute float size;
    varying vec3 vColor;

    void main() {
      vColor = color;
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      
      mvPosition.y += sin(uTime * 0.5 + position.x) * 0.5;
      mvPosition.x += cos(uTime * 0.3 + position.y) * 0.5;
      
      gl_PointSize = size * (30.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;

  const fragmentShader = `
    varying vec3 vColor;

    void main() {
      float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
      float alpha = 0.05 / distanceToCenter - 0.1;
      
      if(alpha < 0.0) discard;
      
      gl_FragColor = vec4(vColor, alpha);
    }
  `;

  let material: THREE.ShaderMaterial | undefined = $state();
  let points: THREE.Points | undefined = $state();

  const uniforms = {
    uTime: { value: 0 }
  };

  useTask((delta) => {
    if (material) {
      material.uniforms.uTime.value += delta;
    }
    if (points) {
      points.rotation.y += delta * 0.05;
      points.rotation.z = Math.sin(material?.uniforms.uTime.value * 0.05) * 0.1;
    }
  });
</script>

<T.PerspectiveCamera makeDefault position={[0, 0, 5]} fov={45} />

<T.Points bind:ref={points}>
  <T.BufferGeometry
    attributes.position={new THREE.BufferAttribute(positions, 3)}
    attributes.color={new THREE.BufferAttribute(colors, 3)}
    attributes.size={new THREE.BufferAttribute(sizes, 1)}
  />
  <T.ShaderMaterial
    bind:ref={material}
    {vertexShader}
    {fragmentShader}
    {uniforms}
    transparent={true}
    depthWrite={false}
    blending={THREE.AdditiveBlending}
    vertexColors={true}
  />
</T.Points>
