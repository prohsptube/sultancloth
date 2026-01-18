import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Update shipping method
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid shipping method ID" },
        { status: 400 }
      );
    }

    const data = await request.json();
    const updateData = { ...data, updatedAt: new Date() };
    delete updateData._id;

    if (updateData.cost !== undefined) updateData.cost = Number(updateData.cost);
    if (updateData.estimatedDays !== undefined) updateData.estimatedDays = Number(updateData.estimatedDays);
    if (updateData.freeShippingThreshold) updateData.freeShippingThreshold = Number(updateData.freeShippingThreshold);

    const { db } = await connectToDatabase();
    const result = await db.collection("shipping_methods").updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Shipping method not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Shipping method updated successfully" });
  } catch (error) {
    console.error("[API] PUT /api/shipping/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update shipping method" },
      { status: 500 }
    );
  }
}

// Delete shipping method
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    if (!ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid shipping method ID" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    const result = await db.collection("shipping_methods").deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Shipping method not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Shipping method deleted successfully" });
  } catch (error) {
    console.error("[API] DELETE /api/shipping/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete shipping method" },
      { status: 500 }
    );
  }
}
