import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Leaf,
  Truck,
  Smile,
  ShoppingBasket,
  CheckCircle,
  Sparkles,
} from "lucide-react";

const whyChooseUsItems = [
  {
    icon: <Leaf className="h-12 w-12 text-emerald-600" />,
    title: "Farm Fresh Quality",
    description:
      "We source the freshest produce directly from local farms, ensuring top quality and taste.",
    highlight: "Direct from farm",
    color: "emerald",
  },
  {
    icon: <Truck className="h-12 w-12 text-blue-600" />,
    title: "Speedy Delivery",
    description:
      "Get your groceries delivered to your doorstep quickly and reliably within 24 hours.",
    highlight: "24hr delivery",
    color: "blue",
  },
  {
    icon: <ShoppingBasket className="h-12 w-12 text-purple-600" />,
    title: "Wide Selection",
    description:
      "Explore a diverse range of fruits, vegetables, and seasonal specialties all year round.",
    highlight: "500+ products",
    color: "purple",
  },
  {
    icon: <Smile className="h-12 w-12 text-orange-600" />,
    title: "Loved by Customers",
    description:
      "Join all happy customers enjoying fresh produce every day with a 4.9★ rating.",
    highlight: "4.9★ rating",
    color: "orange",
  },
];

const getColorClasses = (color: string) => {
  const colorMap = {
    emerald: {
      bg: "from-emerald-50 to-emerald-100 dark:from-emerald-950/50 dark:to-emerald-900/30",
      border: "border-emerald-200 dark:border-emerald-800",
      badge:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
      shadow: "shadow-emerald-100 dark:shadow-emerald-900/20",
    },
    blue: {
      bg: "from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/30",
      border: "border-blue-200 dark:border-blue-800",
      badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      shadow: "shadow-blue-100 dark:shadow-blue-900/20",
    },
    purple: {
      bg: "from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/30",
      border: "border-purple-200 dark:border-purple-800",
      badge:
        "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      shadow: "shadow-purple-100 dark:shadow-purple-900/20",
    },
    orange: {
      bg: "from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/30",
      border: "border-orange-200 dark:border-orange-800",
      badge:
        "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      shadow: "shadow-orange-100 dark:shadow-orange-900/20",
    },
  };
  return colorMap[color as keyof typeof colorMap] || colorMap.emerald;
};

export default function WhyChooseUsSection() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/50 via-white to-emerald-50/30 dark:from-slate-900/50 dark:via-background dark:to-emerald-950/30" />

      {/* Floating elements */}
      <div className="absolute top-10 left-10 w-20 h-20 bg-emerald-200/30 rounded-full blur-xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-32 h-32 bg-blue-200/20 rounded-full blur-2xl animate-pulse delay-1000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-medium border border-emerald-200 dark:border-emerald-800 mb-6">
            <Sparkles className="h-4 w-4" />
            Why Choose FreshGift?
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-6">
            <span className="bg-gradient-to-r from-emerald-600 to-lime-600 bg-clip-text text-transparent">
              The FreshGift
            </span>
            <br />
            <span className="text-foreground">Difference</span>
          </h2>

          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Experience the freshest produce with unmatched quality, speed, and
            service that keeps our customers coming back.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {whyChooseUsItems.map((item, index) => {
            const colors = getColorClasses(item.color);

            return (
              <Card
                key={index}
                className={`relative group text-center border-2 ${colors.border} bg-gradient-to-br ${colors.bg} hover:shadow-2xl ${colors.shadow} transition-all duration-500 hover:scale-105 hover:-translate-y-2 overflow-hidden`}
              >
                {/* Animated background on hover */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <CardHeader className="relative items-center pb-4 pt-8">
                  {/* Icon container with animation */}
                  <div className="relative mb-4 group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute inset-0 bg-white dark:bg-background rounded-2xl shadow-lg" />
                    <div className="relative p-4 bg-white dark:bg-background rounded-2xl shadow-lg">
                      {item.icon}
                    </div>
                  </div>

                  <CardTitle className="text-xl font-bold text-foreground group-hover:text-emerald-700 dark:group-hover:text-emerald-300 transition-colors">
                    {item.title}
                  </CardTitle>

                  {/* Highlight badge */}
                  <div
                    className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${colors.badge} mt-2`}
                  >
                    <CheckCircle className="h-3 w-3" />
                    {item.highlight}
                  </div>
                </CardHeader>

                <CardContent className="relative pb-8">
                  <p className="text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </CardContent>

                {/* Bottom accent line */}
                <div
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-emerald-500 to-lime-500 group-hover:w-full transition-all duration-500`}
                />
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle className="h-4 w-4 text-emerald-600" />
            Join all happy customers today!
          </div>
        </div>
      </div>
    </section>
  );
}
