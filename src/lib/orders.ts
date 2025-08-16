
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
