import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Dumbbell, Flame, Minus, Plus, ShoppingBag, Truck, RotateCcw } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import whiteFlat from "@/assets/gym-freak-white-flat.asset.json";
import whiteModel from "@/assets/gym-freak-white-model.asset.json";
import whiteHanger from "@/assets/gym-freak-white-hanger.asset.json";
import blackFlat from "@/assets/gym-freak-black-flat.asset.json";
import blackModel from "@/assets/gym-freak-black-model.asset.json";

export const Route = createFileRoute("/products/gym-freak")({
  head: () => ({
    meta: [
      { title: "Gym Freak Oversized Tee — Yujin Summer Arc" },
      { name: "description", content: "The Gym Freak oversized tee from Yujin's Summer Arc drop. Heavyweight cotton, two colorways." },
      { property: "og:title", content: "Gym Freak Oversized Tee — Yujin" },
      { property: "og:image", content: blackModel.url },
    ],
  }),
  component: GymFreakProduct,
});

const variants = {
  white: {
    label: "Bone White",
    swatch: "oklch(0.97 0.01 80)",
    border: "oklch(0.85 0.03 70)",
    gallery: [whiteFlat.url, whiteModel.url, whiteHanger.url],
  },
  black: {
    label: "Midnight Black",
    swatch: "oklch(0.22 0.01 40)",
    border: "oklch(0.22 0.01 40)",
    gallery: [blackFlat.url, blackModel.url],
  },
} as const;

type Color = keyof typeof variants;
const sizes = ["S", "M", "L", "XL", "XXL"];

function GymFreakProduct() {
  const [color, setColor] = useState<Color>("white");
  const [size, setSize] = useState("M");
  const [qty, setQty] = useState(1);
  const [active, setActive] = useState(0);

  const v = variants[color];
  const gallery = v.gallery;
  const main = gallery[Math.min(active, gallery.length - 1)];

  return (
    <div className="min-h-screen bg-background">
      <Nav />

      <div className="mx-auto max-w-7xl px-6 py-10">
        <nav className="mb-8 text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Shop / Summer Arc / <span className="text-primary">Gym Freak</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-3xl bg-[color:var(--cream-deep)]">
              <Dumbbell className="absolute left-6 top-6 h-8 w-8 -rotate-12 text-primary/30" strokeWidth={1.5} />
              <Dumbbell className="absolute bottom-6 right-6 h-10 w-10 rotate-12 text-primary/25" strokeWidth={1.5} />
              <Flame className="absolute right-8 top-8 h-6 w-6 text-primary/30" strokeWidth={1.6} />
              <img
                src={main}
                alt={`Gym Freak ${v.label}`}
                className="aspect-square w-full object-contain p-6 md:p-12"
              />
            </div>
            <div className="grid grid-cols-4 gap-3">
              {gallery.map((src, i) => (
                <button
                  key={src}
                  onClick={() => setActive(i)}
                  className={`overflow-hidden rounded-xl border-2 bg-[color:var(--cream-deep)] transition ${
                    i === active ? "border-primary" : "border-transparent hover:border-border"
                  }`}
                >
                  <img src={src} alt="" className="aspect-square w-full object-contain p-2" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <Flame className="h-3.5 w-3.5" /> Summer Arc Drop
            </span>
            <h1 className="mt-5 font-display text-4xl leading-tight text-foreground md:text-5xl">
              Gym Freak Oversized Tee
            </h1>
            <p className="mt-3 text-foreground/70">
              A heavyweight oversized tee built for the grind and the chill after.
              Soft hand-feel, structured drop-shoulder, and our signature Gym Freak
              graphic — printed to last drop after drop.
            </p>

            <div className="mt-6 flex items-baseline gap-3">
              <span className="font-display text-3xl text-primary">₹1,299</span>
              <span className="text-sm text-muted-foreground line-through">₹1,799</span>
              <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                Launch price
              </span>
            </div>

            {/* Color */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Color · <span className="text-muted-foreground">{v.label}</span></p>
              </div>
              <div className="mt-3 flex gap-3">
                {(Object.keys(variants) as Color[]).map((key) => (
                  <button
                    key={key}
                    onClick={() => { setColor(key); setActive(0); }}
                    aria-label={variants[key].label}
                    className={`h-11 w-11 rounded-full border-2 transition ${
                      color === key ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : ""
                    }`}
                    style={{ background: variants[key].swatch, borderColor: variants[key].border }}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mt-8">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium">Size</p>
                <button className="text-xs text-muted-foreground underline-offset-4 hover:underline">Size guide</button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`h-11 min-w-[3rem] rounded-full border px-4 text-sm font-medium transition ${
                      size === s
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-foreground hover:border-primary/50"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Qty + CTA */}
            <div className="mt-8 flex flex-wrap items-stretch gap-3">
              <div className="flex items-center rounded-full border border-border bg-background">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-12 w-12 place-items-center text-foreground/70 hover:text-primary"
                  aria-label="Decrease"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-medium">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-12 w-12 place-items-center text-foreground/70 hover:text-primary"
                  aria-label="Increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-12px_oklch(0.65_0.16_50/0.55)] transition-all hover:-translate-y-0.5">
                <ShoppingBag className="h-4 w-4" /> Add to bag
              </button>
            </div>
            <button className="mt-3 w-full rounded-full border border-foreground/80 bg-background px-7 py-3.5 text-sm font-medium text-foreground transition hover:bg-foreground hover:text-background">
              Buy it now
            </button>

            {/* Perks */}
            <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-5 text-sm">
              <div className="flex items-start gap-3">
                <Truck className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">Free shipping</p>
                  <p className="text-xs text-muted-foreground">On orders over ₹999</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <RotateCcw className="mt-0.5 h-4 w-4 text-primary" />
                <div>
                  <p className="font-medium">7-day returns</p>
                  <p className="text-xs text-muted-foreground">Easy & hassle-free</p>
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="mt-8 space-y-3 text-sm text-foreground/80">
              <p><span className="font-medium text-foreground">Fabric:</span> 240 GSM 100% combed cotton, bio-washed.</p>
              <p><span className="font-medium text-foreground">Fit:</span> Oversized, drop-shoulder.</p>
              <p><span className="font-medium text-foreground">Care:</span> Cold wash inside out. Tumble dry low.</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
