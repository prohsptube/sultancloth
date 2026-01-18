import { NextRequest, NextResponse } from "next/server";
import { getCouponsCollection } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

type RouteContext = { params: Promise<{ id: string }> };

// PUT - Update coupon
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();
    const couponsCollection = await getCouponsCollection();

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (body.code) updateData.code = body.code.toUpperCase();
    if (body.discountType) updateData.discountType = body.discountType;
    if (body.discountValue) updateData.discountValue = parseFloat(body.discountValue);
    if (body.minOrderValue !== undefined) updateData.minOrderValue = parseFloat(body.minOrderValue);
    if (body.maxDiscount !== undefined) updateData.maxDiscount = body.maxDiscount ? parseFloat(body.maxDiscount) : null;
    if (body.usageLimit !== undefined) updateData.usageLimit = body.usageLimit ? parseInt(body.usageLimit) : null;
    if (body.expiryDate !== undefined) updateData.expiryDate = body.expiryDate ? new Date(body.expiryDate) : null;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const result = await couponsCollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] PUT /api/coupons/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update coupon" },
      { status: 500 }
    );
  }
}

// DELETE - Delete coupon
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const { id } = await params;
    const couponsCollection = await getCouponsCollection();
    const result = await couponsCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Coupon not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[API] DELETE /api/coupons/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete coupon" },
      { status: 500 }
    );
  }
}
