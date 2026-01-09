// app/api/products/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getProductsCollection } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";
import { ObjectId } from "mongodb";

// GET all products
export async function GET(request: NextRequest) {
  try {
    console.log("[API] GET /api/products - Starting...");
    console.log("[API] MONGODB_URI exists:", !!process.env.MONGODB_URI);
    
    const products = await getProductsCollection();
    const allProducts = await products.find({}).toArray();
    
    console.log("[API] Found products:", allProducts.length);
    return NextResponse.json(allProducts);
  } catch (error) {
    console.error("[API] GET /api/products error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request: NextRequest) {
  try {
    console.log("[API] POST /api/products - Starting...");
    console.log("[API] Cookies:", request.cookies.getAll());
    
    // Check admin authentication
    const authError = checkAdminAuth(request);
    if (authError) {
      console.log("[API] Auth check failed");
      return authError;
    }
    console.log("[API] Auth check passed");

    const body = await request.json();

    const products = await getProductsCollection();
    const result = await products.insertOne({
      ...body,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      { _id: result.insertedId, ...body },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}
