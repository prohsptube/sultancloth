"use client";

import Link from "next/link";

type Subcategory = {
  label: string;
  href: string;
};

type CategoryCardProps = {
  category: {
    _id: string;
    title: string;
    description: string;
    image?: string;
    subcategories: Subcategory[];
    columnsPerRow: number;
    products: {
      _id: string;
      name: string;
      price?: number;
      salePrice?: number;
      image?: string;
      description?: string;
      category?: string;
      slug?: string;
    }[];
  };
};

export function CategoryCard({ category }: CategoryCardProps) {
  return (
    <div className="rounded-xl border-2 border-red-200 bg-white shadow-sm transition hover:border-red-600 hover:shadow-md overflow-hidden">
      {/* Title and image */}
      <div className="px-5 pt-5 flex items-start gap-4 border-b border-red-100">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">{category.title}</h3>
        </div>
        {category.image && (
          <div className="w-24 h-24 rounded-lg overflow-hidden border border-red-100 flex-shrink-0">
            <img
              src={category.image}
              alt={category.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          </div>
        )}
      </div>

      {/* Products grid */}
      <div className="px-5 py-4">
        {category.products.length === 0 ? (
          <p className="text-sm text-gray-500">No products selected for this section yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {category.products.map((p) => (
              <Link
                key={p._id}
                href={`/product/${p.slug || p._id}`}
                className="flex gap-3 rounded-lg border border-red-100 bg-white p-3 transition hover:border-red-500 hover:shadow"
              >
                <div className="w-20 h-24 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold text-gray-900 truncate">{p.name}</div>
                  {p.description && (
                    <div className="text-xs text-gray-600 line-clamp-2">{p.description}</div>
                  )}
                  <div className="text-sm font-bold text-red-600 mt-1">
                    {p.salePrice ? (
                      <>
                        Rs. {p.salePrice}
                        <span className="text-xs text-gray-500 line-through ml-2">Rs. {p.price}</span>
                      </>
                    ) : p.price ? (
                      <>Rs. {p.price}</>
                    ) : (
                      <span className="text-xs text-gray-500">Price on request</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
