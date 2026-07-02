<script lang="ts">
  import { spring } from 'svelte/motion';

  let { item, onHover, onLeave } = $props();

  const xOffset = spring(0, { stiffness: 0.1, damping: 0.4 });

  function handleMouseEnter() {
    onHover(item.id);
    xOffset.set(10);
  }

  function handleMouseLeave() {
    onLeave(item.id);
    xOffset.set(0);
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class="menu-item group cursor-pointer"
  onmouseenter={handleMouseEnter}
  onmouseleave={handleMouseLeave}
  style="transform: translateX({$xOffset}px);"
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
