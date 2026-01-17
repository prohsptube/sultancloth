"use client";

import Image from "next/image";
import Link from "next/link";

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-red-600 bg-white shadow-lg">
      <div className="flex flex-col items-center justify-center px-4 py-4 md:px-6">
        {/* LOGO - Centered and Bigger */}
        <Link href="/admin/dashboard" className="flex items-center flex-shrink-0 mb-4">
          <div className="relative h-16 w-56 md:h-20 md:w-72">
            <Image
              src="/sultan-logo.png"
              alt="Sultan Tag Admin"
              fill
              className="object-contain drop-shadow-[0_2px_6px_rgba(220,38,38,0.25)]"
              priority
            />
          </div>
        </Link>

        {/* Admin Title */}
        <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>
    </header>
  );
}
