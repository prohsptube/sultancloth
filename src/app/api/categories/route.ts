// app/api/categories/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getCategoriesCollection } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";

// GET all categories
export async function GET() {
  try {
    console.log("[API] GET /api/categories - Starting...");
    const categories = await getCategoriesCollection();
    const allCategories = await categories.find({}).toArray();
    
    console.log("[API] Found categories:", allCategories.length);
    return NextResponse.json(allCategories);
  } catch (error) {
    console.error("[API] GET /api/categories error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST - Create new category
export async function POST(request: NextRequest) {
  try {
    console.log("[API] POST /api/categories - Starting...");
    
    // Check admin authentication
    const authError = checkAdminAuth(request);
    if (authError) {
      console.log("[API] Auth check failed");
      return authError;
    }
    console.log("[API] Auth check passed");

    const body = await request.json();

    const categories = await getCategoriesCollection();
    const result = await categories.insertOne({
      name: body.name,
      slug: body.slug,
      description: body.description || "",
      parentId: body.parentId || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { _id: result.insertedId, ...body },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] POST /api/categories error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create category" },
      { status: 500 }
    );
  }
}
