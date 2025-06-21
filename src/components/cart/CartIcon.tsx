"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/lib/store";
import { useEffect, useState } from "react";

export default function CartIcon() {
  const { getItemCount } = useCartStore();
  const [count, setCount] = useState(0);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // Subscribe to cart changes to update count
    const unsubscribe = useCartStore.subscribe((state) =>
      setCount(state.getItemCount())
    );
    // Initial count
    setCount(getItemCount());
    return () => unsubscribe();
  }, [getItemCount]);

  if (!isClient) {
    // Render a placeholder or nothing on the server to avoid hydration mismatch
    return (
      <Button
        variant="ghost"
        size="icon"
        asChild
        aria-label="Shopping cart"
        className="h-10 w-10 rounded-full hover:bg-primary/10 transition-colors"
      >
        <Link href="/cart">
          <ShoppingCart className="h-5 w-5" />
        </Link>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      asChild
      className="relative h-10 w-10 rounded-full hover:bg-primary/10 transition-all duration-200 hover:scale-105"
      aria-label={`Shopping cart with ${count} items`}
    >
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {count > 0 && (
          <span className="absolute -top-1 -right-1 bg-gradient-to-r from-accent to-accent/80 text-accent-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center shadow-lg ring-2 ring-background animate-pulse">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </Link>
    </Button>
  );
}
