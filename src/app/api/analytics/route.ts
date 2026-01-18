import { NextRequest, NextResponse } from "next/server";
import { getOrdersCollection, getProductsCollection, getCouponsCollection } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const ordersCollection = await getOrdersCollection();
    const productsCollection = await getProductsCollection();
    const couponsCollection = await getCouponsCollection();

    // Get all orders
    const allOrders = await ordersCollection.find({}).toArray();
    
    // Calculate stats
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    
    // Orders by status
    const ordersByStatus = {
      pending: allOrders.filter(o => o.status === "pending").length,
      processing: allOrders.filter(o => o.status === "processing").length,
      shipped: allOrders.filter(o => o.status === "shipped").length,
      delivered: allOrders.filter(o => o.status === "delivered").length,
      cancelled: allOrders.filter(o => o.status === "cancelled").length,
    };

    // Recent orders (last 5)
    const recentOrders = allOrders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(order => ({
        _id: order._id,
        orderNumber: order.orderNumber,
        customerName: order.customer.name,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
      }));

    // Top selling products
    const productSales: { [key: string]: { name: string; count: number; revenue: number } } = {};
    
    allOrders.forEach(order => {
      order.items.forEach((item: any) => {
        const key = item.productId || item.name;
        if (!productSales[key]) {
          productSales[key] = { name: item.name, count: 0, revenue: 0 };
        }
        productSales[key].count += item.quantity;
        productSales[key].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.values(productSales)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    // Product stats
    const totalProducts = await productsCollection.countDocuments();
    const lowStockProducts = await productsCollection
      .find({ stockQuantity: { $lt: 10, $gt: 0 } })
      .toArray();
    const outOfStockProducts = await productsCollection
      .find({ $or: [{ stockQuantity: 0 }, { stockQuantity: { $exists: false } }] })
      .toArray();

    // Active coupons
    const activeCoupons = await couponsCollection.countDocuments({ isActive: true });

    // Sales trend (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const salesByDay = last7Days.map(date => {
      const dayOrders = allOrders.filter(order => 
        order.createdAt && order.createdAt.toString().startsWith(date)
      );
      return {
        date,
        orders: dayOrders.length,
        revenue: dayOrders.reduce((sum, order) => sum + (order.total || 0), 0),
      };
    });

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      activeCoupons,
      ordersByStatus,
      recentOrders,
      topProducts,
      lowStockCount: lowStockProducts.length,
      outOfStockCount: outOfStockProducts.length,
      salesByDay,
    });
  } catch (error) {
    console.error("[API] GET /api/analytics error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
