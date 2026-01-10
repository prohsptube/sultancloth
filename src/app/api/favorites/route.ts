import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get("visitorId");

    if (!visitorId) {
      return NextResponse.json(
        { error: "visitorId is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const favorites = await db.collection("favorites").findOne({ visitorId });

    return NextResponse.json(favorites || { visitorId, items: [] });
  } catch (error) {
    console.error("[API] GET /api/favorites error:", error);
    return NextResponse.json(
      { error: "Failed to fetch favorites" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { visitorId, productId } = await request.json();

    if (!visitorId || !productId) {
      return NextResponse.json(
        { error: "visitorId and productId are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const favorites = await db.collection("favorites");

    // Check if already favorited
    const existing = await favorites.findOne({
      visitorId,
      "items.productId": new ObjectId(productId),
    });

    if (existing) {
      return NextResponse.json(
        { error: "Already in favorites" },
        { status: 409 }
      );
    }

    const result = await favorites.updateOne(
      { visitorId },
      {
        $push: {
          items: {
            _id: new ObjectId(),
            productId: new ObjectId(productId),
            addedAt: new Date(),
          },
        } as any,
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("[API] POST /api/favorites error:", error);
    return NextResponse.json(
      { error: "Failed to add to favorites" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get("visitorId");
    const productId = searchParams.get("productId");

    if (!visitorId || !productId) {
      return NextResponse.json(
        { error: "visitorId and productId are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const favorites = await db.collection("favorites");

    await favorites.updateOne(
      { visitorId },
      { $pull: { items: { productId: new ObjectId(productId) } } as any }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/favorites error:", error);
    return NextResponse.json(
      { error: "Failed to remove from favorites" },
      { status: 500 }
    );
  }
}
