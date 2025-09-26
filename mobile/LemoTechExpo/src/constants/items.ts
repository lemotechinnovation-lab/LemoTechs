export interface CleaningItem {
  id: string;
  name: string;
  category: string;
  price: number;
  icon: string;
  popular?: boolean;
}

export const ITEM_CATALOG: CleaningItem[] = [
  { id: 'sneakers', name: 'Sneakers', category: 'Footwear', price: 25, icon: '👟', popular: true },
  { id: 'casual-shoes', name: 'Casual Shoes', category: 'Footwear', price: 20, icon: '👞', popular: true },
  { id: 'suits', name: 'Suits', category: 'Clothing', price: 35, icon: '🤵' },
  { id: 'shirts', name: 'Shirts', category: 'Clothing', price: 15, icon: '👔' },
  { id: 'dresses', name: 'Dresses', category: 'Clothing', price: 30, icon: '👗' },
  { id: 'jeans', name: 'Jeans', category: 'Clothing', price: 18, icon: '👖' },
  { id: 'bedding', name: 'Bedding', category: 'Home', price: 45, icon: '🛏️' },
  { id: 'curtains', name: 'Curtains', category: 'Home', price: 40, icon: '🪟' },
  { id: 'other', name: 'Other', category: 'Miscellaneous', price: 25, icon: '📦' }
];


