import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Dumbbell, Flame, Leaf } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import whiteHero from "@/assets/gym-freak-white-model.asset.json";
import blackHero from "@/assets/gym-freak-black-model.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Yujin — Cozy apparel that ignites your style" },
      { name: "description", content: "Yujin is a cozy, aesthetic apparel brand. Shop the Summer Arc gym drop and elevate your everyday." },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden bg-[color:var(--cream-deep)]">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div className="space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <Flame className="h-3.5 w-3.5" /> Summer Arc Drop
            </span>
            <h1 className="font-display text-5xl leading-[1.05] text-primary md:text-7xl">
              Bring the ember<br />into your wardrobe.
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-foreground/80">
              Clothing that feels like a warm afternoon — soft on your skin, loud on
              your presence. Crafted slow, worn forever.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/products/gym-freak"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-12px_oklch(0.65_0.16_50/0.55)] transition-all hover:shadow-[0_14px_36px_-12px_oklch(0.65_0.16_50/0.65)] hover:-translate-y-0.5"
              >
                Shop the drop
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link to="/shop" className="text-sm font-medium text-foreground/70 underline-offset-4 hover:text-primary hover:underline">
                Browse everything
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-primary/5 blur-2xl" aria-hidden />
            <div className="relative grid grid-cols-2 gap-4">
              <img
                src={whiteHero.url}
                alt="Gym Freak white tee on model"
                className="aspect-[3/4] w-full rounded-2xl object-cover shadow-xl"
              />
              <img
                src={blackHero.url}
                alt="Gym Freak black tee on model"
                className="mt-12 aspect-[3/4] w-full rounded-2xl object-cover shadow-xl"
              />
            </div>
            {/* soft gym vector accents */}
            <Dumbbell className="absolute -left-6 top-8 h-10 w-10 -rotate-12 text-primary/40" strokeWidth={1.5} />
            <Dumbbell className="absolute -right-2 bottom-6 h-8 w-8 rotate-12 text-primary/30" strokeWidth={1.5} />
          </div>
        </div>
      </section>

      {/* Featured Drop */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-12 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Now Live</p>
            <h2 className="mt-3 font-display text-4xl text-foreground md:text-5xl">The Summer Arc Drop</h2>
            <p className="mt-3 max-w-xl text-foreground/70">
              Built for the early mornings, the heavy sets, and the long walks home.
              One graphic, two ways to wear it.
            </p>
          </div>
          <Link to="/products/gym-freak" className="hidden text-sm font-medium text-primary hover:underline md:inline">
            View product →
          </Link>
        </div>

        <Link to="/products/gym-freak" className="group grid gap-6 md:grid-cols-2">
          <div className="relative overflow-hidden rounded-3xl bg-[color:var(--cream-deep)] p-6">
            <img
              src={whiteHero.url}
              alt="Gym Freak white tee"
              className="aspect-square w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="mt-5 flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl">Gym Freak — Bone White</h3>
                <p className="text-sm text-muted-foreground">Oversized · 100% cotton</p>
              </div>
              <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-foreground/70">01</span>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-3xl bg-foreground/5 p-6">
            <img
              src={blackHero.url}
              alt="Gym Freak black tee"
              className="aspect-square w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-[1.02]"
            />
            <div className="mt-5 flex items-center justify-between">
              <div>
                <h3 className="font-display text-xl">Gym Freak — Midnight Black</h3>
                <p className="text-sm text-muted-foreground">Oversized · 100% cotton</p>
              </div>
              <span className="rounded-full bg-background px-3 py-1 text-xs font-medium text-foreground/70">02</span>
            </div>
          </div>
        </Link>
      </section>

      {/* Values */}
      <section className="border-t border-border/60 bg-secondary/30">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 py-20 md:grid-cols-3">
          {[
            { icon: Leaf, title: "Soft cotton, slow made", body: "Heavyweight cotton, washed for softness, built to age beautifully." },
            { icon: Dumbbell, title: "Designed for the grind", body: "Cuts that move with you — from heavy sets to lazy Sundays." },
            { icon: Flame, title: "Limited drops", body: "Small batches, intentional pieces. When it's gone, it's gone." },
          ].map((v) => (
            <div key={v.title} className="space-y-3">
              <v.icon className="h-7 w-7 text-primary" strokeWidth={1.6} />
              <h3 className="font-display text-xl">{v.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{v.body}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
