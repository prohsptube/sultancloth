// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Sultan Tag",
  description: "Sultan Tag",
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
      <body className="bg-white text-gray-800 min-h-screen">{children}</body>
    </html>
  );
}
