import { NextRequest, NextResponse } from "next/server";
import { getProductsCollection } from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || searchParams.get("slug");

    if (!name) {
      return NextResponse.json(
        { error: "Product name or slug is required" },
        { status: 400 }
      );
    }

    const products = await getProductsCollection();

    // Search by slug, category slug, or name (case-insensitive)
    const product = await products.findOne({
      $or: [
        { slug: name },
        { category: name },
        { name: { $regex: name, $options: "i" } },
      ],
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("GET /api/products/slug error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
