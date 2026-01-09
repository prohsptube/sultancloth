// src/components/layout/MegaMenu.tsx
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { mainNavigation } from "@/lib/navigation";

export function MegaMenu() {
  return (
    <nav className="border-t border-zinc-800 bg-black/50 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-0 md:px-6">
        {mainNavigation.map((item) => (
          <div key={item.label} className="group relative">
            {/* Main Menu Item */}
            <Link
              href={item.href}
              className="flex items-center gap-2 whitespace-nowrap px-3 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-200 transition hover:text-amber-400"
            >
              {item.label}
              {item.categories && (
                <ChevronDown className="h-3 w-3 transition group-hover:rotate-180" />
              )}
            </Link>

            {/* Mega Menu Dropdown */}
            {item.categories && (
              <div className="absolute left-0 top-full hidden w-max bg-black/95 p-6 backdrop-blur group-hover:block">
                <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-4">
                  {item.categories.map((category) => (
                    <div key={category.label}>
                      {/* Category Title */}
                      <Link
                        href={category.href}
                        className="block font-semibold text-amber-400 hover:text-amber-300 transition text-xs uppercase tracking-[0.12em] mb-3"
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
                                className="text-[11px] text-zinc-400 hover:text-zinc-200 transition"
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
