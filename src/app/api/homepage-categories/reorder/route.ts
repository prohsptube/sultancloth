import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";

// POST - Reorder homepage categories
export async function POST(request: NextRequest) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const { orderedIds } = await request.json();
    
    if (!Array.isArray(orderedIds)) {
      return NextResponse.json(
        { error: "orderedIds must be an array" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    // Update the order for each category
    const updates = orderedIds.map((id, index) => ({
      updateOne: {
        filter: { _id: { $oid: id } },
        update: { $set: { order: index + 1, updatedAt: new Date() } }
      }
    }));

    await db.collection("homepage_categories").bulkWrite(
      orderedIds.map((id, index) => ({
        updateOne: {
          filter: { _id: { $toString: id } },
          update: { $set: { order: index + 1, updatedAt: new Date() } }
        }
      }))
    );

    return NextResponse.json({ message: "Categories reordered successfully" });
  } catch (error) {
    console.error("[API] POST /api/homepage-categories/reorder error:", error);
    return NextResponse.json(
      { error: "Failed to reorder categories" },
      { status: 500 }
    );
  }
}
