<script lang="ts">
	import type { Snippet } from 'svelte';
	import RiCloseLine from 'svelte-remixicon/RiCloseLine.svelte';

	let {
		open = $bindable(false),
		title,
		header,
		children,
		footer
	}: {
		open: boolean;
		title?: string;
		header?: Snippet<[{ close: () => void }]>;
		children: Snippet;
		footer?: Snippet;
	} = $props();

	let sheetH = $state(0);
	let offset = $state(0);
	let phase = $state<'closed' | 'opening' | 'open' | 'dragging' | 'closing'>('closed');

	let startY = 0;
	let lastY = 0;
	let lastTime = 0;
	let velSamples: { v: number; t: number }[] = [];

	function avgVel() {
		const now = performance.now();
		velSamples = velSamples.filter((s) => now - s.t < 100);
		return velSamples.length ? velSamples.reduce((a, s) => a + s.v, 0) / velSamples.length : 0;
	}

	$effect(() => {
		if (open && phase === 'closed') {
			phase = 'opening';
			offset = sheetH || window.innerHeight;
			requestAnimationFrame(() => {
				requestAnimationFrame(() => {
					offset = 0;
					setTimeout(() => { phase = 'open'; }, 350);
				});
			});
		}
	});

	function close() {
		phase = 'closing';
		offset = sheetH || window.innerHeight;
		setTimeout(() => {
			open = false;
			offset = 0;
			phase = 'closed';
		}, 300);
	}

	function onTouchStart(e: TouchEvent) {
		if (window.innerWidth >= 768) return;
		startY = e.touches[0].clientY;
		lastY = startY;
		lastTime = performance.now();
		velSamples = [];
		phase = 'dragging';
	}

	function onTouchMove(e: TouchEvent) {
		if (phase !== 'dragging') return;
		e.preventDefault();
		const y = e.touches[0].clientY;
		let delta = y - startY;
		if (delta < 0) delta = 0;
		const cap = sheetH * 0.8;
		offset = cap * (1 - Math.exp(-delta / cap));
		const now = performance.now();
		if (now - lastTime > 0) velSamples.push({ v: (y - lastY) / (now - lastTime), t: now });
		lastY = y;
		lastTime = now;
	}

	function onTouchEnd() {
		if (phase !== 'dragging') return;
		if (offset / sheetH > 0.3 || avgVel() > 0.3) {
			close();
		} else {
			phase = 'open';
			offset = 0;
		}
	}

	// Use addEventListener with passive: false so preventDefault works
	function handleTouch(node: HTMLElement) {
		node.addEventListener('touchstart', onTouchStart, { passive: true });
		node.addEventListener('touchmove', onTouchMove, { passive: false });
		node.addEventListener('touchend', onTouchEnd, { passive: true });
		node.addEventListener('touchcancel', onTouchEnd, { passive: true });
		return {
			destroy() {
				node.removeEventListener('touchstart', onTouchStart);
				node.removeEventListener('touchmove', onTouchMove);
				node.removeEventListener('touchend', onTouchEnd);
				node.removeEventListener('touchcancel', onTouchEnd);
			}
		};
	}

	function measure(node: HTMLElement) {
		sheetH = node.offsetHeight;
		const ro = new ResizeObserver(() => { sheetH = node.offsetHeight; });
		ro.observe(node);
		return { destroy() { ro.disconnect(); } };
	}
</script>

{#if phase !== 'closed'}
	<div class="fixed inset-0 z-50">
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<!-- svelte-ignore a11y_no_static_element_interactions -->
		<div
			class="absolute inset-0 bg-black/40"
			style="opacity: {phase === 'dragging' ? Math.max(0.1, 1 - offset / (sheetH || 400)) : phase === 'open' ? 1 : 0}; transition: {phase === 'dragging' ? 'none' : 'opacity 0.25s ease-out'};"
			onclick={close}
		></div>

		<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
		<div
			use:measure
			class="absolute bottom-0 left-0 right-0 md:left-auto md:right-0 md:top-0 md:bottom-0 md:w-[380px] max-h-[85vh] md:max-h-none rounded-t-2xl md:rounded-none bg-[#FFF8F0] flex flex-col"
			style="will-change: transform; box-shadow: 0 -4px 24px rgba(60, 21, 24, 0.1); transform: translateY({offset}px); transition: {phase === 'dragging' ? 'none' : 'transform 0.35s cubic-bezier(0.32, 0.72, 0, 1)'};"
		>
			<!-- Drag handle -->
			<div use:handleTouch class="shrink-0" style="touch-action: none;">
				<div class="flex justify-center pt-3 pb-2 md:hidden cursor-grab active:cursor-grabbing">
					<div class="h-1 w-10 rounded-full bg-[#D5BFAA]"></div>
				</div>

				<!-- Header -->
				{#if header}
					{@render header(close)}
				{:else if title}
					<div class="flex items-center justify-between px-5 pb-3 pt-0">
						<h2 class="text-lg font-bold text-[#3C1518]">{title}</h2>
						<button
							onclick={close}
							class="flex h-8 w-8 items-center justify-center rounded-full text-[#6B705C] transition-colors hover:bg-[#D5BFAA]/20 hover:text-[#3C1518]"
						>
							<RiCloseLine size="20px" />
						</button>
					</div>
					<div class="h-px bg-[#D5BFAA]/30"></div>
				{/if}
			</div>

			<!-- Content -->
			<div class="flex-1 overflow-y-auto overscroll-contain min-h-0">
				{@render children()}
			</div>

			<!-- Footer -->
			{#if footer}
				<div class="border-t border-[#D5BFAA]/30 p-4 shrink-0 pb-[max(1rem,env(safe-area-inset-bottom))]">
					{@render footer()}
				</div>
			{/if}
		</div>
	</div>
{/if}
