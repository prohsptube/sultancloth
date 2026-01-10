import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");

    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const reviews = await db
      .collection("reviews")
      .find({ productId: new ObjectId(productId) })
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("[API] GET /api/reviews error:", error);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { productId, rating, title, comment, visitorName, visitorEmail } =
      await request.json();

    if (!productId || !rating || !title || !comment) {
      return NextResponse.json(
        { error: "productId, rating, title, and comment are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("reviews").insertOne({
      productId: new ObjectId(productId),
      rating: Number(rating),
      title,
      comment,
      visitorName: visitorName || "Anonymous",
      visitorEmail: visitorEmail || "",
      createdAt: new Date(),
      updatedAt: new Date(),
      helpful: 0,
      verified: false,
    });

    return NextResponse.json(
      { _id: result.insertedId, ...{ productId, rating, title, comment } },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] POST /api/reviews error:", error);
    return NextResponse.json(
      { error: "Failed to create review" },
      { status: 500 }
    );
  }
}
