import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getHeroSlidesCollection } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const slides = await getHeroSlidesCollection();
    const slide = await slides.findOne({ _id: new ObjectId(id) });

    if (!slide) {
      return NextResponse.json({ error: "Hero slide not found" }, { status: 404 });
    }

    return NextResponse.json(slide);
  } catch (error) {
    console.error("[API] GET /api/hero-slides/[id] error:", error);
    return NextResponse.json({ error: "Failed to fetch hero slide" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();

    const updates: Record<string, unknown> = { updatedAt: new Date() };

    if (body.title !== undefined) updates.title = body.title;
    if (body.subtitle !== undefined) updates.subtitle = body.subtitle;
    if (body.image !== undefined) updates.image = body.image;
    if (body.ctaLabel !== undefined) updates.ctaLabel = body.ctaLabel;
    if (body.ctaHref !== undefined) updates.ctaHref = body.ctaHref;
    if (body.order !== undefined) updates.order = Number.isFinite(Number(body.order)) ? Number(body.order) : 0;
    if (body.isActive !== undefined) updates.isActive = !!body.isActive;

    const slides = await getHeroSlidesCollection();
    const result = await slides.updateOne({ _id: new ObjectId(id) }, { $set: updates });

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Hero slide not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] PUT /api/hero-slides/[id] error:", error);
    return NextResponse.json({ error: "Failed to update hero slide" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const { id } = await params;
    const slides = await getHeroSlidesCollection();
    const result = await slides.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Hero slide not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/hero-slides/[id] error:", error);
    return NextResponse.json({ error: "Failed to delete hero slide" }, { status: 500 });
  }
}
