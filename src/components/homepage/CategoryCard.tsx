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
  };
};

export function CategoryCard({ category }: CategoryCardProps) {
  // Only show first 4 subcategories
  const displayedSubcategories = category.subcategories.slice(0, 4);
  
  return (
    <div className="rounded-xl border-2 border-red-200 bg-white shadow-sm transition hover:border-red-600 hover:shadow-md overflow-hidden">
      {/* Large Category Image */}
      {category.image && (
        <div className="relative w-full h-64 sm:h-72 md:h-80 overflow-hidden">
          <img 
            src={category.image} 
            alt={category.title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
      )}
      
      {/* Title and Description */}
      <div className="px-5 py-4 border-b border-red-100">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{category.title}</h3>
        {category.description && (
          <p className="text-sm text-gray-600">{category.description}</p>
        )}
      </div>
      
      {/* Subcategory Links - Always 2x2 grid for 4 items */}
      <div className="grid grid-cols-2 gap-2 px-5 py-4">
        {displayedSubcategories.map((link, idx) => (
          <Link
            key={`${link.href}-${idx}`}
            href={link.href}
            className="rounded-lg border border-red-100 bg-white px-3 py-2.5 text-sm font-medium text-gray-800 text-center transition hover:border-red-500 hover:text-red-600 hover:shadow"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
