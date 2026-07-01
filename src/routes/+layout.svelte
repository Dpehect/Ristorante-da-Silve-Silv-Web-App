<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import Lenis from '$lib/components/Lenis.svelte';

	let { children } = $props();
</script>

<svelte:head><link rel="icon" href={favicon} /></svelte:head>

<Lenis>
	{@render children()}
</Lenis>
