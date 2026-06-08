import { Flame } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-32 border-t border-border/60 bg-secondary/40">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <Flame className="h-6 w-6 text-primary" strokeWidth={2.2} />
              <span className="font-display text-2xl font-semibold tracking-tight text-primary">
                YUJIN
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              Create. Inspire. Elevate. Cozy, considered apparel for the days you
              want to feel like the warmest version of yourself.
            </p>
          </div>
          <div>
            <h4 className="font-display text-base">Shop</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>Summer Arc</li>
              <li>New Arrivals</li>
              <li>All Products</li>
            </ul>
          </div>
          <div>
            <h4 className="font-display text-base">Company</h4>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              <li>About</li>
              <li>Contact</li>
              <li>Shipping & Returns</li>
            </ul>
          </div>
        </div>
        <p className="mt-12 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Yujin. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
