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
    image: "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
    cta: { label: "Shop Now", href: "/collections" },
  },
  {
    id: 2,
    title: "Summer Lawn Collection 2025",
    subtitle: "Lightweight • Breathable • Elegant",
    image: "linear-gradient(135deg, #fbbf24 0%, #d97706 100%)",
    cta: { label: "Explore Summer", href: "/collections/summer-lawn" },
  },
  {
    id: 3,
    title: "Winter Khaddar Specials",
    subtitle: "Warm • Durable • Timeless",
    image: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
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
            <div className="absolute inset-0 bg-black/20" />
          </div>
        ))}

        {/* Content */}
        <div className="relative h-full flex items-center justify-center">
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
                href={slide.cta.href}
                className="inline-block rounded-full bg-red-600 px-8 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-white transition hover:bg-red-700 hover:shadow-lg hover:shadow-red-600/50"
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
          className="rounded-full border-2 border-white bg-red-600/80 p-2 text-white backdrop-blur transition hover:border-white hover:bg-red-700 shadow-lg"
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
