/**
 * Sample data using the new Product schema
 * This demonstrates how products should be structured with the new schema
 */

import type { Product } from '@/lib/types';

// Sample products using new schema
export const newSchemaProducts: Product[] = [
  {
    id: '1',
    productCode: 'ORG-APL-001',
    productName: 'Organic Red Apples',
    productImages: [
      '/images/products/apples-1.jpg',
      '/images/products/apples-2.jpg',
      '/images/products/apples-3.jpg'
    ],
    description: 'Fresh, crispy organic red apples. Perfect for snacking or baking. Locally sourced from sustainable farms.',
    actualPrice: 5.99,
    discount: 10,
    finalPrice: 5.39,
    category: 'Fruits',
    subCategory: 'Apples',
    returnable: true,
    storageInstructions: 'Store in refrigerator for best freshness',
    rating: 4.5,
    isFeatured: true,
    isTrending: false,
    isNew: false,
    expiryDate: new Date('2025-06-15'),
    harvestDate: new Date('2025-05-20'),
    maxPurchaseLimit: 10,
    deliveryType: 'standard',
    createdAt: new Date('2025-05-01'),
    updatedAt: new Date('2025-05-30'),
    tags: ['organic', 'local', 'fresh', 'healthy'],
    shelfLife: 14,
    dataAiHint: 'Popular breakfast fruit, great with oatmeal and yogurt',
  },
  {
    id: '2',
    productCode: 'ORG-CAR-002',
    productName: 'Baby Carrots Bundle',
    productImages: [
      '/images/products/carrots-1.jpg',
      '/images/products/carrots-2.jpg'
    ],
    description: 'Sweet and tender baby carrots, perfect for snacking or cooking. Rich in vitamin A.',
    actualPrice: 3.49,
    finalPrice: 3.49,
    category: 'Vegetables',
    subCategory: 'Root Vegetables',
    returnable: true,
    storageInstructions: 'Keep refrigerated in plastic bag',
    rating: 4.2,
    isFeatured: false,
    isTrending: true,
    isNew: false,
    expiryDate: new Date('2025-06-10'),
    harvestDate: new Date('2025-05-25'),
    maxPurchaseLimit: 5,
    deliveryType: 'standard',
    createdAt: new Date('2025-05-01'),
    updatedAt: new Date('2025-05-30'),
    tags: ['organic', 'vitamin-a', 'healthy', 'snack'],
    shelfLife: 21,
    dataAiHint: 'Great for salads, soups, and healthy snacking',
  },
  {
    id: '3',
    productCode: 'ORG-BAN-003',
    productName: 'Premium Bananas',
    productImages: [
      '/images/products/bananas-1.jpg'
    ],
    description: 'Ripe, sweet bananas perfect for smoothies, baking, or eating fresh.',
    actualPrice: 2.99,
    discount: 5,
    finalPrice: 2.84,
    category: 'Fruits',
    subCategory: 'Tropical',
    returnable: false,
    storageInstructions: 'Store at room temperature, refrigerate when ripe',
    rating: 4.7,
    isFeatured: false,
    isTrending: false,
    isNew: true,
    expiryDate: new Date('2025-06-08'),
    harvestDate: new Date('2025-05-28'),
    maxPurchaseLimit: 15,
    deliveryType: 'express',
    createdAt: new Date('2025-05-28'),
    updatedAt: new Date('2025-05-30'),
    tags: ['potassium', 'energy', 'smoothie', 'baking'],
    shelfLife: 7,
    dataAiHint: 'Excellent source of potassium, great for smoothies and energy',
  }
];

// Export the new schema products directly
export default newSchemaProducts;
