// app/admin/layout.tsx
import { AdminHeader } from "@/components/layout/AdminHeader";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <div className="flex min-h-screen flex-col">
          <AdminHeader />
          <main className="flex-1">{children}</main>
        </div>
      </body>
    </html>
  );
}
