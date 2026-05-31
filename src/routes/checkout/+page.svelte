<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentOrder, type CartItem } from '$lib/stores/order';
	import { RadioGroup, Select, Label } from 'bits-ui';
	import RiArrowLeftLine from 'svelte-remixicon/RiArrowLeftLine.svelte';
	import RiEBike2Line from 'svelte-remixicon/RiEBike2Line.svelte';
	import RiStore2Line from 'svelte-remixicon/RiStore2Line.svelte';
	import RiShoppingCart2Fill from 'svelte-remixicon/RiShoppingCart2Fill.svelte';
	import RiDeleteBin6Line from 'svelte-remixicon/RiDeleteBin6Line.svelte';
	import RiCheckLine from 'svelte-remixicon/RiCheckLine.svelte';
	import RiArrowDownSLine from 'svelte-remixicon/RiArrowDownSLine.svelte';
	import RiMapPin2Fill from 'svelte-remixicon/RiMapPin2Fill.svelte';
	import RiCurrentLine from 'svelte-remixicon/RiCurrentLine.svelte';

	let cartItems = $state<CartItem[]>([]);
	let orderType = $state<'delivery' | 'pickup'>('delivery');

	// Delivery fields
	let buildingType = $state<'apartment' | 'house'>('apartment');
	let street = $state('');
	let building = $state('');
	let apartment = $state('');
	let entrance = $state('');
	let floor = $state('');
	let intercom = $state('');
	let locatingLoading = $state(false);

	// Pickup location
	let pickupLocation = $state('ул. Имама Шамиля, 5/3');

	const pickupLocations = [
		'ул. Имама Шамиля, 5/3',
		'ул. Гаджиева, 12'
	];

	const buildingTypes = [
		{ value: 'apartment', label: 'Квартира' },
		{ value: 'house', label: 'Дом' }
	];

	$effect(() => {
		const stored = localStorage.getItem('druzhba-cart');
		if (stored) {
			try { cartItems = JSON.parse(stored); } catch {}
		}
	});

	let total = $derived(cartItems.reduce((sum, { item, qty }) => sum + item.price * qty, 0));
	let count = $derived(cartItems.reduce((sum, { qty }) => sum + qty, 0));

	function removeItem(id: number) {
		cartItems = cartItems.filter((ci) => ci.item.id !== id);
		localStorage.setItem('druzhba-cart', JSON.stringify(cartItems));
	}

	function proceed() {
		if (cartItems.length === 0) return;
		currentOrder.create(cartItems, orderType);
		localStorage.removeItem('druzhba-cart');
		goto('/checkout/sberpay');
	}
</script>

<svelte:head>
	<title>Оформление заказа — Дружба</title>
</svelte:head>

