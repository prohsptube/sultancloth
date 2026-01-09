import { NextRequest, NextResponse } from "next/server";
import { getHeroSlidesCollection } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";

export async function GET() {
  try {
    const slides = await getHeroSlidesCollection();
    const allSlides = await slides
      .find({ isActive: { $ne: false } })
      .sort({ order: 1, createdAt: 1 })
      .toArray();

    return NextResponse.json(allSlides);
  } catch (error) {
    console.error("[API] GET /api/hero-slides error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch hero slides" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const body = await request.json();
    const { title, subtitle, image, ctaLabel, ctaHref } = body;

    if (!title || !image || !ctaLabel || !ctaHref) {
      return NextResponse.json(
        { error: "Title, image, CTA label, and CTA link are required" },
        { status: 400 }
      );
    }

    const orderValue = Number.isFinite(Number(body.order)) ? Number(body.order) : 0;
    const doc = {
      title,
      subtitle: subtitle || "",
      image,
      ctaLabel,
      ctaHref,
      order: orderValue,
      isActive: body.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const slides = await getHeroSlidesCollection();
    const result = await slides.insertOne(doc);

    return NextResponse.json({ _id: result.insertedId, ...doc }, { status: 201 });
  } catch (error) {
    console.error("[API] POST /api/hero-slides error:", error);
    return NextResponse.json(
      { error: "Failed to create hero slide" },
      { status: 500 }
    );
  }
}
