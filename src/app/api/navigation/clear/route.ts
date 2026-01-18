import { NextRequest, NextResponse } from "next/server";
import { getNavigationCollection } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const collection = await getNavigationCollection();
    const result = await collection.deleteMany({});

    console.log(`[CLEAR] Deleted ${result.deletedCount} navigation items`);

    return NextResponse.json(
      {
        success: true,
        message: `Cleared ${result.deletedCount} navigation items`,
        deletedCount: result.deletedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Clear Navigation] Error:", error);
    return NextResponse.json(
      { error: "Failed to clear navigation" },
      { status: 500 }
    );
  }
}
