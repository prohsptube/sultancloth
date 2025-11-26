// src/components/product/ProductGrid.tsx
import { Product } from "@/lib/types";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  title: string;
  subtitle?: string;
  products: Product[];
}

export function ProductGrid({ title, subtitle, products }: ProductGridProps) {
  return (
    <section className="py-16">

      {/* Title Section */}
      <div className="mb-10">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-zinc-50 flex items-center gap-3">
          {/* Highlight Left Word Like Screenshot */}
          <span className="px-3 py-1 bg-amber-500 text-black rounded-md uppercase text-base tracking-[0.20em]">
            {title.split(" ")[0]}
          </span>
          <span className="text-zinc-300 uppercase tracking-[0.20em]">
            {title.split(" ").slice(1).join(" ")}
          </span>
        </h2>

        {subtitle && (
          <p className="mt-3 max-w-2xl text-sm text-zinc-400">
            {subtitle}
          </p>
        )}
      </div>

      {/* Product Cards */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

    </section>
  );
}
