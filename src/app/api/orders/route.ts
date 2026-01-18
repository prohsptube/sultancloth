import { NextRequest, NextResponse } from "next/server";
import { getOrdersCollection, connectToDatabase } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

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
    const { db } = await connectToDatabase();

    // Validate and deduct stock for each item
    for (const item of body.items) {
      const product = await db.collection("products").findOne({
        _id: new ObjectId(item.productId)
      });

      if (!product) {
        return NextResponse.json(
          { error: `Product ${item.name} not found` },
          { status: 400 }
        );
      }

      const currentStock = product.stockQuantity || 0;
      if (currentStock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${item.name}. Available: ${currentStock}, Requested: ${item.quantity}` },
          { status: 400 }
        );
      }

      // Deduct stock
      await db.collection("products").updateOne(
        { _id: new ObjectId(item.productId) },
        { 
          $inc: { stockQuantity: -item.quantity },
          $set: { updatedAt: new Date() }
        }
      );
    }

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
