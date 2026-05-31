<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentOrder } from '$lib/stores/order';

	let processing = $state(false);
	let order = $state($currentOrder);

	function pay() {
		processing = true;
		// Simulate payment processing
		setTimeout(() => {
			currentOrder.updateStatus('preparing');
			goto('/checkout/status');
		}, 2000);
	}
</script>

<svelte:head>
	<title>Оплата — СберПэй</title>
</svelte:head>

<div class="min-h-screen bg-[#F4F8F5] flex flex-col">
	<!-- SberPay header -->
	<div class="flex items-center justify-center px-5 py-4 bg-white border-b border-gray-100">
		<div class="flex items-center gap-2">
			<div class="flex h-8 w-8 items-center justify-center rounded-lg bg-[#21A038] text-white text-xs font-bold">
				S
			</div>
			<span class="text-base font-bold text-[#21A038]">СберПэй</span>
		</div>
	</div>

	<div class="flex-1 flex flex-col items-center justify-center px-6">
		{#if processing}
			<!-- Processing animation -->
			<div class="flex flex-col items-center">
				<div class="relative h-20 w-20 mb-6">
					<div class="absolute inset-0 rounded-full border-4 border-[#21A038]/20"></div>
					<div class="absolute inset-0 rounded-full border-4 border-transparent border-t-[#21A038] animate-spin"></div>
					<div class="absolute inset-3 flex items-center justify-center">
						<span class="text-2xl">💳</span>
					</div>
				</div>
				<p class="text-base font-semibold text-gray-800 mb-1">Обработка платежа</p>
				<p class="text-sm text-gray-500">Пожалуйста, подождите...</p>
			</div>
		{:else}
			<!-- Payment card -->
			<div class="w-full max-w-sm">
				<div class="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 mb-6">
					<div class="flex items-center justify-between mb-4">
						<span class="text-sm text-gray-500">Заказ</span>
						<span class="text-sm font-bold text-gray-800">{order?.id ?? '—'}</span>
					</div>
					<div class="flex items-center justify-between mb-6">
						<span class="text-sm text-gray-500">Сумма</span>
						<span class="text-2xl font-bold text-gray-900">{order?.total ?? 0} ₽</span>
					</div>

					<!-- Card input -->
					<div class="space-y-3 mb-6">
						<div class="rounded-xl border border-gray-200 px-4 py-3 bg-gray-50">
							<p class="text-[10px] text-gray-400 mb-1">Номер карты</p>
							<p class="text-sm font-medium text-gray-800 tracking-wider">•••• •••• •••• 4276</p>
						</div>
						<div class="grid grid-cols-2 gap-3">
							<div class="rounded-xl border border-gray-200 px-4 py-3 bg-gray-50">
								<p class="text-[10px] text-gray-400 mb-1">Срок</p>
								<p class="text-sm font-medium text-gray-800">12/28</p>
							</div>
							<div class="rounded-xl border border-gray-200 px-4 py-3 bg-gray-50">
								<p class="text-[10px] text-gray-400 mb-1">CVV</p>
								<p class="text-sm font-medium text-gray-800">•••</p>
							</div>
						</div>
					</div>
				</div>

				<button
					onclick={pay}
					class="flex w-full items-center justify-center gap-2 rounded-xl bg-[#21A038] py-4 text-base font-bold text-white transition-all hover:bg-[#1B8A30] active:scale-[0.98]"
				>
					Оплатить {order?.total ?? 0} ₽
				</button>

				<p class="text-center text-[10px] text-gray-400 mt-4">
					Это демо-версия. Никакие данные не передаются.
				</p>
			</div>
		{/if}
	</div>
</div>
