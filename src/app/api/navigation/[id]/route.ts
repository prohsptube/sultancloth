import { NextRequest, NextResponse } from "next/server";
import { getNavigationCollection } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();
    const navCollection = await getNavigationCollection();

    const result = await navCollection.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          label: body.label,
          href: body.href,
          categories: body.categories || [],
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Navigation item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] PUT /api/navigation/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update navigation item" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const { id } = await params;
    const navCollection = await getNavigationCollection();
    const result = await navCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Navigation item not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/navigation/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete navigation item" },
      { status: 500 }
    );
  }
}
