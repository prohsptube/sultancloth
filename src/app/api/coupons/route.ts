import { NextRequest, NextResponse } from "next/server";
import { getCouponsCollection } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";

// GET - Fetch all coupons
export async function GET(request: NextRequest) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const couponsCollection = await getCouponsCollection();
    const coupons = await couponsCollection
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(coupons);
  } catch (error) {
    console.error("[API] GET /api/coupons error:", error);
    return NextResponse.json(
      { error: "Failed to fetch coupons" },
      { status: 500 }
    );
  }
}

// POST - Create new coupon
export async function POST(request: NextRequest) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const body = await request.json();
    const couponsCollection = await getCouponsCollection();

    const couponData = {
      code: body.code.toUpperCase(),
      discountType: body.discountType, // percentage or fixed
      discountValue: parseFloat(body.discountValue),
      minOrderValue: body.minOrderValue ? parseFloat(body.minOrderValue) : 0,
      maxDiscount: body.maxDiscount ? parseFloat(body.maxDiscount) : null,
      usageLimit: body.usageLimit ? parseInt(body.usageLimit) : null,
      usedCount: 0,
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,
      isActive: body.isActive !== false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await couponsCollection.insertOne(couponData);

    return NextResponse.json(
      { _id: result.insertedId, ...couponData },
      { status: 201 }
    );
  } catch (error) {
    console.error("[API] POST /api/coupons error:", error);
    return NextResponse.json(
      { error: "Failed to create coupon" },
      { status: 500 }
    );
  }
}
