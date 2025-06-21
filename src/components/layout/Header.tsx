"use client";

import Link from "next/link";
import AppLogo from "@/components/layout/AppLogo";
import CartIcon from "@/components/cart/CartIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/store";
import { UserCircle2, LogOut, LogIn, UserPlus, Search } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const getUserInitials = () => {
    if (user?.name) {
      return user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "VG";
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedSearchTerm = searchTerm.trim();
    if (trimmedSearchTerm) {
      router.push(`/search?q=${encodeURIComponent(trimmedSearchTerm)}`);
    }
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/40 shadow-lg shadow-black/5">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <AppLogo />

          {/* Desktop Search - Available to everyone */}
          <div className="hidden md:flex flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search fresh products..."
                  className="w-full pl-12 pr-4 h-12 bg-muted/30 border-border/50 rounded-full focus:bg-background focus:border-primary/50 transition-all duration-200 shadow-sm"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </form>
          </div>

          <nav className="flex items-center gap-2 lg:gap-4">
            {/* Products button - available to everyone */}
            <Button
              variant="ghost"
              asChild
              className="hidden sm:inline-flex h-10 px-4 rounded-full hover:bg-primary/10 transition-colors"
            >
              <Link href="/products" className="font-medium">
                Products
              </Link>
            </Button>

            {isAuthenticated && (
              <>
                <CartIcon />
              </>
            )}

            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-primary/20 transition-all"
                  >
                    <Avatar className="h-10 w-10 ring-2 ring-primary/20">
                      <AvatarImage
                        src={
                          user.profilePicture ||
                          `https://placehold.co/100x100.png?text=${getUserInitials()}`
                        }
                        alt={user.name || user.email}
                        data-ai-hint="profile avatar"
                      />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-64 bg-background/95 backdrop-blur-sm border-border/50 shadow-xl"
                  align="end"
                  forceMount
                >
                  <DropdownMenuLabel className="font-normal p-4">
                    <div className="flex flex-col space-y-2">
                      <p className="text-sm font-semibold leading-none">
                        {user.name || "FreshGift User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground/80">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator className="bg-border/50" />
                  <DropdownMenuItem asChild className="p-3 cursor-pointer">
                    <Link href="/account" className="flex items-center gap-3">
                      <UserCircle2 className="h-4 w-4 text-primary" />
                      <span className="font-medium">Account</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={logout}
                    className="p-3 cursor-pointer text-destructive hover:text-destructive-foreground hover:bg-destructive"
                  >
                    <LogOut className="mr-3 h-4 w-4" />
                    <span className="font-medium">Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden sm:flex items-center gap-2">
                <Button
                  variant="ghost"
                  asChild
                  className="h-10 px-4 rounded-full hover:bg-muted/50 transition-colors"
                >
                  <Link
                    href="/login"
                    className="flex items-center gap-2 font-medium"
                  >
                    <LogIn className="h-4 w-4" />
                    Login
                  </Link>
                </Button>
                <Button
                  asChild
                  className="h-10 px-6 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Link href="/signup" className="flex items-center gap-2">
                    <UserPlus className="h-4 w-4" />
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>

        {/* Mobile Search - Available to everyone */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearchSubmit} className="relative">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search fresh products..."
                className="w-full pl-12 pr-4 h-12 bg-muted/30 border-border/50 rounded-full focus:bg-background focus:border-primary/50 transition-all duration-200 shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Mobile Auth Buttons - Only show when not authenticated */}
        {!isAuthenticated && (
          <div className="sm:hidden pb-4">
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                asChild
                className="flex-1 h-10 rounded-full border-border/50 hover:bg-muted/50 transition-colors"
              >
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 font-medium"
                >
                  <LogIn className="h-4 w-4" />
                  Login
                </Link>
              </Button>
              <Button
                asChild
                className="flex-1 h-10 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Link
                  href="/signup"
                  className="flex items-center justify-center gap-2"
                >
                  <UserPlus className="h-4 w-4" />
                  Sign Up
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
