// src/app/page.tsx
import { Container } from "@/components/layout/Container";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products } from "@/lib/products";

export default function HomePage() {
  const unstitched = products.filter((p) => p.type === "UNSTITCHED");
  const stitched = products.filter((p) => p.type === "STITCHED");

  return (
    <>
      {/* HERO */}
      <section className="border-b border-zinc-800 bg-gradient-to-br from-zinc-950 via-black to-zinc-950">
        <Container className="flex flex-col gap-10 py-12 md:flex-row md:items-center md:py-16">
          {/* Left */}
          <div className="flex-1 space-y-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-400">
              Sultan Cloth · Pakistan to the World
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 md:text-4xl">
              Premium <span className="text-amber-400">Stitched</span> &
              <span className="text-amber-400"> Unstitched</span> Fabrics
              Crafted in Pakistan.
            </h1>
            <p className="max-w-xl text-sm text-zinc-400">
              From summer lawn to winter khaddar, from unstitched fabric cuts
              to fully stitched outfits – Sultan Cloth brings fabric-first
              quality with global shipping.
            </p>

            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href="/unstitched"
                className="rounded-full bg-amber-500 px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-amber-400"
              >
                Shop Unstitched
              </a>
              <a
                href="/stitched"
                className="rounded-full border border-zinc-700 px-5 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-200 transition hover:border-amber-500 hover:text-amber-300"
              >
                Shop Stitched
              </a>
            </div>

            <div className="flex flex-wrap gap-4 pt-4 text-[11px] text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                Premium Fabric Quality
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                Worldwide Shipping
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                WhatsApp Order Support
              </div>
            </div>
          </div>

          {/* Right – visual */}
          <div className="flex flex-1 items-center justify-center">
            <div className="relative h-56 w-56">
              <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-tr from-zinc-900 via-zinc-800 to-black shadow-[0_0_50px_rgba(0,0,0,0.9)]" />
              <div className="absolute inset-6 rounded-3xl border border-zinc-700/70 bg-[radial-gradient(circle_at_top,_rgba(250,250,250,0.10),_transparent_55%)]" />
              <div className="absolute bottom-6 left-1/2 flex -translate-x-1/2 translate-y-1/2 flex-col items-center gap-1 rounded-full bg-black/75 px-4 py-2 text-[10px] uppercase tracking-[0.18em] text-zinc-200">
                <span>Fabric First</span>
                <span className="text-amber-400">
                  Stitched + Unstitched
                </span>
              </div>
            </div>
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
