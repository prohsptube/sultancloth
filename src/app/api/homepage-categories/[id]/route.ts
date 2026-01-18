import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

type RouteContext = { params: Promise<{ id: string }> };

// GET single homepage category
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const { db } = await connectToDatabase();
    const category = await db
      .collection("homepage_categories")
      .findOne({ _id: new ObjectId(id) });

    if (!category) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("[API] GET /api/homepage-categories/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

// PUT - Update homepage category
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();
    const { db } = await connectToDatabase();

    const result = await db.collection("homepage_categories").updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("[API] PUT /api/homepage-categories/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update category" },
      { status: 500 }
    );
  }
}

// DELETE homepage category
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const { id } = await params;
    const { db } = await connectToDatabase();

    const result = await db
      .collection("homepage_categories")
      .deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("[API] DELETE /api/homepage-categories/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete category" },
      { status: 500 }
    );
  }
}
