import {
  Leaf,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  Truck,
  Shield,
  Clock,
  CreditCard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  const quickLinks = [
    { name: "About Us", href: "/about" },
    { name: "Products", href: "/products" },
    { name: "Contact", href: "/contact" },
    { name: "Help Center", href: "/help" },
  ];

  const categories = [
    { name: "Fresh Fruits", href: "/categories/fresh-fruits" },
    { name: "Vegetables", href: "/products?category=vegetables" },
    { name: "Organic Produce", href: "/categories/organic" },
    { name: "Seasonal Items", href: "/categories/seasonal" },
  ];

  const features = [
    { icon: <Truck className="h-5 w-5" />, text: "Free delivery over $50" },
    { icon: <Shield className="h-5 w-5" />, text: "100% Fresh guarantee" },
    { icon: <Clock className="h-5 w-5" />, text: "24/7 customer support" },
    { icon: <CreditCard className="h-5 w-5" />, text: "Secure payments" },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-emerald-950 via-slate-900 to-emerald-900 text-white overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-40 h-40 bg-emerald-400 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-lime-400 rounded-full blur-3xl" />
      </div>

      <div className="relative">
        {/* Main footer content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="p-2 bg-emerald-600 rounded-lg">
                  <Leaf className="h-8 w-8 text-white" />
                </div>
                <span className="text-2xl font-bold">FreshGift</span>
              </div>

              <p className="text-emerald-100 mb-6 leading-relaxed">
                Your trusted partner for farm-fresh produce delivered straight
                to your door. Experience the difference quality makes.
              </p>

              {/* Contact Info */}
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-emerald-200">
                  <Phone className="h-4 w-4" />
                  <span className="text-sm">+1 (555) 123-4567</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-200">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">hello@FreshGift.com</span>
                </div>
                <div className="flex items-center gap-3 text-emerald-200">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">
                    123 Fresh Market St, Green Valley
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.href}
                      className="text-emerald-200 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Categories */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">
                Categories
              </h3>
              <ul className="space-y-3">
                {categories.map((category, index) => (
                  <li key={index}>
                    <a
                      href={category.href}
                      className="text-emerald-200 hover:text-white transition-colors text-sm flex items-center gap-2 group"
                    >
                      <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      {category.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-lg font-semibold mb-6 text-white">
                Stay Fresh
              </h3>
              <p className="text-emerald-200 text-sm mb-4">
                Subscribe to get special offers, free giveaways, and updates on
                the freshest produce.
              </p>

              <div className="flex gap-2 mb-6">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="bg-emerald-800/30 border-emerald-700 text-white placeholder:text-emerald-300 focus:border-emerald-500"
                />
                <Button
                  size="sm"
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-4"
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>

              {/* Features */}
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 text-emerald-200"
                  >
                    <div className="text-emerald-400">{feature.icon}</div>
                    <span className="text-xs">{feature.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <Separator className="my-8 bg-emerald-800" />

          {/* Bottom section */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-emerald-200 text-sm">
              &copy; {new Date().getFullYear()} FreshGift. All rights reserved.
            </div>

            <div className="flex flex-wrap gap-6 text-xs text-emerald-300">
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="/cookies" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
