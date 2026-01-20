"use client";

import Link from "next/link";

type CategoryCardProps = {
  category: {
    _id: string;
    title: string;
    description: string;
    image?: string;
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
    <div className="w-full mb-12">
      {/* Title Section */}
      <div className="mb-6 pb-4 border-b-2 border-red-200">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">{category.title}</h2>
      </div>

      {/* Products Grid - 4 columns */}
      <div className="w-full">
        {category.products.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p className="text-sm">No products selected for this section yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {category.products.map((p) => (
              <Link
                key={p._id}
                href={`/product/${p.slug || p._id}`}
                className="group flex flex-col rounded-lg border border-red-100 bg-white overflow-hidden transition hover:border-red-500 hover:shadow-lg"
              >
                {/* Product Image */}
                <div className="w-full h-64 bg-gray-100 overflow-hidden">
                  {p.image ? (
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition"
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

                {/* Product Info */}
                <div className="p-4 flex flex-col flex-grow">
                  <div className="text-sm font-semibold text-gray-900 line-clamp-2 mb-2">
                    {p.name}
                  </div>
                  
                  {p.description && (
                    <div className="text-xs text-gray-600 line-clamp-2 mb-3">
                      {p.description}
                    </div>
                  )}

                  {/* Price */}
                  <div className="text-sm font-bold text-red-600 mt-auto">
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
