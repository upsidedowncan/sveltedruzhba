<script lang="ts">
	import { menuItems, type MenuItem } from '$lib/data/menu';
	import MenuItemCard from './MenuItem.svelte';

	let {
		selectedCategory = 'all',
		cartItems = [],
		onAdd,
		onRemove
	}: {
		selectedCategory: string;
		cartItems: { item: MenuItem; qty: number }[];
		onAdd: (item: MenuItem) => void;
		onRemove: (id: number) => void;
	} = $props();

	let filteredItems = $derived(
		selectedCategory === 'all'
			? menuItems
			: menuItems.filter((item) => item.category === selectedCategory)
	);

	function getQty(id: number): number {
		return cartItems.find((ci) => ci.item.id === id)?.qty ?? 0;
	}
</script>

<div class="px-4 pb-24 pt-2">
	{#key selectedCategory}
		<div class="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
			{#each filteredItems as item (item.id)}
				<MenuItemCard {item} quantity={getQty(item.id)} {onAdd} {onRemove} />
			{/each}
		</div>
	{/key}
</div>
