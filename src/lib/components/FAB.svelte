<script lang="ts">
	import RiShoppingCart2Fill from 'svelte-remixicon/RiShoppingCart2Fill.svelte';

	let {
		onclick,
		badge
	}: {
		onclick?: () => void;
		badge?: number;
	} = $props();
</script>

<button
	{onclick}
	class="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#3C1518] text-white transition-all duration-200 hover:bg-[#2A0F11] hover:scale-105 active:scale-95"
	aria-label="Корзина"
	style="box-shadow: 0 4px 14px rgba(60, 21, 24, 0.25);"
>
	<RiShoppingCart2Fill size="22px" />
	{#if badge && badge > 0}
		<span class="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#A4161A] px-1 text-[11px] font-bold text-white">
			{badge}
		</span>
	{/if}
</button>
