// src/components/layout/HeroCarousel.tsx
"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
  cta: {
    label: string;
    href: string;
  };
}

const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "Premium Stitched & Unstitched Fabrics",
    subtitle: "Crafted in Pakistan • Shipped Worldwide",
    image: "linear-gradient(135deg, #1f2937 0%, #111827 100%)",
    cta: { label: "Shop Now", href: "/collections" },
  },
  {
    id: 2,
    title: "Summer Lawn Collection 2025",
    subtitle: "Lightweight • Breathable • Elegant",
    image: "linear-gradient(135deg, #0369a1 0%, #0c4a6e 100%)",
    cta: { label: "Explore Summer", href: "/collections/summer-lawn" },
  },
  {
    id: 3,
    title: "Winter Khaddar Specials",
    subtitle: "Warm • Durable • Timeless",
    image: "linear-gradient(135deg, #7c2d12 0%, #431407 100%)",
    cta: { label: "Shop Winter", href: "/collections/winter-khaddar" },
  },
];

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [autoplay, setAutoplay] = useState(true);

  useEffect(() => {
    if (!autoplay) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % heroSlides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoplay]);

  const prev = () => {
    setCurrent((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
    setAutoplay(false);
  };

  const next = () => {
    setCurrent((prev) => (prev + 1) % heroSlides.length);
    setAutoplay(false);
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
    setAutoplay(false);
  };

  const slide = heroSlides[current];

  return (
    <section className="relative h-[500px] overflow-hidden md:h-[600px]">
      {/* Slides */}
      <div className="relative h-full">
        {heroSlides.map((s, index) => (
          <div
            key={s.id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === current ? "opacity-100" : "opacity-0"
            }`}
            style={{ background: s.image }}
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40" />
          </div>
        ))}

        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
          <div className="text-center space-y-6 px-4">
            <div className="space-y-2 animate-fade-in">
              <p className="text-amber-400 text-sm font-semibold uppercase tracking-[0.24em]">
                {slide.subtitle}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-zinc-50 tracking-tight">
                {slide.title}
              </h1>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <a
                href={slide.cta.href}
                className="inline-block rounded-full bg-amber-500 px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-black transition hover:bg-amber-400 hover:shadow-lg hover:shadow-amber-500/50"
              >
                {slide.cta.label}
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
          className="rounded-full border border-zinc-600 bg-black/50 p-2 text-white backdrop-blur transition hover:border-amber-400 hover:bg-black/70"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Dots */}
        <div className="flex gap-2">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`h-2 rounded-full transition ${
                index === current
                  ? "w-6 bg-amber-400"
                  : "w-2 bg-zinc-600 hover:bg-zinc-400"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Right Arrow */}
        <button
          onClick={next}
          className="rounded-full border border-zinc-600 bg-black/50 p-2 text-white backdrop-blur transition hover:border-amber-400 hover:bg-black/70"
          aria-label="Next slide"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </section>
  );
}
