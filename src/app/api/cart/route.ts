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
    const cart = await db.collection("cart").findOne({ visitorId });

    return NextResponse.json(cart || { visitorId, items: [] });
  } catch (error) {
    console.error("[API] GET /api/cart error:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { visitorId, productId, quantity, size } = await request.json();

    if (!visitorId || !productId) {
      return NextResponse.json(
        { error: "visitorId and productId are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const cart = await db.collection("cart");

    const result = await cart.updateOne(
      { visitorId },
      {
        $push: {
          items: {
            _id: new ObjectId(),
            productId: new ObjectId(productId),
            quantity: quantity || 1,
            size: size || null,
            addedAt: new Date(),
          },
        } as any,
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, modifiedCount: result.modifiedCount });
  } catch (error) {
    console.error("[API] POST /api/cart error:", error);
    return NextResponse.json(
      { error: "Failed to add to cart" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const visitorId = searchParams.get("visitorId");
    const itemId = searchParams.get("itemId");

    if (!visitorId || !itemId) {
      return NextResponse.json(
        { error: "visitorId and itemId are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const cart = await db.collection("cart");

    await cart.updateOne(
      { visitorId },
      { $pull: { items: { _id: new ObjectId(itemId) } } as any }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/cart error:", error);
    return NextResponse.json(
      { error: "Failed to remove from cart" },
      { status: 500 }
    );
  }
}
