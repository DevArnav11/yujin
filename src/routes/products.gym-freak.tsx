import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Dumbbell, Flame, Loader2 } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import whiteHero from "@/assets/gym-freak-white-model.asset.json";
import blackHero from "@/assets/gym-freak-black-model.asset.json";
import {
  PRODUCT_BY_HANDLE_QUERY,
  storefrontApiRequest,
  type ShopifyProductNode,
} from "@/lib/shopify";

export const Route = createFileRoute("/products/gym-freak")({
  head: () => ({
    meta: [
      { title: "Gym Freak — Summer Arc Drop · Yujin" },
      {
        name: "description",
        content: "Yujin's Summer Arc drop. Heavyweight cotton, two colorways.",
      },
    ],
  }),
  component: GymFreakTeaser,
});

function GymFreakTeaser() {
  const { data, isLoading } = useQuery({
    queryKey: ["shopify-product", "gym-freak"],
    queryFn: async () => {
      const res = await storefrontApiRequest<{ product: ShopifyProductNode | null }>(
        PRODUCT_BY_HANDLE_QUERY,
        { handle: "gym-freak" },
      );
      return res?.data?.product ?? null;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Nav />

      <section className="relative overflow-hidden bg-[color:var(--cream-deep)]">
        <Dumbbell
          className="absolute left-10 top-16 h-12 w-12 -rotate-12 text-primary/25"
          strokeWidth={1.5}
        />
        <Dumbbell
          className="absolute bottom-12 right-10 h-14 w-14 rotate-12 text-primary/20"
          strokeWidth={1.5}
        />

        <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
          <div className="space-y-7">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-background/60 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-primary">
              <Flame className="h-3.5 w-3.5" /> Summer Arc Drop
            </span>
            <h1 className="font-display text-5xl leading-[1.05] text-primary md:text-7xl">
              Gym Freak.<br />Soft on you,<br />heavy on presence.
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-foreground/80">
              An oversized, heavyweight cotton tee for the early mornings,
              the heavy sets, and the slow walks home. Two colorways.
            </p>

            {isLoading ? (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Loading…
              </div>
            ) : data ? (
              <Link
                to="/product/$handle"
                params={{ handle: data.handle }}
                className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3.5 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-12px_oklch(0.65_0.16_50/0.55)] transition-all hover:-translate-y-0.5"
              >
                Shop Gym Freak <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <div className="space-y-3">
                <p className="inline-flex items-center gap-2 rounded-full bg-background px-4 py-2 text-sm font-medium text-primary">
                  <Flame className="h-4 w-4" /> Dropping soon
                </p>
                <div>
                  <Link
                    to="/shop"
                    className="inline-flex items-center gap-2 text-sm font-medium text-foreground/70 underline-offset-4 hover:text-primary hover:underline"
                  >
                    Browse the shop <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="relative">
            <div className="absolute -inset-6 rounded-[2rem] bg-primary/5 blur-2xl" aria-hidden />
            <div className="relative grid grid-cols-2 gap-4">
              <img
                src={whiteHero.url}
                alt="Gym Freak white tee"
                className="aspect-[3/4] w-full rounded-2xl object-cover shadow-xl"
              />
              <img
                src={blackHero.url}
                alt="Gym Freak black tee"
                className="mt-12 aspect-[3/4] w-full rounded-2xl object-cover shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
