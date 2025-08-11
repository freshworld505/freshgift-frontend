"use client";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 backdrop-blur-lg bg-background/80 border-b border-border/40 shadow-lg shadow-black/5">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="hidden md:flex items-center justify-between h-20">
          <div>RoyalFresh Logo</div>
          <div>Navigation</div>
        </div>
      </div>
    </header>
  );
}
