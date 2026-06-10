import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense, useMemo, useState } from "react";
import { Loader2, PackageOpen, Search, Sparkles, Flame, Dumbbell } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import { Input } from "@/components/ui/input";
import { PRODUCTS_QUERY, storefrontApiRequest, type ShopifyProduct } from "@/lib/shopify";

const productsQuery = queryOptions({
  queryKey: ["shopify-products"],
  queryFn: async () => {
    const res = await storefrontApiRequest<{ products: { edges: ShopifyProduct[] } }>(
      PRODUCTS_QUERY,
      { first: 100 },
    );
    return (res?.data?.products?.edges ?? []) as ShopifyProduct[];
  },
});

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop — Yujin" },
      { name: "description", content: "Browse the Yujin catalog. Search drops, shop men, women & more." },
    ],
  }),
  component: ShopPage,
});

const SECTIONS = [
  { key: "men", label: "Men", match: ["men", "man", "male", "guys"] },
  { key: "women", label: "Women", match: ["women", "woman", "female", "girls"] },
  { key: "others", label: "Others", match: [] },
] as const;

function ShopPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />

      {/* Themed drop banner */}
      <section className="relative overflow-hidden bg-[color:var(--cream-deep)]">
        <div className="mx-auto max-w-7xl px-6 py-16 md:py-20">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-primary">
            <Sparkles className="h-3.5 w-3.5" /> Custom themed drops
          </div>
          <h1 className="mt-3 max-w-2xl font-display text-5xl text-foreground md:text-6xl">
            Shop the catalog.<br /> Crafted slow, dropped in batches.
          </h1>
          <p className="mt-4 max-w-xl text-foreground/70">
            Search the store, dive into curated sections, or jump straight into our latest theme.
          </p>

          <div className="mt-10 grid gap-4 md:grid-cols-3">
            <ThemeCard
              to="/products/gym-freak"
              icon={Dumbbell}
              eyebrow="Now live"
              title="Summer Arc"
              body="For the early sets and long walks home."
              tone="primary"
            />
            <ThemeCard
              icon={Flame}
              eyebrow="Coming soon"
              title="Autumn Embers"
              body="Heavyweight knits, ember tones."
              tone="muted"
            />
            <ThemeCard
              icon={Sparkles}
              eyebrow="Coming soon"
              title="Quiet Hours"
              body="Soft basics for the slow mornings."
              tone="muted"
            />
          </div>
        </div>
      </section>

      <Suspense
        fallback={
          <div className="flex items-center justify-center py-24 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        }
      >
        <ShopBody />
      </Suspense>

      <Footer />
    </div>
  );
}

