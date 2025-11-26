// app/unstitched/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Container } from "@/components/layout/Container";
import { ProductGrid } from "@/components/product/ProductGrid";
import { products } from "@/lib/products";
import type { Product } from "@/lib/types";

export default function UnstitchedPage() {
  const allUnstitched = products.filter((p) => p.type === "UNSTITCHED");

  const fabricTypes = useMemo(
    () => Array.from(new Set(allUnstitched.map((p) => p.fabricType))),
    [allUnstitched]
  );

  const [selectedFabricType, setSelectedFabricType] = useState<string | "ALL">(
    "ALL"
  );

  const filteredProducts: Product[] =
    selectedFabricType === "ALL"
      ? allUnstitched
      : allUnstitched.filter((p) => p.fabricType === selectedFabricType);

  return (
    <div className="border-b border-zinc-800 bg-black">
      <Container className="py-10 md:py-12">
        {/* Heading */}
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-400">
              Unstitched · Fabric First
            </p>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 md:text-3xl">
              Unstitched Fabrics by Sultan Cloth
            </h1>
            <p className="mt-2 max-w-xl text-sm text-zinc-400">
              Choose from lawn, khaddar, wash & wear and more. You can use your
              own tailor or add stitching as a service later.
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => setSelectedFabricType("ALL")}
            className={`rounded-full border px-3 py-1 transition ${
              selectedFabricType === "ALL"
                ? "border-amber-500 bg-amber-500 text-black"
                : "border-zinc-700 text-zinc-300 hover:border-amber-500 hover:text-amber-300"
            }`}
          >
            All Fabrics
          </button>
          {fabricTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedFabricType(type)}
              className={`rounded-full border px-3 py-1 transition ${
                selectedFabricType === type
                  ? "border-amber-500 bg-amber-500 text-black"
                  : "border-zinc-700 text-zinc-300 hover:border-amber-500 hover:text-amber-300"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Grid */}
        <ProductGrid
          title="All Unstitched"
          subtitle={
            selectedFabricType === "ALL"
              ? "Filter by fabric type or explore all unstitched cuts."
              : `Showing only ${selectedFabricType} fabrics.`
          }
          products={filteredProducts}
        />
      </Container>
    </div>
  );
}
