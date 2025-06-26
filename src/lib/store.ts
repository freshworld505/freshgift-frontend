import { create } from 'zustand';
import type { Product, CartItem, User, Order, OrderStatus, CreateOrderRequest, UserCoupon, Coupon } from '@/lib/types';
import { toast } from '@/hooks/use-toast';
import { signOutUser, updateUserProfile as updateFirebaseProfile } from '@/lib/auth';
import { addToCart, getCart, updateCartItem, removeCartItem } from '@/api/cartApi';
import { getAllMyOrders, getOrderById, createOrder, cancelOrder, updateOrderDeliveryAddress } from '@/api/orderApi';
import { getAllCoupons, applyCoupon, redeemCoupon } from '@/api/couponApi';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemCount: () => number;
  lastAddedItem: Product | null;
  setLastAddedItem: (product: Product | null) => void;
  fetchCart: () => Promise<void>;
  isLoading: boolean;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  lastAddedItem: null,
  isLoading: false,
  
  fetchCart: async () => {
    try {
      set({ isLoading: true });
      const backendCartItems = await getCart();
      
      // Transform backend cart items to frontend CartItem format
      const transformedItems = backendCartItems
        .filter(item => item.product !== null) // Filter out items with null products
        .map(item => ({
          product: item.product!,
          quantity: item.quantity
        }));
      
      set({ items: transformedItems, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      set({ isLoading: false });
      // Don't show error toast for fetch failures, as user might not be logged in
    }
  },

  addItem: (product, quantity = 1) => {
    set((state) => {
      const existingItem = state.items.find(item => item.product.id === product.id);
      let newItems;
      if (existingItem) {
        newItems = state.items.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newItems = [...state.items, { product, quantity }];
      }
      toast({ title: `${product.productName} added to cart!`, description: `Quantity: ${quantity}` });
      return { items: newItems, lastAddedItem: product };
    });
  },

  removeItem: async (productId) => {
    try {
      // Optimistically update UI first
      const state = get();
      const itemToRemove = state.items.find(item => item.product.id === productId);
      if (itemToRemove) {
        set({ items: state.items.filter(item => item.product.id !== productId) });
        toast({ title: `${itemToRemove.product.productName} removed from cart.` });
        
        // Then update backend
        await removeCartItem(productId);
      }
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      // Revert optimistic update on error
      get().fetchCart();
      toast({ 
        title: "Error removing item", 
        description: "Failed to remove item from cart. Please try again.",
        variant: "destructive" 
      });
    }
  },

  updateQuantity: async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        return get().removeItem(productId);
      }

      // Optimistically update UI first
      const state = get();
      const itemToUpdate = state.items.find(item => item.product.id === productId);
      if (itemToUpdate) {
        set({
          items: state.items.map(item =>
            item.product.id === productId ? { ...item, quantity } : item
          )
        });
        //toast({ 
        //  title: `Updated ${itemToUpdate.product.productName} quantity.`, 
        //  description: `New quantity: ${quantity}` 
        //});
        
        // Then update backend
        await updateCartItem(productId, quantity);
      }
    } catch (error) {
      console.error('Failed to update cart item:', error);
      // Revert optimistic update on error
      get().fetchCart();
      toast({ 
        title: "Error updating quantity", 
        description: "Failed to update item quantity. Please try again.",
        variant: "destructive" 
      });
    }
  },
  clearCart: () => {
    set({ items: [], lastAddedItem: null });
    toast({ title: "Cart cleared." });
  },
  getCartTotal: () => {
    return get().items.reduce((total, item) => total + item.product.finalPrice * item.quantity, 0);
  },
  getItemCount: () => {
    return get().items.length;
  },
  setLastAddedItem: (product) => set({ lastAddedItem: product }),
}));

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  signup: (userData: User) => void;
  updateUserProfile: (updatedData: Partial<User>) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  login: (userData) => {
    set({ user: { ...userData, wishlist: userData.wishlist || [] }, isAuthenticated: true });
    toast({ title: `Welcome back, ${userData.name || userData.email}!`});
  },
  logout: async () => {
    try {
      await signOutUser();
      set({ user: null, isAuthenticated: false });
      //toast({ title: "You have been logged out."});
    } catch (error) {
      console.error('Error logging out:', error);
      toast({ 
        title: "Error logging out", 
        description: "Please try again.",
        variant: "destructive"
      });
    }
  },
  signup: (userData) => {
    set({ user: { ...userData, wishlist: userData.wishlist || [] }, isAuthenticated: true });
    toast({ title: `Account created for ${userData.email}! Welcome!`});
  },
  updateUserProfile: async (updatedData: Partial<User>) => {
    try {
      await updateFirebaseProfile(updatedData);
      set((state) => {
        if (!state.user) return {};
        const newUser = { ...state.user, ...updatedData };
        toast({ title: "Profile updated successfully!" });
        return { user: newUser };
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({ 
        title: "Error updating profile", 
        description: "Please try again.",
        variant: "destructive"
      });
    }
  },
  addToWishlist: (productId: string) => {
    set((state) => {
      if (!state.isAuthenticated || !state.user) {
        return {}; 
      }
      const currentWishlist = state.user.wishlist || [];
      if (currentWishlist.includes(productId)) {
        return {}; // Already in wishlist
      }
      const updatedWishlist = [...currentWishlist, productId];
      const updatedUser = { ...state.user, wishlist: updatedWishlist };
      
      // Update Firebase
      updateFirebaseProfile({ wishlist: updatedWishlist }).catch(console.error);
      
      return { user: updatedUser };
    });
  },
  removeFromWishlist: (productId: string) => {
    set((state) => {
      if (!state.isAuthenticated || !state.user || !state.user.wishlist) {
        return {};
      }
      const updatedWishlist = state.user.wishlist.filter(id => id !== productId);
      const updatedUser = { ...state.user, wishlist: updatedWishlist };
      
      // Update Firebase
      updateFirebaseProfile({ wishlist: updatedWishlist }).catch(console.error);
      
      return { user: updatedUser };
    });
  },
}));

