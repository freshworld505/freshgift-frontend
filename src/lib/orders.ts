
import type { Order, Product } from '@/lib/types';

// Helper function to create a product from legacy data for orders
const createOrderProduct = (legacy: any): Product => {
  const now = new Date();
  
  return {
    id: legacy.id,
    productCode: legacy.id,
    productName: legacy.name,
    description: legacy.description || '',
    category: legacy.category,
    productImages: legacy.imageUrl ? [legacy.imageUrl] : [],
    actualPrice: legacy.price,
    finalPrice: legacy.price,
    discount: 0,
    subCategory: undefined,
    returnable: true,
    storageInstructions: undefined,
    rating: undefined,
    isFeatured: false,
    isTrending: false,
    isNew: false,
    expiryDate: undefined,
    harvestDate: undefined,
    maxPurchaseLimit: undefined,
    deliveryType: 'standard',
    tags: [],
    shelfLife: undefined,
    createdAt: now,
    updatedAt: now,
    dataAiHint: legacy.dataAiHint || ''
  } as Product;
};

export const mockOrders: Order[] = [
  {
    id: 'order123',
    items: [
      { product: createOrderProduct({ id: '1', name: 'Cox\'s Orange Pippin Apples', price: 3.50, category: 'Fruits', imageUrl: 'https://placehold.co/300x300/FF6347/FFFFFF.png', dataAiHint: 'apple fruit' }), quantity: 2 },
      { product: createOrderProduct({ id: '3', name: 'Forced Rhubarb', price: 4.20, category: 'Vegetables', imageUrl: 'https://placehold.co/300x300/FFC0CB/000000.png', dataAiHint: 'rhubarb vegetable' }), quantity: 1 },
      { product: createOrderProduct({ id: '4', name: 'Jersey Royal Potatoes', price: 3.75, category: 'Vegetables', imageUrl: 'https://placehold.co/300x300/F5DEB3/000000.png', dataAiHint: 'potato vegetable' }), quantity: 3 },
    ],
    totalAmount: (3.50 * 2) + (4.20 * 1) + (3.75 * 3),
    shippingAddress: { id: 'addr1', street: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '90210', country: 'USA', isDefault: true },
    deliveryTimeSlot: 'Today, 2:00 PM - 4:00 PM',
    orderDate: new Date(Date.now() - 86400000 * 2), // 2 days ago
    status: 'Delivered',
  },
  {
    id: 'order456',
    items: [
      { product: createOrderProduct({ id: '5', name: 'Purple Sprouting Broccoli', price: 2.80, category: 'Vegetables', imageUrl: 'https://placehold.co/300x300/4B0082/FFFFFF.png', dataAiHint: 'broccoli vegetable' }), quantity: 1 },
      { product: createOrderProduct({ id: '8', name: 'Kale', price: 1.90, category: 'Vegetables', imageUrl: 'https://placehold.co/300x300/2E8B57/FFFFFF.png', dataAiHint: 'kale greens' }), quantity: 2 },
    ],
    totalAmount: (2.80 * 1) + (1.90 * 2),
    shippingAddress: { id: 'addr2', street: '456 Oak Ave', city: 'Otherville', state: 'NY', zipCode: '10001', country: 'USA', isDefault: false },
    deliveryTimeSlot: 'Tomorrow, 10:00 AM - 12:00 PM',
    orderDate: new Date(Date.now() - 86400000), // 1 day ago
    status: 'Shipped',
  },
  {
    id: 'order789',
    items: [
      { product: createOrderProduct({ id: '12', name: 'English Strawberries', price: 4.50, category: 'Fruits', imageUrl: 'https://placehold.co/300x300/FF0000/FFFFFF.png', dataAiHint: 'strawberry fruit' }), quantity: 2 },
    ],
    totalAmount: 4.50 * 2,
    shippingAddress: { id: 'addr1', street: '123 Main St', city: 'Anytown', state: 'CA', zipCode: '90210', country: 'USA', isDefault: true },
    deliveryTimeSlot: 'Today, 6:00 PM - 8:00 PM',
    orderDate: new Date(),
    status: 'Processing',
  }
];
