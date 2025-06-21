import { Leaf } from "lucide-react";
import Link from "next/link";

export default function AppLogo() {
  return (
    <Link
      href="/"
      className="flex items-center gap-3 group transition-all duration-200 hover:scale-105"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 rounded-full blur-lg group-hover:blur-xl transition-all duration-200"></div>
        <div className="relative bg-gradient-to-br from-primary to-primary/80 p-2 rounded-xl shadow-lg">
          <Leaf size={28} className="text-primary-foreground" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          FreshGift
        </span>
        <span className="text-xs text-muted-foreground font-medium -mt-1 hidden sm:block">
          Fresh & Organic
        </span>
      </div>
    </Link>
  );
}