// Store for Order Management
interface OrderState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  fetchOrders: () => Promise<void>;
  fetchOrderById: (orderId: string) => Promise<Order | null>;
  createOrder: (orderData: CreateOrderRequest) => Promise<Order>;
  cancelOrder: (orderId: string) => Promise<Order>;
  updateOrderDeliveryAddress: (orderId: string, deliveryAddress: string) => Promise<Order>;
  setCurrentOrder: (order: Order | null) => void;
  clearError: () => void;
  clearOrders: () => void;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getTotalOrderValue: () => number;
  getRecentOrders: (limit?: number) => Order[];
}

export const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    try {
      set({ isLoading: true, error: null });
      const orders = await getAllMyOrders();
      set({ orders, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch orders:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch orders',
        isLoading: false 
      });
      toast({
        title: "Error fetching orders",
        description: "Failed to load your orders. Please try again.",
        variant: "destructive"
      });
    }
  },

  fetchOrderById: async (orderId: string) => {
    try {
      set({ isLoading: true, error: null });
      const order = await getOrderById(orderId);
      set({ currentOrder: order, isLoading: false });
      return order;
    } catch (error) {
      console.error(`Failed to fetch order ${orderId}:`, error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch order',
        isLoading: false 
      });
      toast({
        title: "Error fetching order",
        description: "Failed to load order details. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  },

  createOrder: async (orderData: CreateOrderRequest) => {
    try {
      set({ isLoading: true, error: null });
      const newOrder = await createOrder(orderData);
      
      // Add the new order to the beginning of the orders list
      set((state) => ({
        orders: [newOrder, ...state.orders],
        currentOrder: newOrder,
        isLoading: false
      }));

      toast({
        title: "Order placed successfully!",
        description: `Order #${newOrder.orderId.slice(-8)} has been created.`
      });

      return newOrder;
    } catch (error) {
      console.error('Failed to create order:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to create order',
        isLoading: false 
      });
      toast({
        title: "Error placing order",
        description: "Failed to place your order. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  },

  cancelOrder: async (orderId: string) => {
    try {
      set({ isLoading: true, error: null });
      const cancelledOrder = await cancelOrder(orderId);
      
      // Update the order in the orders list
      set((state) => ({
        orders: state.orders.map(order => 
          order.orderId === orderId ? cancelledOrder : order
        ),
        currentOrder: state.currentOrder?.orderId === orderId ? cancelledOrder : state.currentOrder,
        isLoading: false
      }));
      
      toast({
        title: "Order cancelled successfully",
        description: `Order #${orderId.slice(-8)} has been cancelled.`
      });
      
      return cancelledOrder;
    } catch (error) {
      console.error('Failed to cancel order:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to cancel order',
        isLoading: false 
      });
      toast({
        title: "Error cancelling order",
        description: "Failed to cancel your order. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  },

  updateOrderDeliveryAddress: async (orderId: string, deliveryAddress: string) => {
    try {
      set({ isLoading: true, error: null });
      const updatedOrder = await updateOrderDeliveryAddress(orderId, deliveryAddress);
      
      // Update the order in the orders list
      set((state) => ({
        orders: state.orders.map(order => 
          order.orderId === orderId ? updatedOrder : order
        ),
        currentOrder: state.currentOrder?.orderId === orderId ? updatedOrder : state.currentOrder,
        isLoading: false
      }));
      
      toast({
        title: "Delivery address updated",
        description: "Your order delivery address has been updated successfully."
      });
      
      return updatedOrder;
    } catch (error) {
      console.error('Failed to update delivery address:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to update delivery address',
        isLoading: false 
      });
      toast({
        title: "Error updating delivery address",
        description: "Failed to update the delivery address. Please try again.",
        variant: "destructive"
      });
      throw error;
    }
  },

  setCurrentOrder: (order: Order | null) => {
    set({ currentOrder: order });
  },

  clearError: () => {
    set({ error: null });
  },

  clearOrders: () => {
    set({ orders: [], currentOrder: null, error: null });
  },

  getOrdersByStatus: (status: OrderStatus) => {
    return get().orders.filter(order => order.orderStatus === status);
  },

  getTotalOrderValue: () => {
    return get().orders.reduce((total, order) => total + order.totalAmount, 0);
  },

  getRecentOrders: (limit: number = 5) => {
    return get().orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, limit);
  }
}));

// Store for Coupon Management
interface CouponState {
  coupons: UserCoupon[];
  appliedCoupon: UserCoupon | null;
  appliedDiscount: number;
  isLoading: boolean;
  error: string | null;
  fetchCoupons: () => Promise<void>;
  applyCouponToCart: (couponCode: string, cartTotal: number) => Promise<{ success: boolean; discountAmount?: number; newTotal?: number; message: string }>;
  redeemCouponCode: (couponCode: string) => Promise<{ success: boolean; message: string; userCoupon?: UserCoupon }>;
  removeCoupon: () => void;
  setAppliedCoupon: (coupon: UserCoupon | null) => void;
  setAppliedDiscount: (discount: number) => void;
  clearError: () => void;
  clearCoupons: () => void;
  getAvailableCoupons: () => UserCoupon[];
  getExpiredCoupons: () => UserCoupon[];
  getUsedCoupons: () => UserCoupon[];
  validateCoupon: (couponCode: string) => UserCoupon | null;
}

export const useCouponStore = create<CouponState>((set, get) => ({
  coupons: [],
  appliedCoupon: null,
  appliedDiscount: 0,
  isLoading: false,
  error: null,

  fetchCoupons: async () => {
    try {
      set({ isLoading: true, error: null });
      const coupons = await getAllCoupons();
      set({ coupons, isLoading: false });
    } catch (error) {
      console.error('Failed to fetch coupons:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to fetch coupons',
        isLoading: false 
      });
      toast({
        title: "Error fetching coupons",
        description: "Failed to load your coupons. Please try again.",
        variant: "destructive"
      });
    }
  },

  applyCouponToCart: async (couponCode: string, cartTotal: number) => {
    try {
      set({ isLoading: true, error: null });
      const result = await applyCoupon(couponCode, cartTotal);
      
      if (result.success) {
        // Find the coupon in our local state
        const coupon = get().coupons.find(c => c.coupon.code === couponCode);
        if (coupon) {
          set({ 
            appliedCoupon: coupon,
            appliedDiscount: result.discountAmount || 0,
            isLoading: false 
          });
        }
        
        toast({
          title: "Coupon applied successfully!",
          description: result.message
        });
      } else {
        set({ isLoading: false });
        toast({
          title: "Failed to apply coupon",
          description: result.message,
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error('Failed to apply coupon:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to apply coupon',
        isLoading: false 
      });
      toast({
        title: "Error applying coupon",
        description: "Failed to apply coupon. Please try again.",
        variant: "destructive"
      });
      return { success: false, message: "Failed to apply coupon" };
    }
  },

  redeemCouponCode: async (couponCode: string) => {
    try {
      set({ isLoading: true, error: null });
      const result = await redeemCoupon(couponCode);
      
      if (result.success && result.userCoupon) {
        // Add the new coupon to our local state
        set((state) => ({
          coupons: [...state.coupons, result.userCoupon!],
          isLoading: false
        }));
        
        toast({
          title: "Coupon redeemed successfully!",
          description: result.message
        });
      } else {
        set({ isLoading: false });
        toast({
          title: "Failed to redeem coupon",
          description: result.message,
          variant: "destructive"
        });
      }
      
      return result;
    } catch (error) {
      console.error('Failed to redeem coupon:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Failed to redeem coupon',
        isLoading: false 
      });
      toast({
        title: "Error redeeming coupon",
        description: "Failed to redeem coupon. Please try again.",
        variant: "destructive"
      });
      return { success: false, message: "Failed to redeem coupon" };
    }
  },

  removeCoupon: () => {
    set({ appliedCoupon: null, appliedDiscount: 0 });
    toast({
      title: "Coupon removed",
      description: "Coupon has been removed from your cart."
    });
  },

  setAppliedCoupon: (coupon: UserCoupon | null) => {
    set({ appliedCoupon: coupon });
  },

  setAppliedDiscount: (discount: number) => {
    set({ appliedDiscount: discount });
  },

  clearError: () => {
    set({ error: null });
  },

  clearCoupons: () => {
    set({ coupons: [], appliedCoupon: null, appliedDiscount: 0, error: null });
  },

  getAvailableCoupons: () => {
    const now = new Date();
    return get().coupons.filter(userCoupon => {
      const coupon = userCoupon.coupon;
      const expiryDate = new Date(coupon.expiryDate);
      return !userCoupon.isRedeemed && 
             coupon.status === 'active' && 
             expiryDate > now &&
             coupon.usedCount < coupon.usageLimitGlobal;
    });
  },

  getExpiredCoupons: () => {
    const now = new Date();
    return get().coupons.filter(userCoupon => {
      const expiryDate = new Date(userCoupon.coupon.expiryDate);
      return expiryDate <= now || userCoupon.coupon.status === 'expired';
    });
  },

  getUsedCoupons: () => {
    return get().coupons.filter(userCoupon => 
      userCoupon.isRedeemed || 
      userCoupon.coupon.usedCount >= userCoupon.coupon.usageLimitGlobal
    );
  },

  validateCoupon: (couponCode: string) => {
    const availableCoupons = get().getAvailableCoupons();
    return availableCoupons.find(userCoupon => userCoupon.coupon.code === couponCode) || null;
  }
}));
