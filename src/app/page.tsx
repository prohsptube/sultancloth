// src/app/page.tsx
import { Container } from "@/components/layout/Container";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products } from "@/lib/products";

export default function HomePage() {
  const unstitched = products.filter((p) => p.type === "UNSTITCHED");
  const stitched = products.filter((p) => p.type === "STITCHED");

  return (
    <>
      {/* HERO CAROUSEL */}
      <HeroCarousel />

      {/* FEATURED CATEGORIES SECTION */}
      <section className="border-b border-zinc-800 bg-gradient-to-b from-black to-zinc-950/50 py-12 md:py-16">
        <Container>
          <div className="space-y-4 mb-10">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-400">
              What Would You Like to Explore?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-zinc-50">
              Shop by Category
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {/* Men */}
            <a
              href="/collections/men"
              className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-6 transition hover:border-amber-500"
            >
              <div className="absolute inset-0 bg-amber-500/0 transition group-hover:bg-amber-500/10" />
              <div className="relative text-center">
                <div className="text-4xl mb-3">👔</div>
                <h3 className="font-semibold text-zinc-50">Men</h3>
                <p className="text-xs text-zinc-400 mt-1">Eastern & Western</p>
              </div>
            </a>

            {/* Women */}
            <a
              href="/collections/women"
              className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-6 transition hover:border-amber-500"
            >
              <div className="absolute inset-0 bg-amber-500/0 transition group-hover:bg-amber-500/10" />
              <div className="relative text-center">
                <div className="text-4xl mb-3">👗</div>
                <h3 className="font-semibold text-zinc-50">Women</h3>
                <p className="text-xs text-zinc-400 mt-1">Suits & Separates</p>
              </div>
            </a>

            {/* Kids */}
            <a
              href="/collections/kids"
              className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-6 transition hover:border-amber-500"
            >
              <div className="absolute inset-0 bg-amber-500/0 transition group-hover:bg-amber-500/10" />
              <div className="relative text-center">
                <div className="text-4xl mb-3">👕</div>
                <h3 className="font-semibold text-zinc-50">Kids</h3>
                <p className="text-xs text-zinc-400 mt-1">Boys & Girls</p>
              </div>
            </a>

            {/* Unstitched */}
            <a
              href="/collections/unstitched"
              className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-6 transition hover:border-amber-500"
            >
              <div className="absolute inset-0 bg-amber-500/0 transition group-hover:bg-amber-500/10" />
              <div className="relative text-center">
                <div className="text-4xl mb-3">📦</div>
                <h3 className="font-semibold text-zinc-50">Unstitched</h3>
                <p className="text-xs text-zinc-400 mt-1">Fabric Cuts</p>
              </div>
            </a>

            {/* Fragrances */}
            <a
              href="/collections/fragrances"
              className="group relative overflow-hidden rounded-xl border border-zinc-800 bg-gradient-to-br from-zinc-900 to-black p-6 transition hover:border-amber-500"
            >
              <div className="absolute inset-0 bg-amber-500/0 transition group-hover:bg-amber-500/10" />
              <div className="relative text-center">
                <div className="text-4xl mb-3">🌸</div>
                <h3 className="font-semibold text-zinc-50">Fragrances</h3>
                <p className="text-xs text-zinc-400 mt-1">Perfumes</p>
              </div>
            </a>
          </div>
        </Container>
      </section>

      {/* UNSTITCHED GRID */}
      <Container className="py-10 md:py-12">
        <ProductGrid
          title="Unstitched Fabrics"
          subtitle="Lawn, Khaddar, Wash & Wear and more – for your own tailor or our custom stitching."
          products={unstitched}
        />

        {/* STITCHED GRID */}
        <div className="mt-10 md:mt-12">
          <ProductGrid
            title="Stitched Outfits"
            subtitle="Ready-to-wear pieces crafted from Sultan fabrics."
            products={stitched}
          />
        </div>
      </Container>
    </>
  );
}
