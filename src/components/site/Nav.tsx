import { Link } from "@tanstack/react-router";
import { Flame, User } from "lucide-react";
import { CartDrawer } from "@/components/site/CartDrawer";

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
          <Link
            to="/"
            activeOptions={{ exact: true }}
            activeProps={{ className: "text-primary" }}
            className="hover:text-primary transition-colors"
          >
            Home
          </Link>
          <Link
            to="/shop"
            activeProps={{ className: "text-primary" }}
            className="hover:text-primary transition-colors"
          >
            Shop
          </Link>
          <Link
            to="/profile"
            activeProps={{ className: "text-primary" }}
            className="hover:text-primary transition-colors"
          >
            Profile
          </Link>
        </nav>
        <div className="flex items-center gap-4 text-foreground/80">
          <Link to="/profile" aria-label="Profile" className="hover:text-primary transition-colors">
            <User className="h-5 w-5" />
          </Link>
          <CartDrawer />
        </div>
      </div>
    </header>
  );
}
