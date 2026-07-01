<script lang="ts">
  import Preloader from '$lib/components/Preloader.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Story from '$lib/components/Story.svelte';
  import Experience from '$lib/components/Experience.svelte';
  import Menu from '$lib/components/Menu.svelte';
  import Gallery from '$lib/components/Gallery.svelte';
  import Reservation from '$lib/components/Reservation.svelte';
  
  let loaded = $state(false);

  function handlePreloadComplete() {
    loaded = true;
  }
</script>

<svelte:head>
  <title>Ristorante da Silve | Fasano</title>
  <meta name="description" content="An intimate, cinematic dining experience in Puglia." />
</svelte:head>

{#if !loaded}
  <Preloader on:complete={handlePreloadComplete} />
{/if}

<main class="bg-secondary text-primary font-sans selection:bg-accent/30 selection:text-primary relative {loaded ? 'opacity-100' : 'opacity-0 h-screen overflow-hidden'} transition-opacity duration-1000 delay-500">
  <Hero />
  <Story />
  <Experience />
  <Menu />
  <Gallery />
  <Reservation />
  
  <footer class="py-12 text-center text-primary/40 text-xs tracking-widest uppercase border-t border-primary/5">
    <p>© {new Date().getFullYear()} Ristorante da Silve. All rights reserved.</p>
  </footer>
</main>
