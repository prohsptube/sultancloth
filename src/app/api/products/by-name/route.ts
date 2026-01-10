import { NextRequest, NextResponse } from "next/server";
import { getProductsCollection } from "@/lib/mongodb";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  try {
    const { slug } = await params;
    const products = await getProductsCollection();
    
    // Search by category slug (since we store category as slug)
    const product = await products.findOne({ category: slug });

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[API] GET /api/products/slug/[slug] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}
