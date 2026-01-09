// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";

export const metadata: Metadata = {
  title: "Sultan Tag | Premium Stitched & Unstitched Fabrics",
  description:
    "Sultan Tag offers premium stitched and unstitched fabrics from Pakistan with global shipping. Lawn, Khaddar, Wash & Wear, Boski and more.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white text-gray-800 min-h-screen">
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>

        {/* Floating WhatsApp CTA (always on top-right) */}
        <FloatingWhatsApp />
      </body>
    </html>
  );
}