function ShopBody() {
  const { data: products } = useSuspenseQuery(productsQuery);
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string>("all");

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return products.filter((p) => {
      if (!term) return true;
      const n = p.node;
      return (
        n.title.toLowerCase().includes(term) ||
        (n.description ?? "").toLowerCase().includes(term) ||
        (n.productType ?? "").toLowerCase().includes(term) ||
        (n.tags ?? []).some((t) => t.toLowerCase().includes(term))
      );
    });
  }, [products, q]);

  const sections = useMemo(() => {
    const buckets: Record<string, ShopifyProduct[]> = { men: [], women: [], others: [] };
    for (const p of filtered) {
      const hay = `${p.node.productType ?? ""} ${(p.node.tags ?? []).join(" ")} ${p.node.title}`.toLowerCase();
      if (SECTIONS[0].match.some((m) => hay.includes(m))) buckets.men.push(p);
      else if (SECTIONS[1].match.some((m) => hay.includes(m))) buckets.women.push(p);
      else buckets.others.push(p);
    }
    return buckets;
  }, [filtered]);

  if (products.length === 0) {
    return (
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-border bg-[color:var(--cream-deep)] p-12 text-center">
          <PackageOpen className="mx-auto h-10 w-10 text-primary/70" strokeWidth={1.6} />
          <h2 className="mt-4 font-display text-2xl">No products yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Your store is connected. Add a product in Shopify and it'll appear here.
          </p>
        </div>
      </section>
    );
  }

  const tabs = [
    { key: "all", label: "All", count: filtered.length },
    { key: "men", label: "Men", count: sections.men.length },
    { key: "women", label: "Women", count: sections.women.length },
    { key: "others", label: "Others", count: sections.others.length },
  ];

  const visible =
    active === "all"
      ? filtered
      : sections[active as "men" | "women" | "others"] ?? [];

  return (
    <section className="mx-auto max-w-7xl px-6 py-16">
      {/* Search + tabs */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-md">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search drops, tees, knits…"
            className="h-12 rounded-full border-border/70 bg-[color:var(--cream-deep)] pl-11 text-base"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                active === t.key
                  ? "bg-primary text-primary-foreground"
                  : "bg-[color:var(--cream-deep)] text-foreground/70 hover:text-primary"
              }`}
            >
              {t.label} <span className="ml-1 opacity-60">{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="mt-12">
        {active === "all" ? (
          <div className="space-y-16">
            {(["men", "women", "others"] as const).map((key) =>
              sections[key].length > 0 ? (
                <SectionGroup
                  key={key}
                  label={SECTIONS.find((s) => s.key === key)!.label}
                  products={sections[key]}
                />
              ) : null,
            )}
            {filtered.length === 0 && <NoResults />}
          </div>
        ) : visible.length > 0 ? (
          <ProductGrid products={visible} />
        ) : (
          <NoResults />
        )}
      </div>
    </section>
  );
}

function SectionGroup({ label, products }: { label: string; products: ShopifyProduct[] }) {
  return (
    <div>
      <div className="mb-6 flex items-end justify-between">
        <h2 className="font-display text-3xl text-foreground md:text-4xl">{label}</h2>
        <span className="text-xs uppercase tracking-wider text-muted-foreground">
          {products.length} {products.length === 1 ? "piece" : "pieces"}
        </span>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}

function ProductGrid({ products }: { products: ShopifyProduct[] }) {
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
              <div>
                <h3 className="font-display text-lg">{p.node.title}</h3>
                {p.node.productType && (
                  <p className="text-xs uppercase tracking-wider text-muted-foreground">
                    {p.node.productType}
                  </p>
                )}
              </div>
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

function NoResults() {
  return (
    <div className="mx-auto max-w-xl rounded-3xl border border-dashed border-border bg-[color:var(--cream-deep)] p-12 text-center">
      <Search className="mx-auto h-8 w-8 text-primary/70" strokeWidth={1.6} />
      <h3 className="mt-4 font-display text-xl">No matches</h3>
      <p className="mt-2 text-sm text-muted-foreground">Try a different word or browse all sections.</p>
    </div>
  );
}

function ThemeCard({
  to,
  icon: Icon,
  eyebrow,
  title,
  body,
  tone,
}: {
  to?: string;
  icon: typeof Flame;
  eyebrow: string;
  title: string;
  body: string;
  tone: "primary" | "muted";
}) {
  const cls =
    tone === "primary"
      ? "bg-primary text-primary-foreground"
      : "bg-background text-foreground border border-border/70";
  const inner = (
    <div className={`group flex h-full flex-col justify-between rounded-3xl p-6 transition-all hover:-translate-y-1 ${cls}`}>
      <div>
        <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.18em] opacity-80">
          <Icon className="h-3.5 w-3.5" /> {eyebrow}
        </div>
        <h3 className="mt-4 font-display text-2xl">{title}</h3>
        <p className="mt-1 text-sm opacity-80">{body}</p>
      </div>
      <span className="mt-6 text-xs uppercase tracking-wider opacity-80">
        {to ? "Explore →" : "Soon"}
      </span>
    </div>
  );
  return to ? <Link to={to}>{inner}</Link> : <div>{inner}</div>;
}
