import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

// Get sales reports with date range filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const export_format = searchParams.get("export"); // csv, json

    const { db } = await connectToDatabase();

    // Build date filter
    const dateFilter: any = {};
    if (startDate) {
      dateFilter.$gte = new Date(startDate);
    }
    if (endDate) {
      dateFilter.$lte = new Date(endDate);
    }

    const matchStage: any = {};
    if (Object.keys(dateFilter).length > 0) {
      matchStage.createdAt = dateFilter;
    }

    // Get detailed sales data
    const salesData = await db.collection("orders").aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: "$totalAmount" },
          totalItems: { $sum: { $size: "$items" } },
        }
      }
    ]).toArray();

    // Revenue by category
    const revenueByCategory = await db.collection("orders").aggregate([
      { $match: matchStage },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$product.category",
          revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } },
          orders: { $sum: 1 }
        }
      },
      { $sort: { revenue: -1 } }
    ]).toArray();

    // Top selling products
    const topProducts = await db.collection("orders").aggregate([
      { $match: matchStage },
      { $unwind: "$items" },
      {
        $lookup: {
          from: "products",
          localField: "items.productId",
          foreignField: "_id",
          as: "product"
        }
      },
      { $unwind: "$product" },
      {
        $group: {
          _id: "$items.productId",
          productName: { $first: "$product.name" },
          totalQuantity: { $sum: "$items.quantity" },
          totalRevenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } }
        }
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: 10 }
    ]).toArray();

    // Daily sales trend
    const dailySales = await db.collection("orders").aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          orders: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]).toArray();

    // Order status breakdown
    const ordersByStatus = await db.collection("orders").aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
          revenue: { $sum: "$totalAmount" }
        }
      }
    ]).toArray();

    const report = {
      summary: salesData[0] || {
        totalRevenue: 0,
        totalOrders: 0,
        averageOrderValue: 0,
        totalItems: 0
      },
      revenueByCategory,
      topProducts,
      dailySales,
      ordersByStatus,
      dateRange: {
        start: startDate || "all time",
        end: endDate || "now"
      }
    };

    // Export as CSV if requested
    if (export_format === "csv") {
      let csv = "Date,Revenue,Orders\n";
      dailySales.forEach(day => {
        csv += `${day._id},${day.revenue},${day.orders}\n`;
      });
      
      csv += "\n\nTop Products\n";
      csv += "Product Name,Quantity Sold,Revenue\n";
      topProducts.forEach(product => {
        csv += `"${product.productName}",${product.totalQuantity},${product.totalRevenue}\n`;
      });

      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="sales-report-${new Date().toISOString().split('T')[0]}.csv"`
        }
      });
    }

    return NextResponse.json(report);
  } catch (error) {
    console.error("[API] GET /api/reports error:", error);
    return NextResponse.json(
      { error: "Failed to generate report" },
      { status: 500 }
    );
  }
}
