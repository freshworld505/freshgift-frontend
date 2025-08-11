"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistStore {
  wishlistItems: string[];
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
  getWishlistCount: () => number;
  // Add persist methods to interface
  _hasHydrated?: boolean;
  _setHasHydrated?: (state: boolean) => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      wishlistItems: [],
      _hasHydrated: false,
      
      addToWishlist: (productId: string) => {
        const { wishlistItems } = get();
        if (!wishlistItems.includes(productId)) {
          set({ wishlistItems: [...wishlistItems, productId] });
        }
      },
      
      removeFromWishlist: (productId: string) => {
        const { wishlistItems } = get();
        set({ wishlistItems: wishlistItems.filter(id => id !== productId) });
      },
      
      isInWishlist: (productId: string) => {
        const { wishlistItems } = get();
        return wishlistItems.includes(productId);
      },
      
      clearWishlist: () => {
        set({ wishlistItems: [] });
      },
      
      getWishlistCount: () => {
        const { wishlistItems } = get();
        return wishlistItems.length;
      },

      _setHasHydrated: (state: boolean) => {
        set({ _hasHydrated: state });
      },
    }),
    {
      name: "RoyalFresh-wishlist",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        state?._setHasHydrated?.(true);
      },
    }
  )
);
