<script lang="ts">
	import { currentOrder, orderStatusText } from '$lib/stores/order';
	import RiFireFill from 'svelte-remixicon/RiFireFill.svelte';
	import RiEBike2Fill from 'svelte-remixicon/RiEBike2Fill.svelte';
	import RiGiftFill from 'svelte-remixicon/RiGiftFill.svelte';
	import RiArrowRightSLine from 'svelte-remixicon/RiArrowRightSLine.svelte';
	import RiTimeLine from 'svelte-remixicon/RiTimeLine.svelte';

	let order = $state($currentOrder);

	$effect(() => {
		order = $currentOrder;
	});

	const promos = [
		{
			id: 'promo-1',
			title: '2 пиццы за 999₽',
			subtitle: 'Каждый день с 12:00 до 16:00',
			icon: RiFireFill,
			bg: 'bg-[#A4161A]',
			text: 'text-white',
			link: null
		},
		{
			id: 'promo-2',
			title: 'Бесплатная доставка',
			subtitle: 'При заказе от 1500₽',
			icon: RiEBike2Fill,
			bg: 'bg-[#3C1518]',
			text: 'text-white',
			link: null
		},
		{
			id: 'promo-3',
			title: 'Скидка 20% новым',
			subtitle: 'На первый заказ',
			icon: RiGiftFill,
			bg: 'bg-white border border-[#D5BFAA]/40',
			text: 'text-[#3C1518]',
			link: null
		}
	];
</script>

<div class="px-5 pt-3">
	<div class="flex gap-3 overflow-x-auto pb-1 snap-x snap-mandatory hide-scrollbar">
		<!-- Active order card -->
		{#if order && order.status !== 'completed'}
			<a
				href="/checkout/status"
				class="flex min-w-[240px] shrink-0 snap-start items-center gap-3 rounded-xl bg-emerald-600 text-white px-4 py-3.5"
			>
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/20">
					<RiTimeLine size="20px" />
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-sm font-bold leading-tight">Заказ {order.id}</p>
					<p class="mt-0.5 text-xs text-white/70 leading-snug">{orderStatusText[order.status]}</p>
				</div>
				<RiArrowRightSLine size="16px" class="shrink-0 opacity-40" />
			</a>
		{/if}

		<!-- Promo cards -->
		{#each promos as promo, i}
			<div
				class="flex min-w-[240px] shrink-0 snap-start items-center gap-3 rounded-xl {promo.bg} {promo.text} px-4 py-3.5"
			>
				<div class="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg {promo.id === 'promo-3' ? 'bg-[#A4161A]/10 text-[#A4161A]' : 'bg-white/15'}">
					<svelte:component this={promo.icon} size="20px" />
				</div>
				<div class="min-w-0 flex-1">
					<p class="text-sm font-bold leading-tight">{promo.title}</p>
					<p class="mt-0.5 text-xs {promo.id === 'promo-3' ? 'text-[#6B705C]' : 'text-white/60'} leading-snug">{promo.subtitle}</p>
				</div>
				<RiArrowRightSLine size="16px" class="shrink-0 opacity-40" />
			</div>
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
