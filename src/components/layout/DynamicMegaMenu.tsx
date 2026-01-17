"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

interface Category {
  _id: string;
  name: string;
  slug: string;
  parentId?: string | null;
}

export function DynamicMegaMenu() {
  console.log("[DynamicMegaMenu] Component mounted!");
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        if (res.ok) {
          const data = await res.json();
          console.log("[DynamicMegaMenu] Fetched categories:", data);
          setCategories(data);
        } else {
          console.error("[DynamicMegaMenu] Failed to fetch - status:", res.status);
        }
      } catch (error) {
        console.error("[DynamicMegaMenu] Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Get main categories (Level 1 - no parentId)
  const mainCategories = categories.filter((cat) => !cat.parentId);
  console.log("[DynamicMegaMenu] Main categories:", mainCategories);

  // Get direct children of a category (Level 2)
  const getSubcategories = (parentId: string) => {
    return categories.filter((cat) => cat.parentId === parentId);
  };

  // Get sub-subcategories (Level 3)
  const getSubSubcategories = (parentId: string) => {
    return categories.filter((cat) => cat.parentId === parentId);
  };

  if (loading) {
    console.log("[DynamicMegaMenu] Still loading...");
    return <nav className="border-t border-red-200 bg-white/98 h-12" />;
  }

  console.log("[DynamicMegaMenu] Rendering with categories:", categories);

  return (
    <nav className="border-t border-red-200 bg-white/98 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="flex items-center justify-center flex-wrap">
          {mainCategories.map((mainCat) => {
            const level2Cats = getSubcategories(mainCat._id);
            return (
              <div key={mainCat._id} className="group relative">
                {/* Main Menu Item (Level 1) */}
                <Link
                  href={`/collections/${mainCat.slug}`}
                  className="flex items-center gap-1.5 whitespace-nowrap px-3 md:px-4 py-3 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-gray-800 transition hover:text-red-600 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-red-600 after:transition-all group-hover:after:w-full"
                >
                  {mainCat.name}
                  {level2Cats.length > 0 && (
                    <ChevronDown className="h-3 w-3 transition group-hover:rotate-180 duration-300" />
                  )}
                </Link>

                {/* Mega Menu Dropdown */}
                {level2Cats.length > 0 && (
                  <div className="absolute left-0 top-full hidden w-max bg-white shadow-2xl border-t-4 border-red-600 p-6 group-hover:block z-50">
                    <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                      {level2Cats.map((level2Cat) => {
                        const level3Cats = getSubSubcategories(level2Cat._id);
                        return (
                          <div key={level2Cat._id}>
                            {/* Level 2 Category Title */}
                            <Link
                              href={`/collections/${level2Cat.slug}`}
                              className="block font-bold text-red-600 hover:text-red-700 transition text-xs uppercase tracking-[0.12em] mb-3 pb-2 border-b-2 border-red-200"
                            >
                              {level2Cat.name}
                            </Link>

                            {/* Level 3 SubItems */}
                            {level3Cats.length > 0 && (
                              <ul className="space-y-1.5">
                                {level3Cats.map((level3Cat) => (
                                  <li key={level3Cat._id}>
                                    <Link
                                      href={`/collections/${level3Cat.slug}`}
                                      className="text-[12px] text-gray-700 hover:text-red-600 transition font-medium hover:translate-x-1 inline-block"
                                    >
                                      → {level3Cat.name}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
