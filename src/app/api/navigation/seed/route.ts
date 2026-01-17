import { NextRequest, NextResponse } from "next/server";
import { getNavigationCollection } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";
import { mainNavigation } from "@/lib/navigation";

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authError = checkAdminAuth(request);
    if (authError) {
      return authError;
    }

    const navCollection = await getNavigationCollection();

    // Clear existing navigation
    await navCollection.deleteMany({});

    // Transform and insert navigation with indices
    const docs = mainNavigation.map((item, index) => ({
      label: item.label,
      href: item.href,
      order: index,
      categories: item.categories || [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const result = await navCollection.insertMany(docs);

    return NextResponse.json(
      { success: true, inserted: result.insertedCount },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] POST /api/navigation/seed error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to seed navigation" },
      { status: 500 }
    );
  }
}
