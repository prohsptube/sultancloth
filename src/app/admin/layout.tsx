// app/admin/layout.tsx
import type { Metadata } from "next";
import { AdminHeader } from "@/components/layout/AdminHeader";

export const metadata: Metadata = {
  title: "Sultan Tag | Admin Dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
      </head>
      <body className="bg-gray-100 text-gray-900">
        <div className="flex min-h-screen flex-col">
          <AdminHeader />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
