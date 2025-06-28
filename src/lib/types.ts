export type Product = {
  id: string;
  productCode: string;
  productName: string;
  productImages: string[];
  description?: string;
  actualPrice: number;
  discount?: number;
  finalPrice: number;
  category: string;
  subCategory?: string;
  returnable?: boolean;
  storageInstructions?: string;
  rating?: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  isNew?: boolean;
  expiryDate?: Date;
  harvestDate?: Date;
  stock?: number;
  maxPurchaseLimit?: number;
  deliveryType?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  shelfLife?: number;
  dataAiHint?: string; // Keep this for AI functionality
};


export const PRODUCT_CATEGORIES = [
  'Fruits',
  'Vegetables',
  'Beverages',
  'Bakery',
  'Dairy',
  'Snacks',
  'Frozen Foods',
  'Pantry',
  'Herbs'
];

export const PRODUCT_SUBCATEGORIES = [
  'Leafy Greens',
  'Root Vegetables',
  'Seasonal Picks',
  'Citrus Fruits',
  'Fresh Juices',
  'Organic Choices',
];

export const PRODUCT_TAGS = [
  'Fresh',
  'Organic',
  'Imported',
  'On Sale',
  'New Arrival',
  'Top Pick',
  'Instant Delivery',
];


export type CartItem = {
  product: Product;
  quantity: number;
};

export type User = {
  userId: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  profile?: string;
  landmark?: string;
  pincode?: string;
  city?: string;
  state?: string;
  country?: string;
  profilePicture?: string;
  role?: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  firebaseId: string;
  addresses?: Address[];
  wishlist?: string[];
};

export type Address = {
  id: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  landmark?: string; // Added from user schema
  isDefault?: boolean;
};

// Time slot for delivery scheduling
export type TimeSlot = {
  id: string;
  label: string;
  date: string;
};

// Role enum for better type safety
export type UserRole = 'user' | 'admin';

// Delivery type options
export type DeliveryType = 'standard' | 'express' | 'same-day' | 'scheduled';

// Product category helper type (extend as needed)
export type ProductCategory = 'vegetables' | 'fruits' | 'dairy' | 'grains' | 'meat' | 'seafood' | 'beverages' | 'snacks' | 'other';

// Order item interface
export type OrderItem = {
  id: string;
  orderId: string;
  productId: string;
  product?: Product; // Optional reference to the full product object
  productName: string;
  productImage: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
};

// Order status types
export type OrderStatus = 'Pending' | 'Processing' | 'Delivered' | 'Cancelled';
export type PaymentStatus = 'Pending' | 'Paid' | 'Failed';
export type PaymentMethod = 'Card' | 'Cash' | 'UPI' | 'Wallet';
export type OrderDeliveryType = 'Instant' | 'Scheduled' | 'Next Morning';

// Main Order interface
export type Order = {
  orderId: string;
  userId: string;
  user?: User; // Optional reference to the full user object
  totalAmount: number;
  discountAmount: number;
  couponCode: string;
  isPaid: boolean;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  transactionId: string;
  paymentMethod: PaymentMethod;
  orderStatus: OrderStatus;
  deliveryType: OrderDeliveryType;
  deliveryPartner: string;
  trackingNumber: string;
  deliveryAddress: string;
  scheduledTime: Date | null;
  orderNotes: string;
  userInstructions: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
};

// API response wrapper for orders
export type OrdersResponse = {
  orders: Order[];
};

// Create order request payload
export type CreateOrderRequest = {
  addressId: string; // Required - we always create/use saved addresses now
  deliveryType: OrderDeliveryType;
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  couponCode?: string;
  transactionId?: string;
  discountAmount?: number;
  scheduledTime?: Date | string;
  userInstructions?: string;
  orderNotes?: string;
};

// Coupon type
export type Coupon = {
  couponId: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  discountMaxLimit?: number;
  expiryDate: string;
  minimumOrderValue: number;
  applicableCategories: string[];
  status: 'active' | 'inactive' | 'expired';
  usageLimitPerUser: number;
  usageLimitGlobal: number;
  usedCount: number;
  createdAt: string;
  updatedAt: string;
};

// User-Coupon relationship type
export type UserCoupon = {
  id: string;
  userId: string;
  couponId: string;
  isRedeemed: boolean;
  issuedAt: string;
  redeemedAt: string | null;
  createdAt: string;
  updatedAt: string;
  coupon: Coupon;
};

// API response for coupons
export type CouponsResponse = {
  coupons: UserCoupon[];
};

// Database entity with timestamps
export type BaseEntity = {
  createdAt: Date;
  updatedAt: Date;
};

// Product creation/update payload (without generated fields)
export type CreateProductPayload = Omit<Product, 'id' | 'createdAt' | 'updatedAt' | 'rating'> & {
  rating?: number;
};

export type UpdateProductPayload = Partial<CreateProductPayload>;

// User creation payload (without generated fields)
export type CreateUserPayload = Omit<User, 'userId' | 'createdAt' | 'updatedAt' | 'id'> & {
  userId?: string;
};

export type UpdateUserPayload = Partial<Omit<CreateUserPayload, 'firebaseId' | 'email'>>;
