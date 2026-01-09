// src/components/product/SimpleProductGrid.tsx
import { ProductCard } from "./ProductCard";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
}

interface SimpleProductGridProps {
  products: Product[];
}

export function SimpleProductGrid({ products }: SimpleProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product._id}
          id={product._id}
          image={product.image || "/placeholder.jpg"}
          title={product.name}
          price={product.price}
          category={product.category}
        />
      ))}
    </div>
  );
}
