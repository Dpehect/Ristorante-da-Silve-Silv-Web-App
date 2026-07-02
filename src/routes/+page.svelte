<script lang="ts">
  import Preloader from '$lib/components/Preloader.svelte';
  import Hero from '$lib/components/Hero.svelte';
  import Story from '$lib/components/Story.svelte';
  import Experience from '$lib/components/Experience.svelte';
  import Menu from '$lib/components/Menu.svelte';
  import Gallery from '$lib/components/Gallery.svelte';
  import Reservation from '$lib/components/Reservation.svelte';
  import gsap from 'gsap';

  let loaded       = $state(false);
  let showHint     = $state(false);
  let hintDismissed = $state(false);

  function handlePreloadComplete() {
    loaded = true;
    // Show onboarding hint 1.5s after load, dismiss after 5s
    setTimeout(() => {
      showHint = true;
      setTimeout(() => {
        dismissHint();
      }, 5000);
    }, 1500);
  }

  function dismissHint() {
    hintDismissed = true;
    showHint = false;
  }
</script>

<svelte:head>
  <title>Ristorante da Silve | Fasano, Puglia</title>
  <meta name="description" content="An intimate, cinematic dining experience in Fasano, Puglia. Family-run since 1987." />
  <meta property="og:title" content="Ristorante da Silve | Fasano" />
  <meta property="og:description" content="Genuine Apulian hospitality. Handmade pasta, fresh Adriatic catch, and Puglian wine." />
</svelte:head>

<!-- Preloader — first visit only (sessionStorage check inside Preloader) -->
{#if !loaded}
  <Preloader onComplete={handlePreloadComplete} />
{/if}

<!-- Main content — fades in after preloader -->
<main
  class="bg-secondary text-primary relative transition-opacity duration-700 {loaded ? 'opacity-100' : 'opacity-0 pointer-events-none overflow-hidden h-screen'}"
>
  <Hero />
  <Story />
  <Experience />
  <Menu />
  <Gallery />
  <Reservation />

  <footer class="py-14 text-center border-t border-primary/5">
    <p class="font-sans text-[10px] tracking-[0.5em] uppercase text-primary/25">
      © {new Date().getFullYear()} Ristorante da Silve · Fasano, Puglia
    </p>
  </footer>
</main>

<!-- ── Onboarding hint toast ── -->
{#if showHint && !hintDismissed}
  <!-- svelte-ignore a11y_click_events_have_key_events a11y_no_static_element_interactions -->
  <div
    class="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 flex items-center gap-4 px-6 py-4 border border-primary/10 backdrop-blur-sm cursor-pointer"
    style="background:rgba(30,27,23,0.92); animation: hintIn 0.6s ease-out both;"
    onclick={dismissHint}
  >
    <div class="w-1 h-8 rounded-full" style="background:linear-gradient(to bottom, #b8733a, transparent)"></div>
    <div>
      <p class="font-sans text-[10px] tracking-[0.4em] uppercase text-accent/80 mb-0.5">Explore</p>
      <p class="font-sans text-xs text-primary/50 tracking-wide">Scroll to discover · Click dishes for their story</p>
    </div>
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" class="ml-2 text-primary/20">
      <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
    </svg>
  </div>
{/if}

<style>
  @keyframes hintIn {
    from { opacity: 0; transform: translateX(-50%) translateY(12px); }
    to   { opacity: 1; transform: translateX(-50%) translateY(0); }
  }
</style>