<div class="min-h-screen bg-[#FFF8F0]">
	<!-- Header -->
	<div class="flex items-center gap-3 px-5 pt-5 pb-3">
		<a href="/" class="flex h-9 w-9 items-center justify-center rounded-full text-[#3C1518] transition-colors hover:bg-[#D5BFAA]/20">
			<RiArrowLeftLine size="20px" />
		</a>
		<h1 class="text-lg font-bold text-[#3C1518]">Оформление</h1>
	</div>

	<div class="px-5 space-y-6 pb-40">
		<!-- Order type -->
		<div>
			<Label.Root class="text-sm font-bold text-[#3C1518] mb-3 block">Способ получения</Label.Root>
			<RadioGroup.Root bind:value={orderType} class="grid grid-cols-2 gap-2">
				<RadioGroup.Item
					value="delivery"
					class="flex flex-col items-center gap-2 rounded-xl border p-4 transition-all data-[state=checked]:border-[#A4161A] data-[state=checked]:bg-[#A4161A]/5 data-[state=unchecked]:border-[#D5BFAA]/30 data-[state=unchecked]:bg-white/60 hover:border-[#D5BFAA]/60"
				>
					<RiEBike2Line size="24px" />
					<span class="text-sm font-semibold">Доставка</span>
					<span class="text-[10px] text-[#A5A58D]">30–45 мин</span>
				</RadioGroup.Item>
				<RadioGroup.Item
					value="pickup"
					class="flex flex-col items-center gap-2 rounded-xl border p-4 transition-all data-[state=checked]:border-[#A4161A] data-[state=checked]:bg-[#A4161A]/5 data-[state=unchecked]:border-[#D5BFAA]/30 data-[state=unchecked]:bg-white/60 hover:border-[#D5BFAA]/60"
				>
					<RiStore2Line size="24px" />
					<span class="text-sm font-semibold">Самовывоз</span>
					<span class="text-[10px] text-[#A5A58D]">15–20 мин</span>
				</RadioGroup.Item>
			</RadioGroup.Root>
		</div>

		<!-- Delivery address -->
		{#if orderType === 'delivery'}
			<div class="space-y-3">
				<Label.Root class="text-sm font-bold text-[#3C1518] block">Адрес доставки</Label.Root>

				<!-- Building type -->
				<Select.Root type="single" bind:value={buildingType}>
					<Select.Trigger
						class="flex w-full items-center justify-between rounded-xl border border-[#D5BFAA]/30 bg-white/60 px-4 py-3 text-sm text-[#3C1518] transition-colors hover:border-[#D5BFAA]/60"
					>
						<span>{buildingTypes.find((t) => t.value === buildingType)?.label ?? 'Тип'}</span>
						<RiArrowDownSLine size="16px" class="text-[#6B705C]" />
					</Select.Trigger>
					<Select.Portal>
						<Select.Content
							class="z-50 rounded-xl border border-[#D5BFAA]/30 bg-[#FFF8F0] shadow-lg overflow-hidden"
							sideOffset={4}
						>
							<Select.Viewport class="p-1">
								{#each buildingTypes as type (type.value)}
									<Select.Item
										value={type.value}
										label={type.label}
										class="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-[#3C1518] outline-none data-[highlighted]:bg-[#A4161A]/5 cursor-pointer"
									>
										{#snippet children({ selected })}
											<span>{type.label}</span>
											{#if selected}
												<RiCheckLine size="14px" class="text-[#A4161A]" />
											{/if}
										{/snippet}
									</Select.Item>
								{/each}
							</Select.Viewport>
						</Select.Content>
					</Select.Portal>
				</Select.Root>

				<!-- Street -->
				<input
					type="text"
					bind:value={street}
					placeholder="Улица"
					class="w-full rounded-xl border border-[#D5BFAA]/30 bg-white/60 px-4 py-3 text-sm text-[#3C1518] placeholder-[#A5A58D] outline-none transition-colors hover:border-[#D5BFAA]/60 focus:border-[#A4161A]"
				/>

				<!-- Building + Apartment / House -->
				<div class="grid grid-cols-2 gap-3">
					<input
						type="text"
						bind:value={building}
						placeholder={buildingType === 'apartment' ? 'Дом' : 'Дом/владение'}
						class="w-full rounded-xl border border-[#D5BFAA]/30 bg-white/60 px-4 py-3 text-sm text-[#3C1518] placeholder-[#A5A58D] outline-none transition-colors hover:border-[#D5BFAA]/60 focus:border-[#A4161A]"
					/>
					{#if buildingType === 'apartment'}
						<input
							type="text"
							bind:value={apartment}
							placeholder="Квартира"
							class="w-full rounded-xl border border-[#D5BFAA]/30 bg-white/60 px-4 py-3 text-sm text-[#3C1518] placeholder-[#A5A58D] outline-none transition-colors hover:border-[#D5BFAA]/60 focus:border-[#A4161A]"
						/>
					{/if}
				</div>

				{#if buildingType === 'apartment'}
					<div class="grid grid-cols-3 gap-3">
						<input
							type="text"
							bind:value={entrance}
							placeholder="Подъезд"
							class="w-full rounded-xl border border-[#D5BFAA]/30 bg-white/60 px-4 py-3 text-sm text-[#3C1518] placeholder-[#A5A58D] outline-none transition-colors hover:border-[#D5BFAA]/60 focus:border-[#A4161A]"
						/>
						<input
							type="text"
							bind:value={floor}
							placeholder="Этаж"
							class="w-full rounded-xl border border-[#D5BFAA]/30 bg-white/60 px-4 py-3 text-sm text-[#3C1518] placeholder-[#A5A58D] outline-none transition-colors hover:border-[#D5BFAA]/60 focus:border-[#A4161A]"
						/>
						<input
							type="text"
							bind:value={intercom}
							placeholder="Домофон"
							class="w-full rounded-xl border border-[#D5BFAA]/30 bg-white/60 px-4 py-3 text-sm text-[#3C1518] placeholder-[#A5A58D] outline-none transition-colors hover:border-[#D5BFAA]/60 focus:border-[#A4161A]"
						/>
					</div>
				{/if}
			</div>
		{/if}

		<!-- Pickup location -->
		{#if orderType === 'pickup'}
			<div class="space-y-3">
				<Label.Root class="text-sm font-bold text-[#3C1518] block">Точка выдачи</Label.Root>
				<RadioGroup.Root bind:value={pickupLocation} class="space-y-2">
					{#each pickupLocations as loc (loc)}
						<RadioGroup.Item
							value={loc}
							class="flex w-full items-center gap-3 rounded-xl border p-4 text-left transition-all data-[state=checked]:border-[#A4161A] data-[state=checked]:bg-[#A4161A]/5 data-[state=unchecked]:border-[#D5BFAA]/30 data-[state=unchecked]:bg-white/60 hover:border-[#D5BFAA]/60"
						>
							<RiMapPin2Fill size="20px" class="text-[#A4161A] shrink-0" />
							<div class="flex-1 min-w-0">
								<p class="text-sm font-semibold text-[#3C1518]">{loc}</p>
								<p class="text-[10px] text-[#A5A58D] mt-0.5">Ежедневно 10:00–23:00</p>
							</div>
							<div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border data-[state=checked]:border-[#A4161A] data-[state=checked]:bg-[#A4161A] data-[state=unchecked]:border-[#D5BFAA]/40">
								<RadioGroup.ItemIndicator class="flex items-center justify-center">
									<div class="h-2 w-2 rounded-full bg-white"></div>
								</RadioGroup.ItemIndicator>
							</div>
						</RadioGroup.Item>
					{/each}
				</RadioGroup.Root>
			</div>
		{/if}

		<!-- Order items -->
		<div>
			<h2 class="text-sm font-bold text-[#3C1518] mb-3">Ваш заказ ({count})</h2>
			<div class="space-y-2">
				{#each cartItems as { item, qty } (item.id)}
					<div class="flex items-center gap-3 rounded-xl bg-white/60 border border-[#D5BFAA]/20 p-3 group">
						<span class="text-2xl">{item.emoji}</span>
						<div class="min-w-0 flex-1">
							<p class="text-sm font-semibold text-[#3C1518] truncate">{item.name}</p>
							<p class="text-xs text-[#A5A58D]">{qty} × {item.price}₽</p>
						</div>
						<span class="text-sm font-bold text-[#A4161A]">{item.price * qty}₽</span>
						<button
							onclick={() => removeItem(item.id)}
							class="flex h-7 w-7 items-center justify-center rounded-lg text-[#D5BFAA] opacity-0 group-hover:opacity-100 transition-all hover:bg-[#A4161A]/10 hover:text-[#A4161A]"
						>
							<RiDeleteBin6Line size="14px" />
						</button>
					</div>
				{/each}
			</div>
		</div>
	</div>

	<!-- Fixed bottom bar -->
	<div class="fixed bottom-0 left-0 right-0 bg-[#FFF8F0] border-t border-[#D5BFAA]/30 p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
		<div class="flex items-center justify-between mb-3">
			<span class="text-sm text-[#6B705C]">Итого</span>
			<span class="text-xl font-bold text-[#3C1518]">{total}₽</span>
		</div>
		<button
			onclick={proceed}
			disabled={cartItems.length === 0}
			class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#A4161A] py-3.5 text-sm font-bold text-[#FFF8F0] transition-all hover:bg-[#8B1215] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
		>
			<RiShoppingCart2Fill size="16px" />
			<span>Перейти к оплате</span>
		</button>
	</div>
</div>
