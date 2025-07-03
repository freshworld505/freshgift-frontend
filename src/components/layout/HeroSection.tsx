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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 md:py-20 lg:py-28">
        <div className="text-center space-y-4 sm:space-y-6 md:space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-1 sm:gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full text-[10px] sm:text-xs md:text-sm font-medium border border-emerald-200 dark:border-emerald-800">
            <Star className="h-2.5 w-2.5 sm:h-3 sm:w-3 md:h-4 md:w-4 fill-current" />
            Fresh • Organic • Delivered Daily
          </div>

          {/* Main heading */}
          <div className="space-y-2 sm:space-y-3 md:space-y-4">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold tracking-tight">
              <span className="bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
                Fresh Produce
              </span>
              <br />
              <span className="text-foreground">Delivered Fresh</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2 sm:px-4 md:px-0">
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
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 md:gap-4 justify-center items-center pt-2 sm:pt-3 md:pt-4">
            <Button
              size="lg"
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 group w-full sm:w-auto"
              asChild
            >
              <Link href="/products">
                <ShoppingBag className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2 group-hover:scale-110 transition-transform" />
                Shop Now
                <ArrowRight className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 ml-1 sm:ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>

            <Button
              variant="outline"
              size="lg"
              className="px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 text-sm sm:text-base md:text-lg font-semibold rounded-lg sm:rounded-xl border-2 border-emerald-200 hover:border-emerald-300 hover:bg-emerald-50 dark:border-emerald-800 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/50 transition-all duration-300 w-full sm:w-auto"
              asChild
            >
              <Link href="/products">
                <Zap className="h-3 w-3 sm:h-4 sm:w-4 md:h-5 md:w-5 mr-1 sm:mr-2" />
                View Deals
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
