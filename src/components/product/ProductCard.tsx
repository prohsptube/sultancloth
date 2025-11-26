// src/components/product/ProductCard.tsx
import Link from "next/link";
import type { Product } from "@/lib/types";

function formatPrice(price: Product["pricePKR"]): string {
  if (typeof price === "number" && !Number.isNaN(price)) {
    return `PKR ${price.toLocaleString()}`;
  }
  // Safe fallback label
  return "Price on Request";
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const priceLabel = formatPrice(product.pricePKR);

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800 bg-[#050509] shadow-[0_18px_45px_rgba(0,0,0,0.75)] transition hover:-translate-y-1 hover:border-amber-500">
      {/* Image placeholder / top band */}
      <div className="relative h-32 w-full overflow-hidden bg-gradient-to-tr from-zinc-950 via-zinc-900 to-black">
        {/* Fabric type label top-left */}
        <div className="absolute left-4 top-3 rounded-full bg-black/70 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-300">
          {product.type === "UNSTITCHED" ? "Unstitched Fabric" : "Stitched Outfit"}
        </div>

        {/* Fabric name / category top-right (Lawn, Khaddar, etc.) */}
        {product.fabricType && (
          <div className="absolute right-4 top-3 text-[10px] font-medium uppercase tracking-[0.18em] text-zinc-300">
            {product.fabricType}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        {/* Title */}
        <h3 className="text-sm font-semibold text-zinc-50">{product.name}</h3>

        {/* Description */}
        {product.description && (
          <p className="mt-2 line-clamp-3 text-xs text-zinc-400">
            {product.description}
          </p>
        )}

        {/* Price + season */}
        <div className="mt-4 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="font-semibold text-amber-400">
            {priceLabel}
          </div>

          {product.season && (
            <div className="uppercase tracking-[0.18em]">
              {product.season}
            </div>
          )}
        </div>

        {/* Only View Details */}
        <div className="mt-4 flex">
          <Link
            href={product.slug ? `/product/${product.slug}` : "#"}
            className="flex flex-1 items-center justify-center rounded-full border border-amber-500 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-amber-300 transition hover:bg-amber-500 hover:text-black"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
