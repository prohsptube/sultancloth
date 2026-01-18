import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { checkAdminAuth } from "@/lib/auth";

// GET site settings
export async function GET(request: NextRequest) {
  try {
    const { db } = await connectToDatabase();
    
    let settings: any = await db.collection("site_settings").findOne({ type: "main" });
    
    console.log("[API Settings GET] Found settings:", settings);
    
    // Return default settings if none exist
    if (!settings) {
      settings = {
        type: "main",
        storeName: "Sultan Tag",
        tagline: "Premium Stitched & Unstitched Clothing",
        logo: "/logo.png",
        headerDisplay: "logo-and-name", // logo-only, name-only, logo-and-name, both-stacked
        email: "info@sultantag.com",
        phone: "+92 300 1234567",
        address: "Karachi, Pakistan",
        whatsapp: "+92 300 1234567",
        facebook: "",
        instagram: "",
        twitter: "",
        currency: "Rs.",
        taxRate: 0,
        shippingFee: 0,
        freeShippingThreshold: 5000,
        updatedAt: new Date()
      };
      console.log("[API Settings GET] No settings found, using defaults");
    }

    return NextResponse.json(settings);
  } catch (error) {
    console.error("[API] GET /api/settings error:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT - Update site settings
export async function PUT(request: NextRequest) {
  try {
    const authError = checkAdminAuth(request);
    if (authError) return authError;

    const body = await request.json();
    console.log("[API Settings PUT] Received body:", body);
    
    const { db } = await connectToDatabase();

    const updateData = {
      ...body,
      type: "main",
      updatedAt: new Date()
    };

    console.log("[API Settings PUT] Saving to DB:", updateData);

    await db.collection("site_settings").updateOne(
      { type: "main" },
      { $set: updateData },
      { upsert: true }
    );

    console.log("[API Settings PUT] Save successful");
    return NextResponse.json({ message: "Settings updated successfully" });
  } catch (error) {
    console.error("[API] PUT /api/settings error:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
