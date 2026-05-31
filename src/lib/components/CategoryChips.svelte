<script lang="ts">
	import { categories } from '$lib/data/menu';
	import RiAppsLine from 'svelte-remixicon/RiAppsLine.svelte';
	import RiCake3Line from 'svelte-remixicon/RiCake3Line.svelte';
	import RiCupLine from 'svelte-remixicon/RiCupLine.svelte';
	import RiRestaurantLine from 'svelte-remixicon/RiRestaurantLine.svelte';
	import RiDropLine from 'svelte-remixicon/RiDropLine.svelte';
	import RiCake2Line from 'svelte-remixicon/RiCake2Line.svelte';

	const iconMap: Record<string, typeof RiAppsLine> = {
		apps: RiAppsLine,
		cake3: RiCake3Line,
		cup: RiCupLine,
		restaurant: RiRestaurantLine,
		drop: RiDropLine,
		cake2: RiCake2Line
	};

	let { selected = $bindable('all') }: { selected: string } = $props();
</script>

<div class="sticky top-0 z-30" style="background: rgba(255, 248, 240, 0.92); backdrop-filter: blur(12px);">
	<div class="flex gap-2 overflow-x-auto px-5 py-3 hide-scrollbar">
		{#each categories as cat}
			{@const Icon = iconMap[cat.icon]}
			<button
				onclick={() => (selected = cat.id)}
				class="flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold transition-all duration-250 border {selected === cat.id
					? 'bg-[#A4161A] text-[#FFF8F0] border-[#A4161A]'
					: 'bg-[#FFF8F0] text-[#6B705C] border-[#D5BFAA]/60 hover:border-[#A4161A]/40 hover:text-[#3C1518] active:scale-95'}"
			>
				<Icon size="14px" />
				<span>{cat.name}</span>
			</button>
		{/each}
	</div>
</div>

<style>
	.hide-scrollbar {
		-ms-overflow-style: none;
		scrollbar-width: none;
	}
	.hide-scrollbar::-webkit-scrollbar {
		display: none;
	}
</style>
