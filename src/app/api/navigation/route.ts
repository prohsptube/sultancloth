import { NextRequest, NextResponse } from "next/server";
import { getNavigationCollection } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";

export async function GET() {
  try {
    const navCollection = await getNavigationCollection();
    const navigation = await navCollection
      .find({})
      .sort({ order: 1 })
      .toArray();

    console.log("[API] GET /api/navigation - Found items:", navigation.length);
    return NextResponse.json(navigation);
  } catch (error) {
    console.error("[API] GET /api/navigation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch navigation" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const body = await request.json();
    const navCollection = await getNavigationCollection();

    // Get the highest order value
    const lastItem = await navCollection
      .findOne({}, { sort: { order: -1 } });
    const nextOrder = (lastItem?.order || 0) + 1;

    const result = await navCollection.insertOne({
      label: body.label,
      href: body.href,
      categories: body.categories || [],
      order: nextOrder,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        _id: result.insertedId,
        label: body.label,
        href: body.href,
        categories: body.categories || [],
        order: nextOrder,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] POST /api/navigation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create navigation item" },
      { status: 500 }
    );
  }
}

