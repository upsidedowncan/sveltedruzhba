<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentOrder, orderStatusText } from '$lib/stores/order';
	import RiArrowLeftLine from 'svelte-remixicon/RiArrowLeftLine.svelte';
	import RiPhoneFill from 'svelte-remixicon/RiPhoneFill.svelte';

	let order = $state($currentOrder);
	let mapEl: HTMLDivElement | null = $state(null);
	let map: any;
	let L: any;
	let driverMarker: any;
	let driverProgress = $state(0);
	let driverTimer: ReturnType<typeof setInterval>;
	let mapReady = $state(false);

	// Buynaksk, Имама Шамиля 5/3
	const restaurant: [number, number] = [42.8217, 47.1167];
	const userLocation: [number, number] = [42.8180, 47.1250];

	$effect(() => {
		order = $currentOrder;
	});

	// Initialize map
	$effect(() => {
		if (!mapEl || mapReady) return;

		async function init() {
			L = await import('leaflet');

			map = L.map(mapEl, {
				zoomControl: false,
				attributionControl: false
			}).setView(restaurant, 14);

			L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
				maxZoom: 19
			}).addTo(map);

			// Restaurant marker
			const restIcon = L.divIcon({
				className: 'custom-marker',
				html: `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:#3C1518;color:white;font-weight:bold;font-size:12px;box-shadow:0 2px 8px rgba(0,0,0,0.3);">Д</div>`,
				iconSize: [32, 32],
				iconAnchor: [16, 32]
			});
			L.marker(restaurant, { icon: restIcon }).addTo(map);

			// User marker
			const userIcon = L.divIcon({
				className: 'custom-marker',
				html: `<div style="display:flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:#A4161A;color:white;box-shadow:0 2px 8px rgba(0,0,0,0.3);"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg></div>`,
				iconSize: [32, 32],
				iconAnchor: [16, 32]
			});
			L.marker(userLocation, { icon: userIcon }).addTo(map);

			// Driver marker (hidden initially)
			const driverIcon = L.divIcon({
				className: 'custom-marker',
				html: `<div style="display:flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;background:#3C1518;color:white;box-shadow:0 2px 12px rgba(0,0,0,0.4);transition:all 0.15s linear;"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 5.5c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zM5 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5zm5.8-10l2.4-2.4.8.8c1.3 1.3 3 2.1 5 2.1V9c-1.5 0-2.7-.6-3.6-1.5l-1.9-1.9c-.5-.4-1-.6-1.6-.6s-1.1.2-1.4.6L7.8 8.4c-.4.4-.6.9-.6 1.4 0 .6.2 1.1.6 1.4L11 14v5h2v-6.2l-2.2-2.3zM19 12c-2.8 0-5 2.2-5 5s2.2 5 5 5 5-2.2 5-5-2.2-5-5-5zm0 8.5c-1.9 0-3.5-1.6-3.5-3.5s1.6-3.5 3.5-3.5 3.5 1.6 3.5 3.5-1.6 3.5-3.5 3.5z"/></svg></div>`,
				iconSize: [36, 36],
				iconAnchor: [18, 18]
			});
			driverMarker = L.marker(restaurant, { icon: driverIcon });

			mapReady = true;
		}

		init();
	});

	// Simulate order progress
	$effect(() => {
		if (!order) return;
		const timers: ReturnType<typeof setTimeout>[] = [];

		if (order.status === 'preparing') {
			timers.push(setTimeout(() => {
				currentOrder.updateStatus(order.type === 'delivery' ? 'on_the_way' : 'ready');
			}, 4000));
		}

		if (order.status === 'on_the_way' && mapReady) {
			driverMarker.addTo(map);
			driverProgress = 0;

			// Fit bounds to show both points
			if (L) {
				const bounds = L.latLngBounds([restaurant, userLocation]);
				map.fitBounds(bounds.pad(0.3));
			}

			driverTimer = setInterval(() => {
				driverProgress += 0.006;

				// Interpolate position
				const lat = restaurant[0] + (userLocation[0] - restaurant[0]) * driverProgress;
				const lng = restaurant[1] + (userLocation[1] - restaurant[1]) * driverProgress;
				driverMarker.setLatLng([lat, lng]);

				if (driverProgress >= 1) {
					driverProgress = 1;
					clearInterval(driverTimer);
					setTimeout(() => currentOrder.complete(), 1500);
				}
			}, 100);
		}

		if (order.status === 'ready') {
			timers.push(setTimeout(() => currentOrder.complete(), 8000));
		}

		return () => {
			timers.forEach(clearTimeout);
			clearInterval(driverTimer);
		};
	});

	function getEstimatedTime() {
		if (!order) return '';
		if (order.status === 'completed') return 'Доставлен';
		if (order.status === 'on_the_way') return `${Math.ceil((1 - driverProgress) * 15)} мин`;
		if (order.status === 'preparing') return order.type === 'delivery' ? '30–45 мин' : '15–20 мин';
		return '';
	}

	let steps = $derived(
		order
			? [
					{ key: 'preparing', label: 'Готовится' },
					...(order.type === 'delivery'
						? [{ key: 'on_the_way', label: 'В пути' }]
						: [{ key: 'ready', label: 'Готов' }]),
					{ key: 'completed', label: 'Выполнен' }
				]
			: []
	);

	function stepIndex(key: string) {
		return steps.findIndex((s) => s.key === key);
	}

	function currentStepIndex() {
		if (!order) return -1;
		return stepIndex(order.status);
	}

	function isStepDone(key: string) {
		return currentStepIndex() > stepIndex(key) || order?.status === 'completed';
	}

	function isStepActive(key: string) {
		return order?.status === key;
	}
