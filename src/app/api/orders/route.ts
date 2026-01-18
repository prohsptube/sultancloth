import { NextRequest, NextResponse } from "next/server";
import { getOrdersCollection } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";

// GET - Fetch all orders
export async function GET(request: NextRequest) {
  try {
    const ordersCollection = await getOrdersCollection();
    const orders = await ordersCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(orders);
  } catch (error) {
    console.error("[API] GET /api/orders error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const ordersCollection = await getOrdersCollection();

    const orderData = {
      orderNumber: `ORD-${Date.now()}`,
      customer: {
        name: body.customer.name,
        email: body.customer.email,
        phone: body.customer.phone,
        address: body.customer.address,
      },
      items: body.items, // [{ productId, name, price, quantity, image }]
      subtotal: body.subtotal,
      shipping: body.shipping || 0,
      discount: body.discount || 0,
      total: body.total,
      status: "pending", // pending, processing, shipped, delivered, cancelled
      paymentMethod: body.paymentMethod || "cod",
      paymentStatus: "unpaid", // unpaid, paid
      notes: body.notes || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ordersCollection.insertOne(orderData);

    return NextResponse.json(
      { _id: result.insertedId, ...orderData },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] POST /api/orders error:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
