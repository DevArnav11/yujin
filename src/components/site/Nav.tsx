import { Link } from "@tanstack/react-router";
import { Search, ShoppingBag, Flame } from "lucide-react";

export function Nav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <Link to="/" className="flex items-center gap-2">
          <Flame className="h-6 w-6 text-primary" strokeWidth={2.2} />
          <span className="font-display text-2xl font-semibold tracking-tight text-primary">
            YUJIN
          </span>
        </Link>
        <nav className="hidden items-center gap-10 text-sm font-medium text-foreground/80 md:flex">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <Link to="/products/gym-freak" className="hover:text-primary transition-colors">Summer Arc</Link>
          <Link to="/about" className="hover:text-primary transition-colors">About</Link>
        </nav>
        <div className="flex items-center gap-4 text-foreground/80">
          <button aria-label="Search" className="hover:text-primary transition-colors">
            <Search className="h-5 w-5" />
          </button>
          <button aria-label="Cart" className="hover:text-primary transition-colors">
            <ShoppingBag className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
