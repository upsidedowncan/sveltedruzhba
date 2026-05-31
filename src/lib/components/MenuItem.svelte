<script lang="ts">
	import type { MenuItem as MenuItemType } from '$lib/data/menu';
	import RiAddLine from 'svelte-remixicon/RiAddLine.svelte';
	import RiSubtractLine from 'svelte-remixicon/RiSubtractLine.svelte';
	import RiFireFill from 'svelte-remixicon/RiFireFill.svelte';

	let {
		item,
		quantity = 0,
		onAdd,
		onRemove
	}: {
		item: MenuItemType;
		quantity?: number;
		onAdd: (item: MenuItemType) => void;
		onRemove: (id: number) => void;
	} = $props();
</script>

<div
	class="group relative flex flex-col rounded-xl bg-white/80 border border-[#D5BFAA]/30 transition-all duration-200 hover:border-[#D5BFAA]/60 hover:-translate-y-0.5 overflow-hidden h-full"
	style="box-shadow: 0 1px 3px rgba(60, 21, 24, 0.04);"
>
	{#if item.popular}
		<div class="absolute top-2 right-2 z-10 flex h-5 items-center gap-0.5 rounded-full bg-[#A4161A] px-2 text-[9px] font-bold text-white">
			<RiFireFill size="9px" />
			Топ
		</div>
	{/if}

	<!-- Image -->
	{#if item.image}
		<div class="relative h-32 overflow-hidden bg-[#FFF8F0]">
			<img
				src={item.image}
				alt={item.name}
				class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
				loading="lazy"
			/>
			<div class="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
		</div>
	{/if}

	<div class="flex items-start gap-3 p-3 {item.image ? 'pt-2.5' : ''}">
		{#if !item.image}
			<div class="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF8F0] text-xl transition-transform duration-300 group-hover:scale-105 group-hover:rotate-2 border border-[#D5BFAA]/20">
				{item.emoji}
			</div>
		{/if}
		<div class="min-w-0 flex-1 flex flex-col">
			<div class="flex items-start justify-between gap-1.5">
				<h3 class="text-[13px] font-bold text-[#3C1518] leading-tight">{item.name}</h3>
				<span class="shrink-0 text-[13px] font-bold text-[#A4161A]">{item.price}₽</span>
			</div>
			<p class="mt-0.5 text-[11px] text-[#6B705C] leading-snug line-clamp-2 h-[2.7em]">{item.description}</p>
			{#if item.weight}
				<span class="mt-auto pt-1 inline-block text-[9px] text-[#A5A58D] font-medium tracking-wide">{item.weight}</span>
			{/if}
		</div>
	</div>

	<div class="p-3 pt-0 mt-auto">
		{#if quantity > 0}
			<div class="flex items-center justify-between rounded-lg bg-[#A4161A] text-white h-8 overflow-hidden">
				<button
					onclick={() => onRemove(item.id)}
					class="flex h-full w-9 items-center justify-center shrink-0 transition-colors hover:bg-[#8B1215] active:bg-[#700F11]"
					aria-label="Убрать"
				>
					<RiSubtractLine size="14px" />
				</button>
				<span class="text-xs font-bold tabular-nums">{quantity}</span>
				<button
					onclick={() => onAdd(item)}
					class="flex h-full w-9 items-center justify-center shrink-0 transition-colors hover:bg-[#8B1215] active:bg-[#700F11]"
					aria-label="Добавить"
				>
					<RiAddLine size="14px" />
				</button>
			</div>
		{:else}
			<button
				onclick={() => onAdd(item)}
				class="flex w-full items-center justify-center gap-1 rounded-lg bg-[#A4161A] py-2 text-[11px] font-bold text-[#FFF8F0] transition-all duration-200 hover:bg-[#8B1215] active:scale-[0.97]"
			>
				<RiAddLine size="13px" />
				<span>В корзину</span>
			</button>
		{/if}
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
