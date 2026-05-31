<script lang="ts">
	import { goto } from '$app/navigation';
	import PromoCards from '$lib/components/PromoCards.svelte';
	import CategoryChips from '$lib/components/CategoryChips.svelte';
	import MenuGrid from '$lib/components/MenuGrid.svelte';
	import FAB from '$lib/components/FAB.svelte';
	import CartDrawer from '$lib/components/CartDrawer.svelte';
	import AddToCartSheet from '$lib/components/AddToCartSheet.svelte';
	import type { MenuItem } from '$lib/data/menu';

	let selectedCategory = $state('all');
	let cartOpen = $state(false);
	let cartItems = $state<{ item: MenuItem; qty: number }[]>([]);
	let cartCount = $derived(cartItems.reduce((sum, { qty }) => sum + qty, 0));

	// Add-to-cart sheet state
	let addSheetOpen = $state(false);
	let addSheetItem = $state<MenuItem | null>(null);

	// Save cart to localStorage whenever it changes
	$effect(() => {
		localStorage.setItem('druzhba-cart', JSON.stringify(cartItems));
	});

	// Load cart from localStorage on mount
	$effect(() => {
		const stored = localStorage.getItem('druzhba-cart');
		if (stored) {
			try {
				cartItems = JSON.parse(stored);
			} catch {}
		}
	});

	function handleAddClick(item: MenuItem) {
		addSheetItem = item;
		addSheetOpen = true;
	}

	function handleAddConfirm(item: MenuItem, extras: { name: string; price: number }[], suggestions: MenuItem[]) {
		addItemToCart(item);

		for (const extra of extras) {
			const hash = extra.name.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
			addItemToCart({
				id: item.id * 10000 + hash,
				name: extra.name,
				description: '',
				price: extra.price,
				category: item.category,
				emoji: '➕'
			});
		}

		for (const sug of suggestions) {
			addItemToCart(sug);
		}
	}

	function addItemToCart(item: MenuItem) {
		const existing = cartItems.find((ci) => ci.item.id === item.id);
		if (existing) {
			existing.qty++;
			cartItems = [...cartItems];
		} else {
			cartItems = [...cartItems, { item, qty: 1 }];
		}
	}

	function removeFromCart(id: number) {
		const existing = cartItems.find((ci) => ci.item.id === id);
		if (existing && existing.qty > 1) {
			existing.qty--;
			cartItems = [...cartItems];
		} else {
			cartItems = cartItems.filter((ci) => ci.item.id !== id);
		}
	}

	function clearCart() {
		cartItems = [];
	}

	function goToCheckout() {
		goto('/checkout');
	}
</script>

<svelte:head>
	<title>Дружба — Пиццерия</title>
	<meta name="description" content="Лучшая пицца в городе. Доставка за 30 минут." />
</svelte:head>

<div class="min-h-screen" style="background: #FFF8F0;">
	<!-- Brand -->
	<div class="px-5 pt-6 pb-2">
		<h1 class="text-2xl font-bold text-[#3C1518] tracking-tight">Дружба</h1>
		<p class="text-xs text-[#A5A58D] mt-0.5 font-medium tracking-wide uppercase">Пиццерия</p>
	</div>

	<!-- Promos -->
	<PromoCards />

	<!-- Section title -->
	<div class="px-5 pt-5 pb-1">
		<h2 class="text-base font-semibold text-[#3C1518]">Меню</h2>
	</div>

	<!-- Categories -->
	<CategoryChips bind:selected={selectedCategory} />

	<!-- Menu -->
	<MenuGrid {selectedCategory} {cartItems} onAdd={handleAddClick} onRemove={removeFromCart} />

	<!-- Cart FAB -->
	<div class="fixed bottom-5 right-4 z-40 pb-[env(safe-area-inset-bottom)]">
		<FAB badge={cartCount} onclick={() => (cartOpen = true)} />
	</div>

	<!-- Add to cart sheet -->
	<AddToCartSheet bind:open={addSheetOpen} bind:item={addSheetItem} onConfirm={handleAddConfirm} />

	<!-- Cart -->
	<CartDrawer bind:open={cartOpen} bind:items={cartItems} onRemove={removeFromCart} onClear={clearCart} onCheckout={goToCheckout} />
</div>
