// src/components/layout/HeroCarousel.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

type HeroSlide = {
  _id?: string;
  id?: number;
  title: string;
  subtitle: string;
  image: string; // can be a gradient (e.g. linear-gradient) or a URL
  ctaLabel: string;
  ctaHref: string;
};

const FALLBACK_SLIDES: HeroSlide[] = [
  {
    id: 1,
    title: "Premium Stitched & Unstitched Fabrics",
    subtitle: "Crafted in Pakistan • Shipped Worldwide",
    image: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
    ctaLabel: "Shop Now",
    ctaHref: "/collections",
  },
  {
    id: 2,
    title: "Summer Lawn Collection 2025",
    subtitle: "Lightweight • Breathable • Elegant",
    image: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
    ctaLabel: "Explore Summer",
    ctaHref: "/collections/summer-lawn",
  },
  {
    id: 3,
    title: "Winter Khaddar Specials",
    subtitle: "Warm • Durable • Timeless",
    image: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
    ctaLabel: "Shop Winter",
    ctaHref: "/collections/winter-khaddar",
  },
];

export function HeroCarousel({ initialSlides = [] }: { initialSlides?: HeroSlide[] }) {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const [slides, setSlides] = useState<HeroSlide[]>(initialSlides);

  // Only fetch if no initial slides provided
  useEffect(() => {
    if (initialSlides.length > 0) {
      setSlides(initialSlides);
      return;
    }

    const fetchSlides = async () => {
      try {
        const res = await fetch("/api/hero-slides", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setSlides(data);
        }
      } catch (error) {
        console.error("[HeroCarousel] Failed to load hero slides", error);
      }
    };

    fetchSlides();
  }, [initialSlides]);

  useEffect(() => {
    setCurrent(0);
  }, [slides.length]);

  const displaySlides = useMemo(() => {
    return slides.length ? slides : FALLBACK_SLIDES;
  }, [slides]);

  useEffect(() => {
    if (!autoplay || displaySlides.length === 0) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % displaySlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoplay, displaySlides.length]);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + displaySlides.length) % displaySlides.length);
    setAutoplay(false);
  };

  const next = () => {
    setCurrent((prev) => (prev + 1) % displaySlides.length);
    setAutoplay(false);
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
    setAutoplay(false);
  };

  const slide = displaySlides[current] || FALLBACK_SLIDES[0];
  const keyForSlide = (s: HeroSlide, index: number) => s._id || s.id || index;

  return (
    <section className="relative h-[500px] overflow-hidden md:h-[600px]">
      {/* Slides */}
      <div className="relative h-full">
        {displaySlides.map((s, index) => {
          const isImage =
            s.image.startsWith("http") ||
            s.image.startsWith("/") ||
            s.image.startsWith("data:");
          const backgroundStyles = isImage
            ? {
                backgroundImage: `url(${s.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : { background: s.image };
          return (
            <div
              key={keyForSlide(s, index)}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === current ? "opacity-100" : "opacity-0"
              }`}
              style={backgroundStyles}
            >
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20" />
            </div>
          );
        })}

        {/* Content */}
        <div className="relative h-full flex items-end justify-center pb-24 md:pb-32">
          <div className="text-center space-y-6 px-4">
            <div className="space-y-2 animate-fade-in">
              <p className="text-white text-sm font-semibold uppercase tracking-[0.24em] drop-shadow-lg">
                {slide.subtitle}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-lg">
                {slide.title}
              </h1>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <a
                href={slide.ctaHref}
                className="inline-block rounded-full bg-red-600 px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/50"
              >
                {slide.ctaLabel}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-x-0 bottom-6 flex items-center justify-between px-6">
        {/* Left Arrow */}
        <button
          onClick={prev}
          className="rounded-full border-2 border-white bg-red-600/80 p-2 text-white backdrop-blur transition hover:border-white hover:bg-red-700 shadow-lg"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {displaySlides.map((_, index) => (
            <button
              key={keyForSlide(_, index)}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition ${
                index === current
                  ? "w-6 bg-white"
                  : "w-2 bg-white/50 hover:bg-white/75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={next}
          className="rounded-full border-2 border-white bg-red-600/80 p-2 text-white backdrop-blur transition hover:border-white hover:bg-red-700 shadow-lg"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
