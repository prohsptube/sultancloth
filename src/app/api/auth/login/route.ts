// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("[LOGIN] Attempt:", { email, hasPassword: !!password });
    console.log("[LOGIN] Expected:", { 
      email: process.env.ADMIN_EMAIL, 
      hasEnvPassword: !!process.env.ADMIN_PASSWORD 
    });

    // Simple authentication (in production, use bcrypt)
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      // Create a simple token (in production, use JWT)
      const token = Buffer.from(`${email}:${Date.now()}`).toString("base64");

      console.log("[LOGIN] Success! Setting cookie");

      const response = NextResponse.json(
        { success: true, token, email },
        { status: 200 }
      );

      // Set secure cookie
      response.cookies.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 24 hours
      });

      return response;
    }

    console.log("[LOGIN] Failed - invalid credentials");
    return NextResponse.json(
      { error: "Invalid credentials" },
      { status: 401 }
    );
  } catch (error) {
    console.error("POST /api/auth/login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
