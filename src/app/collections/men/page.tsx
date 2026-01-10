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

export default function MenCollectionPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        if (!res.ok) throw new Error("Failed to fetch products");
        const allProducts: Product[] = await res.json();
        
        // Log all unique categories to debug
        const allCategories = [...new Set(allProducts.map(p => p.category))];
        console.log("Available categories:", allCategories);
        
        // Filter for men's category (case-insensitive)
        const menProducts = allProducts.filter(
          (p) => p.category && p.category.toLowerCase() === "men"
        );
        console.log("Men products found:", menProducts.length);
        setProducts(menProducts);
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
        Men · Collections
      </p>
      <h1 className="mt-2 text-3xl font-bold text-gray-900">Men Collections</h1>
      <p className="mt-2 text-sm text-gray-700 max-w-2xl">
        Explore men's fashion essentials.
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
