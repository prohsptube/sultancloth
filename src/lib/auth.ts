// lib/auth.ts
import { NextRequest, NextResponse } from "next/server";

export function isAdminAuthenticated(request: NextRequest): boolean {
  const token = request.cookies.get("admin_token")?.value;
  return !!token;
}

export function checkAdminAuth(request: NextRequest) {
  if (!isAdminAuthenticated(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}