</script>

<svelte:head>
	<title>Статус заказа — Дружба</title>
	<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
</svelte:head>

<div class="min-h-screen bg-[#FFF8F0]">
	<!-- Header -->
	<div class="flex items-center justify-between px-5 pt-5 pb-3">
		<a href="/" class="flex h-9 w-9 items-center justify-center rounded-full text-[#3C1518] transition-colors hover:bg-[#D5BFAA]/20">
			<RiArrowLeftLine size="20px" />
		</a>
		<h1 class="text-lg font-bold text-[#3C1518]">Заказ {order?.id ?? ''}</h1>
		<div class="w-9"></div>
	</div>

	{#if order}
		<!-- Map -->
		<div class="relative mx-5 rounded-2xl overflow-hidden mb-4" style="height: 240px;">
			<div bind:this={mapEl} class="w-full h-full"></div>

			<!-- ETA badge -->
			{#if order.status !== 'completed'}
				<div class="absolute bottom-3 left-3 z-[1000] rounded-lg bg-white/90 backdrop-blur-sm px-3 py-1.5 shadow-md">
					<p class="text-[10px] text-[#6B705C]">Прибытие</p>
					<p class="text-sm font-bold text-[#3C1518]">{getEstimatedTime()}</p>
				</div>
			{/if}
		</div>

		<div class="px-5 space-y-3 pb-24">
			<!-- Status + timeline -->
			<div class="rounded-xl bg-white border border-[#D5BFAA]/20 p-4">
				<div class="flex items-center justify-between mb-3">
					<span class="text-sm font-bold text-[#3C1518]">{orderStatusText[order.status]}</span>
					{#if order.status !== 'completed'}
						<span class="text-xs text-[#A5A58D]">{getEstimatedTime()}</span>
					{/if}
				</div>

				<div class="flex items-center gap-1">
					{#each steps as step, i}
						{@const done = isStepDone(step.key)}
						{@const active = isStepActive(step.key)}
						<div class="flex items-center gap-1 flex-1">
							<div class="flex h-5 w-5 shrink-0 items-center justify-center rounded-full {done ? 'bg-[#A4161A]' : active ? 'bg-[#A4161A]' : 'bg-[#D5BFAA]/30'}">
								{#if done}
									<span class="text-[9px] text-white">✓</span>
								{:else}
									<div class="h-1.5 w-1.5 rounded-full {active ? 'bg-white animate-pulse' : 'bg-[#D5BFAA]/50'}"></div>
								{/if}
							</div>
							{#if i < steps.length - 1}
								<div class="flex-1 h-0.5 {done ? 'bg-[#A4161A]' : 'bg-[#D5BFAA]/30'}"></div>
							{/if}
						</div>
					{/each}
				</div>
				<div class="flex justify-between mt-1.5">
					{#each steps as step}
						<span class="text-[9px] {isStepDone(step.key) || isStepActive(step.key) ? 'text-[#3C1518] font-medium' : 'text-[#A5A58D]'}">{step.label}</span>
					{/each}
				</div>
			</div>

			<!-- Order items -->
			<div class="rounded-xl bg-white border border-[#D5BFAA]/20 p-4">
				<div class="flex items-center justify-between mb-2">
					<h3 class="text-xs font-bold text-[#3C1518]">Состав</h3>
					<span class="text-xs font-bold text-[#A4161A]">{order.total}₽</span>
				</div>
				<div class="flex flex-wrap gap-1.5">
					{#each order.items as { item, qty }}
						<span class="inline-flex items-center gap-1 rounded-full bg-[#FFF8F0] border border-[#D5BFAA]/20 px-2.5 py-1 text-[11px] text-[#3C1518]">
							{item.emoji} {item.name}{#if qty > 1} ×{qty}{/if}
						</span>
					{/each}
				</div>
			</div>

			<a
				href="tel:+79991234567"
				class="flex w-full items-center justify-center gap-2 rounded-xl border border-[#D5BFAA]/40 py-2.5 text-xs font-semibold text-[#6B705C] transition-all hover:bg-[#D5BFAA]/10 active:scale-[0.98]"
			>
				<RiPhoneFill size="14px" />
				<span>Позвонить в пиццерию</span>
			</a>
		</div>
	{:else}
		<div class="flex flex-col items-center justify-center py-20">
			<p class="text-sm text-[#6B705C]">Заказ не найден</p>
			<a href="/" class="mt-4 text-sm font-semibold text-[#A4161A]">На главную</a>
		</div>
	{/if}
</div>

<style>
	:global(.custom-marker) {
		background: transparent !important;
		border: none !important;
	}
	:global(.leaflet-control-attribution) {
		display: none !important;
	}
</style>
