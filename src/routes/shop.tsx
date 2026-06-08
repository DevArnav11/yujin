import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense } from "react";
import { Loader2, PackageOpen } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { PRODUCTS_QUERY, storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";

const productsQuery = queryOptions({
  queryKey: ["shopify-products"],
  queryFn: async () => {
    const res = await storefrontApiRequest<{ products: { edges: ShopifyProduct[] } }>(
      PRODUCTS_QUERY,
      { first: 50 },
    );
    return (res?.data?.products?.edges ?? []) as ShopifyProduct[];
  },
});

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Yujin" },
      { name: "description", content: "Browse the latest Yujin drops." },
    ],
  }),
  component: ShopPage,
});

function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <section className="mx-auto max-w-7xl px-6 py-16 md:py-20">
        <header className="mb-12">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-primary">Catalog</p>
          <h1 className="mt-3 font-display text-4xl text-foreground md:text-6xl">Shop everything</h1>
          <p className="mt-3 max-w-xl text-foreground/70">
            Cozy basics and limited drops, made slow.
          </p>
        </header>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-24 text-muted-foreground">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          }
        >
          <ProductGrid />
        </Suspense>
      </section>
      <Footer />
    </div>
  );
}

function ProductGrid() {
  const { data: products } = useSuspenseQuery(productsQuery);

  if (products.length === 0) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-border bg-[color:var(--cream-deep)] p-12 text-center">
        <PackageOpen className="mx-auto h-10 w-10 text-primary/70" strokeWidth={1.6} />
        <h2 className="mt-4 font-display text-2xl">No products found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your store is connected and ready. Add your first product to make it appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((p) => {
        const img = p.node.images.edges[0]?.node;
        const price = p.node.priceRange.minVariantPrice;
        return (
          <Link
            key={p.node.id}
            to="/product/$handle"
            params={{ handle: p.node.handle }}
            className="group block overflow-hidden rounded-3xl bg-[color:var(--cream-deep)] p-5 transition-all hover:-translate-y-1"
          >
            <div className="aspect-square overflow-hidden rounded-2xl bg-background">
              {img && (
                <img
                  src={img.url}
                  alt={img.altText ?? p.node.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              )}
            </div>
            <div className="mt-4 flex items-center justify-between">
              <h3 className="font-display text-lg">{p.node.title}</h3>
              <span className="font-display text-primary">
                {price.currencyCode} {parseFloat(price.amount).toFixed(2)}
              </span>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
