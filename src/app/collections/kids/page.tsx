"use client";

import { useEffect, useState } from "react";
import { SimpleProductGrid } from "@/components/product/SimpleProductGrid";
import { Container } from "@/components/layout/Container";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  salePrice?: number;
  discount?: number;
  description?: string;
  image?: string;
  slug?: string;
}

export default function KidsCollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const allProducts: Product[] = await res.json();
        const kidsProducts = allProducts.filter(
          (p) => p.category && p.category.toLowerCase() === "kids"
        );
        setProducts(kidsProducts);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <Container className="py-12 md:py-14">
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-600">
        Kids · Collections
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">Kids Collections</h1>
      <p className="mt-2 text-sm text-gray-700 max-w-2xl">
        Explore our kids collection.
      </p>

      {loading ? (
        <div className="mt-8 text-center text-gray-600">Loading products...</div>
      ) : products.length === 0 ? (
        <div className="mt-8 text-center text-gray-600">
          No products available in this collection.
        </div>
      ) : (
        <div className="mt-8">
          <SimpleProductGrid products={products} />
        </div>
      )}
    </Container>
  );
}
