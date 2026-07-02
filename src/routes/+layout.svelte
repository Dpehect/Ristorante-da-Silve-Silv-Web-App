<script lang="ts">
	import '../app.css';
	import Lenis from '$lib/components/Lenis.svelte';

	let { children } = $props();
</script>

<!-- favicon served from static/ — no dynamic import avoids prerender 404 -->
<svelte:head>
	<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
</svelte:head>

<Lenis>
	{@render children()}
</Lenis>
