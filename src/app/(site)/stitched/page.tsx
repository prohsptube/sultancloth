// app/stitched/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/layout/Container";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products } from "@/lib/products";
import type { Product } from "@/lib/types";

type AudienceFilter = "ALL" | "MEN" | "WOMEN";

export default function StitchedPage() {
  const allStitched = products.filter((p) => p.type === "STITCHED");

  const [audience, setAudience] = useState<AudienceFilter>("ALL");

  const stitchedFiltered: Product[] = useMemo(() => {
    if (audience === "ALL") return allStitched;
    if (audience === "MEN") {
      return allStitched.filter((p) => p.tags.includes("men"));
    }
    if (audience === "WOMEN") {
      return allStitched.filter((p) => p.tags.includes("women"));
    }
    return allStitched;
  }, [audience, allStitched]);

  return (
    <div className="border-b border-zinc-800 bg-black">
      <Container className="py-10 md:py-12">
        {/* Heading */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-400">
              Stitched · Ready to Wear
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">
              Stitched Outfits from Sultan Fabrics
            </h1>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">
              Ready-to-wear kurtas, suits and 3-piece outfits crafted directly
              from Sultan fabrics. Perfect fits with premium finishing.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setAudience("ALL")}
            className={`rounded-full border px-3 py-1 transition ${
              audience === "ALL"
                ? "border-amber-500 bg-amber-500 text-black"
                : "border-zinc-700 text-zinc-300 hover:border-amber-500 hover:text-amber-300"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setAudience("MEN")}
            className={`rounded-full border px-3 py-1 transition ${
              audience === "MEN"
                ? "border-amber-500 bg-amber-500 text-black"
                : "border-zinc-700 text-zinc-300 hover:border-amber-500 hover:text-amber-300"
            }`}
          >
            Men
          </button>
          <button
            onClick={() => setAudience("WOMEN")}
            className={`rounded-full border px-3 py-1 transition ${
              audience === "WOMEN"
                ? "border-amber-500 bg-amber-500 text-black"
                : "border-zinc-700 text-zinc-300 hover:border-amber-500 hover:text-amber-300"
            }`}
          >
            Women
          </button>
        </div>

        {/* Grid */}
        <ProductGrid
          title="Stitched Collection"
          subtitle="Filter by audience, explore complete stitched sets and kurtas."
          products={stitchedFiltered}
        />
      </Container>
    </div>
  );
}
