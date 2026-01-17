import type { Metadata } from "next";
import { AdminHeader } from "@/components/layout/AdminHeader";

export const metadata: Metadata = {
  title: "Sultan Tag | Admin Dashboard",
  description: "Admin dashboard",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-gray-100">
      <AdminHeader />
      <main className="flex-1">{children}</main>
    </div>
  );
}
