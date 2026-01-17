// src/components/layout/MegaMenu.tsx
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { mainNavigation } from "@/lib/navigation";

interface NavSubItem {
  label: string;
  href: string;
}

interface NavCategory {
  label: string;
  href: string;
  subItems?: NavSubItem[];
}

interface NavMenu {
  label: string;
  href: string;
  categories?: NavCategory[];
}

export async function MegaMenu() {
  let navigation: NavMenu[] = mainNavigation;

  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const res = await fetch(`${baseUrl}/api/navigation`, {
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (res.ok) {
      navigation = await res.json();
    }
  } catch (error) {
    console.error("[MegaMenu] Failed to fetch navigation from DB, using static:", error);
  }
  return (
    <nav className="border-t border-red-200 bg-white/98 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        {/* Menu items - centered */}
        <div className="flex items-center justify-center flex-wrap">
          {navigation.map((item) => (
            <div key={item.label} className="group relative">
              {/* Main Menu Item */}
              <Link
                href={item.href}
                className="flex items-center gap-1.5 whitespace-nowrap px-3 md:px-4 py-3 text-[11px] md:text-[12px] font-bold uppercase tracking-[0.15em] text-gray-800 transition hover:text-red-600 relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-red-600 after:transition-all group-hover:after:w-full"
              >
                {item.label}
                {item.categories && (
                  <ChevronDown className="h-3 w-3 transition group-hover:rotate-180 duration-300" />
                )}
              </Link>

              {/* Mega Menu Dropdown */}
              {item.categories && (
                <div className="absolute left-0 top-full hidden w-max bg-white shadow-2xl border-t-4 border-red-600 p-6 group-hover:block z-50">
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                    {item.categories.map((category) => (
                      <div key={category.label}>
                        {/* Category Title */}
                        <Link
                          href={category.href}
                          className="block font-bold text-red-600 hover:text-red-700 transition text-xs uppercase tracking-[0.12em] mb-3 pb-2 border-b-2 border-red-200"
                        >
                          {category.label}
                        </Link>

                        {/* SubItems */}
                        {category.subItems && (
                          <ul className="space-y-1.5">
                            {category.subItems.map((subItem) => (
                              <li key={subItem.href}>
                                <Link
                                  href={subItem.href}
                                  className="text-[12px] text-gray-700 hover:text-red-600 transition font-medium hover:translate-x-1 inline-block"
                                >
                                  → {subItem.label}
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
      </div>
    </nav>
  );
}
