import { NextRequest, NextResponse } from "next/server";
import { getOrdersCollection } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const ordersCollection = await getOrdersCollection();
    const allOrders = await ordersCollection.find({}).toArray();

    // Group orders by customer email
    const customerMap: { [key: string]: any } = {};

    allOrders.forEach(order => {
      const email = order.customer.email;
      if (!customerMap[email]) {
        customerMap[email] = {
          name: order.customer.name,
          email: order.customer.email,
          phone: order.customer.phone,
          address: order.customer.address,
          totalOrders: 0,
          totalSpent: 0,
          lastOrderDate: order.createdAt,
          orders: [],
        };
      }
      customerMap[email].totalOrders++;
      customerMap[email].totalSpent += order.total || 0;
      customerMap[email].orders.push({
        orderNumber: order.orderNumber,
        total: order.total,
        status: order.status,
        date: order.createdAt,
      });
      
      // Update last order date
      if (new Date(order.createdAt) > new Date(customerMap[email].lastOrderDate)) {
        customerMap[email].lastOrderDate = order.createdAt;
      }
    });

    // Convert to array and sort by total spent
    const customers = Object.values(customerMap).sort((a, b) => b.totalSpent - a.totalSpent);

    return NextResponse.json(customers);
  } catch (error) {
    console.error("[API] GET /api/customers error:", error);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
