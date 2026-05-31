<script lang="ts">
	import type { MenuItem } from '$lib/data/menu';
	import BottomSheet from './BottomSheet.svelte';
	import RiShoppingCart2Fill from 'svelte-remixicon/RiShoppingCart2Fill.svelte';
	import RiCloseLine from 'svelte-remixicon/RiCloseLine.svelte';
	import RiDeleteBin6Line from 'svelte-remixicon/RiDeleteBin6Line.svelte';
	import RiShoppingCartLine from 'svelte-remixicon/RiShoppingCartLine.svelte';

	let {
		open = $bindable(false),
		items = $bindable([]),
		onRemove,
		onClear,
		onCheckout
	}: {
		open: boolean;
		items: { item: MenuItem; qty: number }[];
		onRemove: (id: number) => void;
		onClear: () => void;
		onCheckout?: () => void;
	} = $props();

	let total = $derived(items.reduce((sum, { item, qty }) => sum + item.price * qty, 0));
	let count = $derived(items.reduce((sum, { qty }) => sum + qty, 0));
</script>

<BottomSheet bind:open>
	{#snippet header(close)}
		<div class="flex items-center justify-between px-5 pb-3 pt-1 shrink-0">
			<h2 class="text-lg font-bold text-[#3C1518] flex items-center gap-2">
				<RiShoppingCart2Fill size="20px" class="text-[#A4161A]" />
				Корзина
				{#if count > 0}
					<span class="inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-[#A4161A] text-white text-xs font-bold">
						{count}
					</span>
				{/if}
			</h2>
			<button
				onclick={close}
				class="flex h-8 w-8 items-center justify-center rounded-full text-[#6B705C] transition-colors hover:bg-[#D5BFAA]/20 hover:text-[#3C1518]"
			>
				<RiCloseLine size="20px" />
			</button>
		</div>
		<div class="h-px bg-[#D5BFAA]/30 shrink-0"></div>
	{/snippet}

	{#if items.length === 0}
		<div class="flex flex-col items-center justify-center py-16">
			<RiShoppingCartLine size="48px" class="text-[#D5BFAA]" />
			<p class="mt-4 text-sm font-semibold text-[#6B705C]">Корзина пуста</p>
			<p class="mt-1 text-xs text-[#A5A58D]">Добавьте что-нибудь вкусное</p>
		</div>
	{:else}
		<div class="p-4 space-y-2">
			{#each items as { item, qty } (item.id)}
				<div class="flex items-center gap-3 rounded-xl bg-white/60 border border-[#D5BFAA]/20 p-3 group">
					<span class="text-2xl">{item.emoji}</span>
					<div class="min-w-0 flex-1">
						<p class="text-sm font-semibold text-[#3C1518] truncate">{item.name}</p>
						<p class="text-xs text-[#A5A58D]">{qty} × {item.price}₽</p>
					</div>
					<span class="text-sm font-bold text-[#A4161A]">{item.price * qty}₽</span>
					<button
						onclick={() => onRemove(item.id)}
						class="flex h-7 w-7 items-center justify-center rounded-lg text-[#D5BFAA] opacity-0 group-hover:opacity-100 transition-all hover:bg-[#A4161A]/10 hover:text-[#A4161A]"
					>
						<RiDeleteBin6Line size="14px" />
					</button>
				</div>
			{/each}
		</div>
	{/if}

	{#snippet footer()}
		{#if items.length > 0}
			<div class="space-y-3">
				<div class="flex items-center justify-between">
					<span class="text-sm text-[#6B705C]">Итого</span>
					<span class="text-xl font-bold text-[#3C1518]">{total}₽</span>
				</div>
				<div class="flex gap-2">
					<button
						onclick={onClear}
						class="flex-1 rounded-xl border border-[#D5BFAA]/50 py-3 text-sm font-semibold text-[#6B705C] transition-all hover:bg-[#D5BFAA]/10 active:scale-[0.98]"
					>
						Очистить
					</button>
					<button
						onclick={onCheckout}
						class="flex-[2] rounded-xl bg-[#A4161A] py-3 text-sm font-bold text-[#FFF8F0] transition-all hover:bg-[#8B1215] active:scale-[0.98]"
					>
						Оформить заказ
					</button>
				</div>
			</div>
		{/if}
	{/snippet}
</BottomSheet>
