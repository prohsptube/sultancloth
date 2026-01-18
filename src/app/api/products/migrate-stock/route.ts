import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// Migrate quantity field to stockQuantity
export async function POST(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    
    // Update all products: copy quantity to stockQuantity if stockQuantity doesn't exist
    const result = await db.collection("products").updateMany(
      { 
        quantity: { $exists: true },
        $or: [
          { stockQuantity: { $exists: false } },
          { stockQuantity: null },
          { stockQuantity: "" }
        ]
      },
      [
        {
          $set: {
            stockQuantity: { $toInt: "$quantity" },
            updatedAt: new Date()
          }
        }
      ]
    );

    console.log("[MIGRATE] Updated products:", result.modifiedCount);

    return NextResponse.json({
      message: "Migration completed",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("[MIGRATE] Error:", error);
    return NextResponse.json(
      { error: "Migration failed" },
      { status: 500 }
    );
  }
}
