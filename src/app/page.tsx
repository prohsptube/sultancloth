// src/app/page.tsx
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { getHeroSlidesCollection } from "@/lib/mongodb";

type HeroSlide = {
  _id?: string;
  id?: number;
  title: string;
  subtitle: string;
  image: string;
  ctaLabel: string;
  ctaHref: string;
  isActive?: boolean;
  order?: number;
};

type FeaturedCategory = {
  title: string;
  blurb: string;
  links: { label: string; href: string }[];
};

const featuredCategories: FeaturedCategory[] = [
  {
    title: "Men",
    blurb: "Eastern and western essentials",
    links: [
      { label: "Shalwar Kameez", href: "/collections/mens-kameez" },
      { label: "Kurtas", href: "/collections/mens-kurtas" },
      { label: "Waistcoats", href: "/collections/mens-waistcoats" },
      { label: "Shirts", href: "/collections/mens-shirts" },
      { label: "Trousers", href: "/collections/mens-trousers" },
      { label: "Winter Wear", href: "/collections/mens-winter" },
    ],
  },
  {
    title: "Women",
    blurb: "Suits, pret, and separates",
    links: [
      { label: "Stitched Suits", href: "/collections/womens-suits" },
      { label: "Unstitched", href: "/collections/womens-fabric" },
      { label: "Ready to Wear", href: "/collections/womens-pret" },
      { label: "Separates", href: "/collections/womens-separates" },
      { label: "Winter Wear", href: "/collections/womens-winter" },
    ],
  },
  {
    title: "Kids",
    blurb: "Eastern and western for boys and girls",
    links: [
      { label: "Boys Eastern", href: "/collections/boys-eastern" },
      { label: "Boys Western", href: "/collections/boys-western" },
      { label: "Girls Eastern", href: "/collections/girls-eastern" },
      { label: "Girls Western", href: "/collections/girls-western" },
    ],
  },
  {
    title: "Unstitched",
    blurb: "Fabric cuts and seasonal drops",
    links: [
      { label: "Men Unstitched", href: "/collections/unstitched-men" },
      { label: "Women Unstitched", href: "/collections/unstitched-women" },
      { label: "Premium Boski", href: "/collections/unstitched-boski" },
      { label: "Winter Khaddar", href: "/collections/unstitched-men-khaddar" },
    ],
  },
  {
    title: "Fragrances",
    blurb: "Perfumes for every mood",
    links: [
      { label: "For Men", href: "/collections/fragrances-men" },
      { label: "For Women", href: "/collections/fragrances-women" },
    ],
  },
];

export default async function HomePage() {
  // Fetch hero slides directly on the server for instant render
  let heroSlides: HeroSlide[] = [];

  try {
    const slidesCol = await getHeroSlidesCollection();
    const rawSlides = await slidesCol
      .find({ isActive: { $ne: false } })
      .sort({ order: 1, createdAt: 1 })
      .toArray();

    heroSlides = rawSlides.map(
      ({ _id, title, subtitle, image, ctaLabel, ctaHref, order, id, isActive }) => ({
        _id: _id ? String(_id) : undefined,
        id,
        title,
        subtitle,
        image,
        ctaLabel,
        ctaHref,
        order,
        isActive,
      })
    );
  } catch (error) {
    console.error("[HomePage] Failed to fetch hero slides from DB:", error);
  }

  return (
    <div className="min-h-screen bg-white">
      <HeroCarousel initialSlides={heroSlides} />

      <Container>
        <section className="py-12">
          <div className="text-center space-y-3 mb-8">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-red-600">
              What would you like to explore?
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Shop by category</h2>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto">
              Jump straight to curated collections. Links open instantly; no waiting for dropdowns.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {featuredCategories.map((category) => (
              <div
                key={category.title}
                className="rounded-xl border-2 border-red-200 bg-white shadow-sm transition hover:border-red-600 hover:shadow-md"
              >
                <div className="px-5 py-4 border-b border-red-100">
                  <div className="text-base font-semibold text-gray-900">{category.title}</div>
                  <div className="text-xs text-gray-600">{category.blurb}</div>
                </div>
                <div className="grid grid-cols-1 gap-2 px-5 py-4 sm:grid-cols-2">
                  {category.links.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="rounded-lg border border-red-100 bg-white px-3 py-2 text-sm font-medium text-gray-800 transition hover:border-red-500 hover:text-red-600 hover:shadow"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}
