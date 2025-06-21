import CartDisplay from "@/components/cart/CartDisplay";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-lime-50 dark:from-emerald-950 dark:via-background dark:to-lime-950">
      {/* Background decorations */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-200 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-lime-200 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">
            <span className="bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
              Shopping Cart
            </span>
          </h1>
          <p className="text-muted-foreground">Review your fresh selections</p>
        </div>
        <CartDisplay />
      </div>
    </div>
  );
}
