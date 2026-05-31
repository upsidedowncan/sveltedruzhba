export interface MenuItem {
	id: number;
	name: string;
	description: string;
	price: number;
	category: string;
	emoji: string;
	popular?: boolean;
	weight?: string;
	image?: string;
}

export interface Promo {
	id: number;
	title: string;
	subtitle: string;
	icon: string;
	gradient: string;
}

export const categories = [
	{ id: 'all', name: 'Все', icon: 'apps' },
	{ id: 'pizza', name: 'Пицца', icon: 'cake3' },
	{ id: 'drinks', name: 'Напитки', icon: 'cup' },
	{ id: 'snacks', name: 'Закуски', icon: 'restaurant' },
	{ id: 'sauces', name: 'Соусы', icon: 'drop' },
	{ id: 'desserts', name: 'Десерты', icon: 'cake2' }
];

export const promos: Promo[] = [
	{
		id: 1,
		title: '2 пиццы за 999₽',
		subtitle: 'Каждый день с 12:00 до 16:00',
		icon: 'fire',
		gradient: 'from-orange-500 to-red-500'
	},
	{
		id: 2,
		title: 'Бесплатная доставка',
		subtitle: 'При заказе от 1500₽',
		icon: 'bike',
		gradient: 'from-emerald-500 to-teal-500'
	},
	{
		id: 3,
		title: 'Скидка 20% новым',
		subtitle: 'На первый заказ через приложение',
		icon: 'gift',
		gradient: 'from-purple-500 to-pink-500'
	}
];

export const menuItems: MenuItem[] = [
	// Пицца
	{
		id: 1,
		name: 'Маргарита',
		description: 'Томатный соус, моцарелла, свежий базилик, оливковое масло',
		price: 449,
		category: 'pizza',
		emoji: '🍕',
		popular: true,
		weight: '450г',
		image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop'
	},
	{
		id: 2,
		name: 'Пепперони',
		description: 'Томатный соус, моцарелла, пепперони, чеснок',
		price: 549,
		category: 'pizza',
		emoji: '🍕',
		popular: true,
		weight: '480г',
		image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop'
	},
	{
		id: 3,
		name: 'Четыре сыра',
		description: 'Моцарелла, дор-блю, пармезан, чеддер, сливочный соус',
		price: 649,
		category: 'pizza',
		emoji: '🧀',
		popular: true,
		weight: '460г',
		image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop'
	},
	{
		id: 4,
		name: 'Дружба',
		description: 'Фирменная пицца: курица, бекон, шампиньоны, кукуруза, соус ранч',
		price: 699,
		category: 'pizza',
		emoji: '🍕',
		weight: '520г',
		image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=300&fit=crop'
	},
	{
		id: 5,
		name: 'Мясная',
		description: 'Пепперони, ветчина, бекон, курица, моцарелла, томатный соус',
		price: 699,
		category: 'pizza',
		emoji: '🥩',
		weight: '530г',
		image: 'https://images.unsplash.com/photo-1594007654729-407eedc4be65?w=400&h=300&fit=crop'
	},
	{
		id: 6,
		name: 'Грибная',
		description: 'Шампиньоны, лисички, моцарелла, трюфельное масло, сливочный соус',
		price: 599,
		category: 'pizza',
		emoji: '🍄',
		weight: '440г',
		image: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?w=400&h=300&fit=crop'
	},
	{
		id: 7,
		name: 'Морская',
		description: 'Креветки, кальмары, мидии, моцарелла, чесночный соус',
		price: 799,
		category: 'pizza',
		emoji: '🦐',
		weight: '470г',
		image: 'https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?w=400&h=300&fit=crop'
	},
	{
		id: 8,
		name: 'Вегетарианская',
		description: 'Перец, помидоры, оливки, кукуруза, грибы, моцарелла',
		price: 499,
		category: 'pizza',
		emoji: '🥬',
		weight: '430г',
		image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=400&h=300&fit=crop'
	},
	// Напитки
	{
		id: 9,
		name: 'Кола 0.5л',
		description: 'Coca-Cola Classic',
		price: 149,
		category: 'drinks',
		emoji: '🥤',
		weight: '500мл'
	},
	{
		id: 10,
		name: 'Свежий лимонад',
		description: 'Домашний лимонад с мятой и лаймом',
		price: 199,
		category: 'drinks',
		emoji: '🍋',
		weight: '400мл'
	},
	{
		id: 11,
		name: 'Морс клюквенный',
		description: 'Натуральный ягодный морс',
		price: 179,
		category: 'drinks',
		emoji: '🫐',
		weight: '500мл'
	},
	{
		id: 12,
		name: 'Апельсиновый сок',
		description: 'Свежевыжатый сок',
		price: 249,
		category: 'drinks',
		emoji: '🍊',
		weight: '300мл'
	},
	// Закуски
	{
		id: 13,
		name: 'Картофель фри',
		description: 'Хрустящий картофель с соусом на выбор',
		price: 249,
		category: 'snacks',
		emoji: '🍟',
		popular: true,
		weight: '200г'
	},
	{
		id: 14,
		name: 'Крылышки BBQ',
		description: 'Куриные крылышки в соусе барбекю, 6 штук',
		price: 399,
		category: 'snacks',
		emoji: '🍗',
		weight: '280г'
	},
	{
		id: 15,
		name: 'Наггетсы',
		description: 'Куриные наггетсы в хрустящей корочке, 8 штук',
		price: 299,
		category: 'snacks',
		emoji: '🍗',
		weight: '220г'
	},
	{
		id: 16,
		name: 'Хлебные палочки',
		description: 'С чесночным маслом и пармезаном, 6 штук',
		price: 199,
		category: 'snacks',
		emoji: '🥖',
		weight: '180г'
	},
	// Соусы
	{
		id: 17,
		name: 'Соус ранч',
		description: 'Сливочный соус с травами',
		price: 49,
		category: 'sauces',
		emoji: '🥛',
		weight: '50г'
	},
	{
		id: 18,
		name: 'Соус барбекю',
		description: 'Копчёный томатный соус',
		price: 49,
		category: 'sauces',
		emoji: '🔥',
		weight: '50г'
	},
	{
		id: 19,
		name: 'Чесночный соус',
		description: 'Сливочный чесночный соус',
		price: 49,
		category: 'sauces',
		emoji: '🧄',
		weight: '50г'
	},
	{
		id: 20,
		name: 'Сырный соус',
		description: 'Расплавленный чеддер',
		price: 69,
		category: 'sauces',
		emoji: '🧀',
		weight: '50г'
	},
	// Десерты
	{
		id: 21,
		name: 'Тирамису',
		description: 'Классический итальянский десерт с маскарпоне',
		price: 299,
		category: 'desserts',
		emoji: '🍰',
		popular: true,
		weight: '150г'
	},
	{
		id: 22,
		name: 'Чизкейк',
		description: 'Нью-Йорк чизкейк с ягодным соусом',
		price: 279,
		category: 'desserts',
		emoji: '🧁',
		weight: '140г'
	},
	{
		id: 23,
		name: 'Шоколадный фондан',
		description: 'Тёплый шоколадный кекс с жидкой начинкой',
		price: 329,
		category: 'desserts',
		emoji: '🍫',
		weight: '160г'
	},
	{
		id: 24,
		name: 'Мороженое',
		description: '3 шарика: ваниль, шоколад, клубника',
		price: 199,
		category: 'desserts',
		emoji: '🍨',
		weight: '180г'
	}
];
