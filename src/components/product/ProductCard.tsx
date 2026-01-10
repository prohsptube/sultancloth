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
  const salePriceLabel = product.salePricePKR ? formatPrice(product.salePricePKR) : null;
  const hasDiscount = product.discount && product.discount > 0;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border-2 border-red-200 bg-white shadow-lg transition hover:-translate-y-1 hover:border-red-600 hover:shadow-xl">
      {/* Image placeholder / top band */}
      <div className="relative h-32 w-full overflow-hidden bg-gradient-to-tr from-red-100 via-red-50 to-white">
        {/* Discount badge */}
        {hasDiscount && (
          <div className="absolute left-4 top-3 rounded-full bg-green-600 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white shadow-lg z-10">
            {product.discount}% OFF
          </div>
        )}

        {/* Fabric type label */}
        <div className={`absolute ${hasDiscount ? 'right-4' : 'left-4'} top-3 rounded-full bg-red-600 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-white`}>
          {product.type === "UNSTITCHED" ? "Unstitched Fabric" : "Stitched Outfit"}
        </div>

        {/* Fabric name / category top-right (Lawn, Khaddar, etc.) */}
        {product.fabricType && (
          <div className="absolute right-4 top-3 text-[10px] font-medium uppercase tracking-[0.18em] text-gray-700">
            {product.fabricType}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-5 pb-5 pt-4">
        {/* Title */}
        <h3 className="text-sm font-semibold text-gray-800">{product.name}</h3>

        {/* Description */}
        {product.description && (
          <p className="mt-2 line-clamp-3 text-xs text-gray-600">
            {product.description}
          </p>
        )}

        {/* Price + season */}
        <div className="mt-4 flex items-center justify-between text-[11px]">
          <div className="flex flex-col gap-1">
            {salePriceLabel ? (
              <>
                <div className="font-semibold text-red-600 text-sm">
                  {salePriceLabel}
                </div>
                <div className="text-xs text-gray-500 line-through">
                  {priceLabel}
                </div>
              </>
            ) : (
              <div className="font-semibold text-red-600">
                {priceLabel}
              </div>
            )}
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
            className="flex flex-1 items-center justify-center rounded-full border-2 border-red-600 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-red-600 transition hover:bg-red-600 hover:text-white"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
