<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { GeistSans } from 'geist-svelte/font/sans';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

{@render children()}
