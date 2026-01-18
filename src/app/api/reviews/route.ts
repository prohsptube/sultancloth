import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const status = searchParams.get("status"); // pending, approved, rejected
    const all = searchParams.get("all"); // for admin to get all reviews

    const { db } = await connectToDatabase();
    
    // Admin view - get all reviews with filtering
    if (all === "true") {
      const filter: any = {};
      if (status) filter.status = status;
      if (productId) filter.productId = new ObjectId(productId);

      const reviews = await db
        .collection("reviews")
        .aggregate([
          { $match: filter },
          {
            $lookup: {
              from: "products",
              localField: "productId",
              foreignField: "_id",
              as: "product"
            }
          },
          { $unwind: { path: "$product", preserveNullAndEmptyArrays: true } },
          { $sort: { createdAt: -1 } }
        ])
        .toArray();

      return NextResponse.json(reviews);
    }

    // Customer view - only approved reviews for a product
    if (!productId) {
      return NextResponse.json(
        { error: "productId is required" },
        { status: 400 }
      );
    }

    const reviews = await db
      .collection("reviews")
      .find({ 
        productId: new ObjectId(productId),
        status: "approved"
      })
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
      status: "pending", // pending, approved, rejected
      adminResponse: null,
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
