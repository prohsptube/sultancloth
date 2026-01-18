// src/app/page.tsx
import Link from "next/link";
import { Container } from "@/components/layout/Container";
import { HeroCarousel } from "@/components/layout/HeroCarousel";
import { CategoryCard } from "@/components/homepage/CategoryCard";
import { getHeroSlidesCollection, connectToDatabase } from "@/lib/mongodb";

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

type HomepageCategory = {
  _id: string;
  title: string;
  description: string;
  image?: string;
  categoryId?: string | null;
  subcategories: { label: string; href: string }[];
  order: number;
  columnsPerRow: number;
  isActive: boolean;
};

export default async function HomePage() {
  // Fetch hero slides directly on the server for instant render
  let heroSlides: HeroSlide[] = [];
  let homepageCategories: HomepageCategory[] = [];

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

  // Fetch homepage categories from database
  try {
    const { db } = await connectToDatabase();
    const categoriesCol = db.collection("homepage_categories");
    
    const rawCategories = await categoriesCol
      .find({ isActive: true })
      .sort({ order: 1 })
      .toArray();

    homepageCategories = rawCategories.map((cat) => ({
      _id: String(cat._id),
      title: cat.title,
      description: cat.description || "",
      image: cat.image || "",
      categoryId: cat.categoryId || null,
      subcategories: cat.subcategories || [],
      order: cat.order || 0,
      columnsPerRow: cat.columnsPerRow || 2,
      isActive: cat.isActive !== false,
    }));
  } catch (error) {
    console.error("[HomePage] Failed to fetch homepage categories from DB:", error);
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

          {homepageCategories.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No categories available at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {homepageCategories.map((category) => (
                <CategoryCard key={category._id} category={category} />
              ))}
            </div>
          )}
        </section>
      </Container>
    </div>
  );
}
