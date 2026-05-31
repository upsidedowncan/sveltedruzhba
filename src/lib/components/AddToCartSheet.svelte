<script lang="ts">
	import type { MenuItem } from '$lib/data/menu';
	import { menuItems } from '$lib/data/menu';
	import BottomSheet from './BottomSheet.svelte';
	import RiCloseLine from 'svelte-remixicon/RiCloseLine.svelte';
	import RiAddLine from 'svelte-remixicon/RiAddLine.svelte';
	import RiCheckLine from 'svelte-remixicon/RiCheckLine.svelte';
	import RiShoppingCartLine from 'svelte-remixicon/RiShoppingCartLine.svelte';

	let {
		open = $bindable(false),
		item = $bindable(null),
		onConfirm
	}: {
		open: boolean;
		item: MenuItem | null;
		onConfirm: (item: MenuItem, extras: { name: string; price: number }[], suggestions: MenuItem[]) => void;
	} = $props();

	const extrasMap: Record<string, { name: string; price: number }[]> = {
		pizza: [
			{ name: 'Двойная моцарелла', price: 79 },
			{ name: 'Халапеньо', price: 49 },
			{ name: 'Дополнительный соус', price: 39 },
			{ name: 'Бортик из сыра', price: 129 }
		],
		snacks: [
			{ name: 'Соус ранч', price: 49 },
			{ name: 'Соус барбекю', price: 49 },
			{ name: 'Сырный соус', price: 69 }
		],
		drinks: [],
		sauces: [],
		desserts: [
			{ name: 'Шоколадный топпинг', price: 39 },
			{ name: 'Карамельный топпинг', price: 39 }
		]
	};

	const suggestionIds: Record<string, number[]> = {
		pizza: [9, 13, 17],
		snacks: [9, 18],
		drinks: [1, 13],
		sauces: [13, 14],
		desserts: [10, 12]
	};

	let selectedExtras = $state<string[]>([]);
	let addedSuggestions = $state<number[]>([]);

	let extras = $derived(item ? extrasMap[item.category] ?? [] : []);
	let suggestions = $derived(
		item
			? (suggestionIds[item.category] ?? [])
					.map((id) => menuItems.find((m) => m.id === id))
					.filter(Boolean) as MenuItem[]
			: []
	);

	let extrasTotal = $derived(
		selectedExtras.reduce((sum, name) => {
			const e = extras.find((x) => x.name === name);
			return sum + (e?.price ?? 0);
		}, 0)
	);

	let suggestionsTotal = $derived(
		addedSuggestions.reduce((sum, id) => {
			const s = suggestions.find((x) => x.id === id);
			return sum + (s?.price ?? 0);
		}, 0)
	);

	function toggleExtra(name: string) {
		selectedExtras = selectedExtras.includes(name)
			? selectedExtras.filter((e) => e !== name)
			: [...selectedExtras, name];
	}

	function toggleSuggestion(id: number) {
		addedSuggestions = addedSuggestions.includes(id)
			? addedSuggestions.filter((s) => s !== id)
			: [...addedSuggestions, id];
	}

	function confirm() {
		if (!item) return;
		const suggestionItems = addedSuggestions
			.map((id) => suggestions.find((s) => s.id === id))
			.filter(Boolean) as MenuItem[];
		const selectedExtraObjs = selectedExtras.map((name) => {
			const e = extras.find((x) => x.name === name);
			return { name, price: e?.price ?? 0 };
		});
		onConfirm(item, selectedExtraObjs, suggestionItems);
		open = false;
		setTimeout(() => {
			selectedExtras = [];
			addedSuggestions = [];
		}, 300);
	}
</script>

