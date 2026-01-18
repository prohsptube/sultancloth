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
  return (
    <div className="rounded-xl border-2 border-red-200 bg-white shadow-sm transition hover:border-red-600 hover:shadow-md">
      <div className="px-5 py-4 border-b border-red-100">
        {category.image && (
          <img 
            src={category.image} 
            alt={category.title} 
            className="w-full h-32 object-cover rounded-lg mb-3"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <div className="text-base font-semibold text-gray-900">{category.title}</div>
        <div className="text-xs text-gray-600">{category.description}</div>
      </div>
      <div className={`grid gap-2 px-5 py-4 ${
        category.columnsPerRow === 1 ? 'grid-cols-1' : 
        category.columnsPerRow === 3 ? 'grid-cols-1 sm:grid-cols-3' : 
        'grid-cols-1 sm:grid-cols-2'
      }`}>
        {category.subcategories.map((link, idx) => (
          <Link
            key={`${link.href}-${idx}`}
            href={link.href}
            className="rounded-lg border border-red-100 bg-white px-3 py-2 text-sm font-medium text-gray-800 transition hover:border-red-500 hover:text-red-600 hover:shadow"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
