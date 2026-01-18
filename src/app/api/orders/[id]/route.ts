import { NextRequest, NextResponse } from "next/server";
import { getOrdersCollection, connectToDatabase } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

type RouteContext = { params: Promise<{ id: string }> };

// PUT - Update order status
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();
    const ordersCollection = await getOrdersCollection();
    const { db } = await connectToDatabase();

    // Get current order to check if being cancelled
    const currentOrder = await ordersCollection.findOne({ _id: new ObjectId(id) });
    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // If changing status to cancelled, restore stock
    if (body.status === 'cancelled' && currentOrder.status !== 'cancelled') {
      for (const item of currentOrder.items) {
        await db.collection("products").updateOne(
          { _id: new ObjectId(item.productId) },
          { 
            $inc: { stockQuantity: item.quantity },
            $set: { updatedAt: new Date() }
          }
        );
      }
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.status) updateData.status = body.status;
    if (body.paymentStatus) updateData.paymentStatus = body.paymentStatus;
    if (body.notes !== undefined) updateData.notes = body.notes;

    const result = await ordersCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] PUT /api/orders/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update order" },
      { status: 500 }
    );
  }
}

// DELETE - Delete order
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const { id } = await params;
    const ordersCollection = await getOrdersCollection();
    const { db } = await connectToDatabase();

    // Get order to restore stock
    const order = await ordersCollection.findOne({ _id: new ObjectId(id) });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Restore stock for all items in the order
    for (const item of order.items) {
      await db.collection("products").updateOne(
        { _id: new ObjectId(item.productId) },
        { 
          $inc: { stockQuantity: item.quantity },
          $set: { updatedAt: new Date() }
        }
      );
    }

    const result = await ordersCollection.deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/orders/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete order" },
      { status: 500 }
    );
  }
}
