import { writable, derived } from 'svelte/store';
import type { MenuItem } from '$lib/data/menu';

export interface CartItem {
	item: MenuItem;
	qty: number;
}

export interface Order {
	id: string;
	items: CartItem[];
	total: number;
	type: 'delivery' | 'pickup';
	status: 'pending' | 'preparing' | 'on_the_way' | 'ready' | 'completed';
	createdAt: number;
}

function createOrderStore() {
	const { subscribe, set, update } = writable<Order | null>(null);

	return {
		subscribe,
		create: (items: CartItem[], type: 'delivery' | 'pickup') => {
			const total = items.reduce((sum, { item, qty }) => sum + item.price * qty, 0);
			const order: Order = {
				id: `ORD-${Date.now().toString(36).toUpperCase()}`,
				items,
				total,
				type,
				status: 'pending',
				createdAt: Date.now()
			};
			set(order);
			return order;
		},
		updateStatus: (status: Order['status']) => {
			update((order) => {
				if (order) order.status = status;
				return order;
			});
		},
		complete: () => {
			update((order) => {
				if (order) order.status = 'completed';
				return order;
			});
		},
		clear: () => set(null)
	};
}

export const currentOrder = createOrderStore();

export const orderStatusText: Record<Order['status'], string> = {
	pending: 'Ожидает оплаты',
	preparing: 'Готовится',
	on_the_way: 'В пути',
	ready: 'Готов к выдаче',
	completed: 'Выполнен'
};

export const orderStatusIcon: Record<Order['status'], string> = {
	pending: 'ri-time-line',
	preparing: 'ri-fire-line',
	on_the_way: 'ri-e-bike-2-line',
	ready: 'ri-checkbox-circle-line',
	completed: 'ri-check-double-line'
};
