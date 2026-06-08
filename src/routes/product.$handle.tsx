import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { Suspense, useMemo, useState } from "react";
import { Loader2, Minus, Plus, RotateCcw, ShoppingBag, Truck } from "lucide-react";
import { Nav } from "@/components/site/Nav";
import { Footer } from "@/components/site/Footer";
import {
  PRODUCT_BY_HANDLE_QUERY,
  storefrontApiRequest,
  type ShopifyProductNode,
} from "@/lib/shopify";
import { useCartStore } from "@/stores/cartStore";

const productQuery = (handle: string) =>
  queryOptions({
    queryKey: ["shopify-product", handle],
    queryFn: async () => {
      const res = await storefrontApiRequest<{ product: ShopifyProductNode | null }>(
        PRODUCT_BY_HANDLE_QUERY,
        { handle },
      );
      const product = res?.data?.product;
      if (!product) throw notFound();
      return product;
    },
  });

export const Route = createFileRoute("/product/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.handle} — Yujin` },
      { name: "description", content: `Shop ${params.handle} on Yujin.` },
    ],
  }),
  component: ProductPage,
  notFoundComponent: () => (
    <div className="min-h-screen bg-background">
      <Nav />
      <div className="mx-auto max-w-xl px-6 py-32 text-center">
        <h1 className="font-display text-4xl">Product not found</h1>
        <p className="mt-2 text-muted-foreground">This item may have been moved or sold out.</p>
        <Link
          to="/shop"
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Back to shop
        </Link>
      </div>
      <Footer />
    </div>
  ),
});

function ProductPage() {
  return (
    <div className="min-h-screen bg-background">
      <Nav />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-32 text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        }
      >
        <ProductDetail />
      </Suspense>
      <Footer />
    </div>
  );
}

function ProductDetail() {
  const { handle } = Route.useParams();
  const { data: product } = useSuspenseQuery(productQuery(handle));

  const variants = product.variants.edges.map((e) => e.node);
  const images = product.images.edges.map((e) => e.node);

  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    variants[0]?.selectedOptions.forEach((o) => (init[o.name] = o.value));
    return init;
  });
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);

  const selectedVariant = useMemo(
    () =>
      variants.find((v) =>
        v.selectedOptions.every((o) => selectedOptions[o.name] === o.value),
      ) ?? variants[0],
    [variants, selectedOptions],
  );

  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);

  const handleAdd = async () => {
    if (!selectedVariant) return;
    await addItem({
      product: { node: product },
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: qty,
      selectedOptions: selectedVariant.selectedOptions,
    });
  };

  const mainImg = images[Math.min(activeImg, images.length - 1)];

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      <nav className="mb-8 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        <Link to="/shop" className="hover:text-primary">Shop</Link> /{" "}
        <span className="text-primary">{product.title}</span>
      </nav>

      <div className="grid gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl bg-[color:var(--cream-deep)]">
            {mainImg && (
              <img
                src={mainImg.url}
                alt={mainImg.altText ?? product.title}
                className="aspect-square w-full object-contain p-6 md:p-12"
              />
            )}
          </div>
          {images.length > 1 && (
            <div className="grid grid-cols-4 gap-3">
              {images.slice(0, 4).map((img, i) => (
                <button
                  key={img.url}
                  onClick={() => setActiveImg(i)}
                  className={`overflow-hidden rounded-xl border-2 bg-[color:var(--cream-deep)] transition ${
                    i === activeImg ? "border-primary" : "border-transparent hover:border-border"
                  }`}
                >
                  <img src={img.url} alt="" className="aspect-square w-full object-contain p-2" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <h1 className="font-display text-4xl leading-tight text-foreground md:text-5xl">
            {product.title}
          </h1>
          <div className="mt-4 font-display text-3xl text-primary">
            {selectedVariant?.price.currencyCode} {parseFloat(selectedVariant?.price.amount ?? "0").toFixed(2)}
          </div>
          {product.description && (
            <p className="mt-4 whitespace-pre-line text-foreground/70">{product.description}</p>
          )}

          {product.options.map((opt) => (
            <div key={opt.name} className="mt-8">
              <p className="text-sm font-medium">
                {opt.name} ·{" "}
                <span className="text-muted-foreground">{selectedOptions[opt.name]}</span>
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {opt.values.map((val) => {
                  const active = selectedOptions[opt.name] === val;
                  return (
                    <button
                      key={val}
                      onClick={() => setSelectedOptions((s) => ({ ...s, [opt.name]: val }))}
                      className={`h-11 min-w-[3rem] rounded-full border px-4 text-sm font-medium transition ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-background text-foreground hover:border-primary/50"
                      }`}
                    >
                      {val}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

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
            <button
              onClick={handleAdd}
              disabled={isLoading || !selectedVariant?.availableForSale}
              className="group inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-medium text-primary-foreground shadow-[0_10px_30px_-12px_oklch(0.65_0.16_50/0.55)] transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  {selectedVariant?.availableForSale ? "Add to bag" : "Sold out"}
                </>
              )}
            </button>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-4 rounded-2xl border border-border bg-card p-5 text-sm">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Fast shipping</p>
                <p className="text-xs text-muted-foreground">Tracked delivery</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <RotateCcw className="mt-0.5 h-4 w-4 text-primary" />
              <div>
                <p className="font-medium">Easy returns</p>
                <p className="text-xs text-muted-foreground">Hassle-free</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
