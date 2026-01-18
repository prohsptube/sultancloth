import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// Get inventory status and alerts
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const alert = searchParams.get("alert"); // low-stock, out-of-stock

    const { db } = await connectToDatabase();
    
    let filter: any = {};
    if (alert === "low-stock") {
      filter = { stockQuantity: { $gt: 0, $lte: 10 } };
    } else if (alert === "out-of-stock") {
      filter = { stockQuantity: 0 };
    }

    const products = await db
      .collection("products")
      .find(filter)
      .project({
        name: 1,
        sku: 1,
        stockQuantity: 1,
        price: 1,
        images: 1,
        updatedAt: 1,
      })
      .sort({ stockQuantity: 1 })
      .toArray();

    // Get overall stats
    const stats = await db.collection("products").aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          totalStock: { $sum: "$stockQuantity" },
          lowStockCount: {
            $sum: {
              $cond: [
                { $and: [{ $gt: ["$stockQuantity", 0] }, { $lte: ["$stockQuantity", 10] }] },
                1,
                0
              ]
            }
          },
          outOfStockCount: {
            $sum: { $cond: [{ $eq: ["$stockQuantity", 0] }, 1, 0] }
          },
          averageStock: { $avg: "$stockQuantity" }
        }
      }
    ]).toArray();

    return NextResponse.json({
      products,
      stats: stats[0] || {
        totalProducts: 0,
        totalStock: 0,
        lowStockCount: 0,
        outOfStockCount: 0,
        averageStock: 0
      }
    });
  } catch (error) {
    console.error("[API] GET /api/inventory error:", error);
    return NextResponse.json(
      { error: "Failed to fetch inventory" },
      { status: 500 }
    );
  }
}

// Bulk update stock quantities
export async function PUT(request: NextRequest) {
  try {
    const { updates } = await request.json(); // Array of { productId, stockQuantity }

    if (!Array.isArray(updates) || updates.length === 0) {
      return NextResponse.json(
        { error: "Updates array is required" },
        { status: 400 }
      );
    }

    const { db } = await connectToDatabase();
    
    const bulkOps = updates.map(({ productId, stockQuantity }) => ({
      updateOne: {
        filter: { _id: new ObjectId(productId) },
        update: {
          $set: {
            stockQuantity: Number(stockQuantity),
            updatedAt: new Date()
          }
        }
      }
    }));

    const result = await db.collection("products").bulkWrite(bulkOps);

    return NextResponse.json({
      message: "Stock updated successfully",
      modifiedCount: result.modifiedCount
    });
  } catch (error) {
    console.error("[API] PUT /api/inventory error:", error);
    return NextResponse.json(
      { error: "Failed to update inventory" },
      { status: 500 }
    );
  }
}
