import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { checkAdminAuth } from "@/lib/auth";
import sharp from "sharp";

const UPLOAD_DIR = join(process.cwd(), "public/uploads/hero");
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const authError = checkAdminAuth(request);
    if (authError) {
      console.log("[Upload] Auth check failed");
      return authError;
    }

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPG, PNG, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 5MB limit" },
        { status: 400 }
      );
    }

    // Create upload directory if it doesn't exist
    try {
      await mkdir(UPLOAD_DIR, { recursive: true });
    } catch (err) {
      // Directory might already exist, ignore error
    }

    // Generate unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filename = `${timestamp}-${originalName}`;
    const outputFilename = filename.replace(/\.(jpg|jpeg|png)$/i, ".webp");

    // Read file buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Optimize image with sharp
    // Resize to max 1920x800, maintain aspect ratio
    // Convert to WebP for better compression
    const optimizedBuffer = await sharp(buffer)
      .resize(1920, 800, {
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({
        quality: 85,
        effort: 6,
      })
      .toBuffer();

    // Save optimized image
    const filepath = join(UPLOAD_DIR, outputFilename);
    await writeFile(filepath, optimizedBuffer);

    // Return public URL
    const publicUrl = `/uploads/hero/${outputFilename}`;

    console.log("[Upload] Image uploaded and optimized:", publicUrl);

    return NextResponse.json(
      {
        url: publicUrl,
        filename: outputFilename,
        size: optimizedBuffer.length,
        originalSize: file.size,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[Upload] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to upload image" },
      { status: 500 }
    );
  }
}
