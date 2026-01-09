// src/components/product/SimpleProductGrid.tsx
import { ProductCard } from "./ProductCard";
import type { Product } from "@/lib/types";

interface ApiProduct {
  _id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
}

interface SimpleProductGridProps {
  products: ApiProduct[];
}

export function SimpleProductGrid({ products }: SimpleProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => {
        const convertedProduct: Product = {
          id: product._id,
          slug: product.category,
          name: product.name,
          type: "STITCHED",
          fabricType: "",
          description: product.description || "",
          tags: [product.category],
          pricePKR: product.price,
          gallery: product.image ? [product.image] : [],
        };
        return <ProductCard key={product._id} product={convertedProduct} />;
      })}
    </div>
  );
}
