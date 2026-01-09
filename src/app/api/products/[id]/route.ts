// app/api/products/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getProductsCollection } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

type RouteContext = { params: Promise<{ id: string }> };

// GET single product
export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params;
    const products = await getProductsCollection();
    const product = await products.findOne({
      _id: new ObjectId(id),
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT - Update product
export async function PUT(request: NextRequest, { params }: RouteContext) {
  try {
    // Check admin authentication
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const { id } = await params;
    const body = await request.json();
    const products = await getProductsCollection();

    const result = await products.updateOne(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...body,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE product
export async function DELETE(request: NextRequest, { params }: RouteContext) {
  try {
    // Check admin authentication
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const { id } = await params;
    const products = await getProductsCollection();
    const result = await products.deleteOne({
      _id: new ObjectId(id),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/products/[id] error:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
