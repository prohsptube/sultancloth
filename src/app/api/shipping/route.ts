import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Get all shipping methods
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    const shippingMethods = await db
      .collection("shipping_methods")
      .find({})
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(shippingMethods);
  } catch (error) {
    console.error("[API] GET /api/shipping error:", error);
    return NextResponse.json(
      { error: "Failed to fetch shipping methods" },
      { status: 500 }
    );
  }
}

// Create new shipping method
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const {
      name,
      description,
      cost,
      estimatedDays,
      isActive,
      freeShippingThreshold,
      zones,
    } = data;

    if (!name || cost === undefined) {
      return NextResponse.json(
        { error: "Name and cost are required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("shipping_methods").insertOne({
      name,
      description: description || "",
      cost: Number(cost),
      estimatedDays: Number(estimatedDays) || 3,
      isActive: isActive !== false,
      freeShippingThreshold: freeShippingThreshold ? Number(freeShippingThreshold) : null,
      zones: zones || ["All Pakistan"],
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { _id: result.insertedId, message: "Shipping method created successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] POST /api/shipping error:", error);
    return NextResponse.json(
      { error: "Failed to create shipping method" },
      { status: 500 }
    );
  }
}
