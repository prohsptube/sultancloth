import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";

export const dynamic = 'force-dynamic';

// GET homepage categories
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    const categories = await db
      .collection("homepage_categories")
      .find({ isActive: true })
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[API] GET /api/homepage-categories error:", error);
    return NextResponse.json(
      { error: "Failed to fetch homepage categories" },
      { status: 500 }
    );
  }
}

// POST - Create new homepage category
export async function POST(request: NextRequest) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const body = await request.json();
    const { db } = await connectToDatabase();

    // Get the highest order number and add 1
    const lastCategory = await db
      .collection("homepage_categories")
      .find({})
      .sort({ order: -1 })
      .limit(1)
      .toArray();

    const newOrder = lastCategory.length > 0 ? (lastCategory[0].order || 0) + 1 : 1;

    const result = await db.collection("homepage_categories").insertOne({
      title: body.title,
      description: body.description || "",
      image: body.image || "",
      categoryId: body.categoryId || null, // Link to actual category
      subcategories: body.subcategories || [], // Array of {label, href}
      order: newOrder,
      columnsPerRow: body.columnsPerRow || 2, // 1, 2, or 3
      isActive: body.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { _id: result.insertedId, ...body, order: newOrder },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] POST /api/homepage-categories error:", error);
    return NextResponse.json(
      { error: "Failed to create homepage category" },
      { status: 500 }
    );
  }
}