<BottomSheet bind:open>
	{#snippet header(close)}
		{#if item}
			<div class="flex items-center justify-between px-5 pb-3 pt-1 shrink-0">
				<div class="flex items-center gap-3">
					<span class="text-3xl">{item.emoji}</span>
					<div>
						<h2 class="text-base font-bold text-[#3C1518]">{item.name}</h2>
						<p class="text-sm font-bold text-[#A4161A]">{item.price}₽</p>
					</div>
				</div>
				<button
					onclick={close}
					class="flex h-8 w-8 items-center justify-center rounded-full text-[#6B705C] transition-colors hover:bg-[#D5BFAA]/20 hover:text-[#3C1518]"
				>
					<RiCloseLine size="20px" />
				</button>
			</div>
			<div class="h-px bg-[#D5BFAA]/30 shrink-0"></div>
		{/if}
	{/snippet}

	{#if item}
		<div class="p-5 space-y-5">
			<!-- Extras -->
			{#if extras.length > 0}
				<div>
					<h3 class="text-sm font-bold text-[#3C1518] mb-3">Добавить к заказу</h3>
					<div class="space-y-2">
						{#each extras as extra}
							<button
								onclick={() => toggleExtra(extra.name)}
								class="flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left transition-all duration-200 {selectedExtras.includes(extra.name)
									? 'border-[#A4161A] bg-[#A4161A]/5'
									: 'border-[#D5BFAA]/30 bg-white/60 hover:border-[#D5BFAA]/60'}"
							>
								<span class="text-sm font-medium text-[#3C1518]">{extra.name}</span>
								<div class="flex items-center gap-2">
									<span class="text-xs font-bold text-[#6B705C]">+{extra.price}₽</span>
									<div class="flex h-5 w-5 items-center justify-center rounded-md border transition-all {selectedExtras.includes(extra.name)
										? 'border-[#A4161A] bg-[#A4161A] text-white'
										: 'border-[#D5BFAA]/40'}">
										{#if selectedExtras.includes(extra.name)}
											<RiCheckLine size="12px" />
										{/if}
									</div>
								</div>
							</button>
						{/each}
					</div>
				</div>
			{/if}

			<!-- People also order -->
			{#if suggestions.length > 0}
				<div>
					<h3 class="text-sm font-bold text-[#3C1518] mb-1">Часто заказывают вместе</h3>
					<p class="text-xs text-[#A5A58D] mb-3">Добавьте к заказу одним нажатием</p>
					<div class="space-y-2">
						{#each suggestions as sug}
							<button
								onclick={() => toggleSuggestion(sug.id)}
								class="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all duration-200 {addedSuggestions.includes(sug.id)
									? 'border-[#A4161A] bg-[#A4161A]/5'
									: 'border-[#D5BFAA]/30 bg-white/60 hover:border-[#D5BFAA]/60'}"
							>
								<span class="text-2xl">{sug.emoji}</span>
								<div class="flex-1 min-w-0">
									<p class="text-sm font-medium text-[#3C1518]">{sug.name}</p>
									<p class="text-xs text-[#A5A58D] truncate">{sug.description}</p>
								</div>
								<div class="flex items-center gap-2 shrink-0">
									<span class="text-xs font-bold text-[#6B705C]">{sug.price}₽</span>
									{#if addedSuggestions.includes(sug.id)}
										<div class="flex h-5 w-5 items-center justify-center rounded-md bg-[#A4161A] text-white">
											<RiCheckLine size="12px" />
										</div>
									{:else}
										<div class="flex h-5 w-5 items-center justify-center rounded-md border border-[#D5BFAA]/40 text-[#A4161A]">
											<RiAddLine size="12px" />
										</div>
									{/if}
								</div>
							</button>
						{/each}
					</div>
				</div>
			{/if}
		</div>
	{/if}

	{#snippet footer()}
		<button
			onclick={confirm}
			class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A4161A] py-3.5 text-sm font-bold text-[#FFF8F0] transition-all hover:bg-[#8B1215] active:scale-[0.98]"
		>
			<RiShoppingCartLine size="16px" />
			<span>
				Добавить{#if item}{#if extrasTotal + suggestionsTotal > 0} за {item.price + extrasTotal + suggestionsTotal}₽{:else} за {item.price}₽{/if}{/if}
			</span>
		</button>
	{/snippet}
</BottomSheet>
