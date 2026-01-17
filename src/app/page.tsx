// src/app/page.tsx
import { useState } from "react";
import { Container } from "@/components/layout/Container";
import { HeroCarousel } from "@/components/layout/HeroCarousel";

type HeroSlide = {
  _id?: string;
  id?: number;
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
};

type Category = {
  label: string;
  icon: string;
  description: string;
  items: { label: string; href: string }[];
};

const categories: Category[] = [
  {
    label: "Men",
    icon: "👔",
    description: "Eastern & Western",
    items: [
      { label: "Shalwar Kameez", href: "/collections/mens-kameez" },
      { label: "Kurtas", href: "/collections/mens-kurtas" },
      { label: "Waistcoats", href: "/collections/mens-waistcoats" },
      { label: "Shirts", href: "/collections/mens-shirts" },
      { label: "Trousers", href: "/collections/mens-trousers" },
      { label: "Winter Wear", href: "/collections/mens-winter" },
    ],
  },
  {
    label: "Women",
    icon: "👗",
    description: "Suits & Separates",
    items: [
      { label: "Stitched Suits", href: "/collections/womens-suits" },
      { label: "Unstitched", href: "/collections/womens-fabric" },
      { label: "Ready to Wear", href: "/collections/womens-pret" },
      { label: "Separates", href: "/collections/womens-separates" },
      { label: "Winter Wear", href: "/collections/womens-winter" },
    ],
  },
  {
    label: "Kids",
    icon: "👕",
    description: "Boys & Girls",
    items: [
      { label: "Boys Eastern", href: "/collections/boys-eastern" },
      { label: "Boys Western", href: "/collections/boys-western" },
      { label: "Girls Eastern", href: "/collections/girls-eastern" },
      { label: "Girls Western", href: "/collections/girls-western" },
    ],
  },
  {
    label: "Unstitched",
    icon: "📦",
    description: "Fabric Cuts",
    items: [
      { label: "Men Unstitched", href: "/collections/unstitched-men" },
      { label: "Women Unstitched", href: "/collections/unstitched-women" },
      { label: "Premium Boski", href: "/collections/unstitched-boski" },
      { label: "Winter Khaddar", href: "/collections/unstitched-men-khaddar" },
    ],
  },
  {
    label: "Fragrances",
    icon: "🌸",
    description: "Perfumes",
    items: [
      { label: "For Men", href: "/collections/fragrances-men" },
      { label: "For Women", href: "/collections/fragrances-women" },
    ],
  },
];

export default async function HomePage() {
  // Fetch hero slides server-side for instant loading
  let heroSlides: HeroSlide[] = [];
  
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const res = await fetch(`${baseUrl}/api/hero-slides`, {
      cache: 'revalidate',
      next: { revalidate: 3600 }, // Revalidate every hour
    });
    if (res.ok) {
      heroSlides = await res.json();
    }
  } catch (error) {
    console.error('[HomePage] Failed to fetch hero slides:', error);
  }

  return (
    <>
      {/* HERO CAROUSEL - with pre-fetched slides for instant display */}
      <HeroCarousel initialSlides={heroSlides} />

      {/* FEATURED CATEGORIES SECTION */}
      <CategoriesWrapper />
        <Container>
          <div className="space-y-4 mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-600">
              What Would You Like to Explore?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Shop by Category
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Tap a category to see items without leaving this page. Sub-categories will drop down here.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const isOpen = open === cat.label;
              return (
                <div
                  key={cat.label}
                  className="rounded-xl border-2 border-red-200 bg-white shadow-sm transition hover:border-red-600 hover:shadow-md"
                >
                  <button
                    onClick={() => toggle(cat.label)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{cat.icon}</span>
                      <div>
                        <div className="text-base font-semibold text-gray-800">{cat.label}</div>
                        <div className="text-xs text-gray-600">{cat.description}</div>
                      </div>
                    </div>
                    <span className="text-red-600 text-lg font-bold">{isOpen ? "–" : "+"}</span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-red-100 px-5 py-4 bg-red-50/40">
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {cat.items.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            className="rounded-lg border border-red-100 bg-white px-3 py-2 text-sm font-medium text-gray-800 transition hover:border-red-500 hover:text-red-600 hover:shadow"
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
    </>
  );
}

// Client component for category section with state management
"use client";

function CategoriesWrapper() {
  const [open, setOpen] = useState<string | null>(null);

  const toggle = (label: string) => {
    setOpen((prev) => (prev === label ? null : label));
  };

  return (
    <section className="border-b-2 border-red-200 bg-gradient-to-b from-white to-red-50 py-12 md:py-16">
        <Container>
          <div className="space-y-4 mb-10 text-center">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-red-600">
              What Would You Like to Explore?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
              Shop by Category
            </h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Tap a category to see items without leaving this page. Sub-categories will drop down here.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => {
              const isOpen = open === cat.label;
              return (
                <div
                  key={cat.label}
                  className="rounded-xl border-2 border-red-200 bg-white shadow-sm transition hover:border-red-600 hover:shadow-md"
                >
                  <button
                    onClick={() => toggle(cat.label)}
                    className="flex w-full items-center justify-between px-5 py-4 text-left"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{cat.icon}</span>
                      <div>
                        <div className="text-base font-semibold text-gray-800">{cat.label}</div>
                        <div className="text-xs text-gray-600">{cat.description}</div>
                      </div>
                    </div>
                    <span className="text-red-600 text-lg font-bold">{isOpen ? "–" : "+"}</span>
                  </button>

                  {isOpen && (
                    <div className="border-t border-red-100 px-5 py-4 bg-red-50/40">
                      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {cat.items.map((item) => (
                          <a
                            key={item.href}
                            href={item.href}
                            className="rounded-lg border border-red-100 bg-white px-3 py-2 text-sm font-medium text-gray-800 transition hover:border-red-500 hover:text-red-600 hover:shadow"
                          >
                            {item.label}
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </Container>
      </section>
  );
}
