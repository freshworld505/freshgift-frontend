import { ArrowRight, ShoppingBag, Star, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background with animated gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-white to-lime-50 dark:from-emerald-950 dark:via-background dark:to-lime-950" />

      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-20 w-32 h-32 bg-emerald-200 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-lime-200 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 w-24 h-24 bg-green-300 rounded-full blur-2xl animate-bounce" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium border border-emerald-200 dark:border-emerald-800">
            <Star className="h-4 w-4 fill-current" />
            Fresh • Organic • Delivered Daily
          </div>

          {/* Main heading */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
                Fresh Produce
              </span>
              <br />
              <span className="text-foreground">Delivered Fresh</span>
            </h1>

            <p className="text-xl sm:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Experience the finest selection of farm-fresh fruits and
              vegetables,
              <span className="text-emerald-600 font-semibold">
                {" "}
                delivered to your doorstep{" "}
              </span>
              within hours of harvest.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group"
              asChild
            >
              <Link href="/products">
                <ShoppingBag className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Shop Now
                <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold rounded-xl border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/50 transition-all duration-300"
              asChild
            >
              <Link href="/deals">
                <Zap className="h-5 w-5 mr-2" />
                View Deals
              </Link>
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-emerald-100 dark:border-emerald-800">
            <div className="space-y-1">
              <div className="text-3xl font-bold text-emerald-600">50K+</div>
              <div className="text-sm text-muted-foreground">
                Happy Customers
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-emerald-600">500+</div>
              <div className="text-sm text-muted-foreground">
                Fresh Products
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-emerald-600">24hr</div>
              <div className="text-sm text-muted-foreground">Delivery</div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-emerald-600">4.9★</div>
              <div className="text-sm text-muted-foreground">Rating</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
