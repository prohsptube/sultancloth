// src/components/layout/MegaMenu.tsx
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { mainNavigation } from "@/lib/navigation";

export function MegaMenu() {
  return (
    <nav className="border-t border-red-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-0 md:px-6">
        {mainNavigation.map((item) => (
          <div key={item.label} className="group relative">
            {/* Main Menu Item */}
            <Link
              href={item.href}
              className="flex items-center gap-2 whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-gray-800 transition hover:text-red-600"
            >
              {item.label}
              {item.categories && (
                <ChevronDown className="h-3 w-3 transition group-hover:rotate-180" />
              )}
            </Link>

            {/* Mega Menu Dropdown */}
            {item.categories && (
              <div className="absolute left-0 top-full hidden w-max bg-white shadow-xl border-t-2 border-red-600 p-6 group-hover:block">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
                  {item.categories.map((category) => (
                    <div key={category.label}>
                      {/* Category Title */}
                      <Link
                        href={category.href}
                        className="block font-semibold text-red-600 hover:text-red-700 transition text-xs uppercase tracking-[0.12em] mb-3"
                      >
                        {category.label}
                      </Link>

                      {/* SubItems */}
                      {category.subItems && (
                        <ul className="space-y-2">
                          {category.subItems.map((subItem) => (
                            <li key={subItem.href}>
                              <Link
                                href={subItem.href}
                                className="text-[11px] text-gray-600 hover:text-red-600 transition font-medium"
                              >
                                {subItem.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </nav>
  );
}
