// src/app/collections/[slug]/page.tsx
"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SimpleProductGrid } from "@/components/product/SimpleProductGrid";
import { Container } from "@/components/layout/Container";

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
}

interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string | null;
}

export default function CollectionPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const [products, setProducts] = useState<Product[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");

        // Fetch category by slug
        const categoriesRes = await fetch("/api/categories");
        if (!categoriesRes.ok) throw new Error("Failed to fetch categories");
        const categories: Category[] = await categoriesRes.json();
        const foundCategory = categories.find((cat) => cat.slug === slug);

        if (!foundCategory) {
          setError("Category not found");
          setLoading(false);
          return;
        }

        setCategory(foundCategory);

        // Fetch all products and filter by category
        const productsRes = await fetch("/api/products");
        if (!productsRes.ok) throw new Error("Failed to fetch products");
        const allProducts: Product[] = await productsRes.json();

        // Filter products by category slug or name
        const filteredProducts = allProducts.filter(
          (product) =>
            product.category === slug || product.category === foundCategory._id
        );

        setProducts(filteredProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchData();
    }
  }, [slug]);

  if (loading) {
    return (
      <Container>
        <div className="py-12 text-center">
          <p className="text-gray-600">Loading collection...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="py-12 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Collection Header */}
      <div className="py-8 border-b border-gray-200 mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2 capitalize">
          {category?.name || "Collection"}
        </h1>
        {category?.description && (
          <p className="text-gray-600">{category.description}</p>
        )}
        <p className="text-sm text-gray-500 mt-2">
          {products.length} products found
        </p>
      </div>

      {/* Products Grid */}
      {products.length > 0 ? (
        <SimpleProductGrid products={products} />
      ) : (
        <div className="py-12 text-center">
          <p className="text-gray-600">
            No products found in this category yet.
          </p>
        </div>
      )}
    </Container>
  );
}
