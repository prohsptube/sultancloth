import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User } from "lucide-react";
import { MegaMenu } from "./MegaMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b-2 border-red-600 bg-white backdrop-blur supports-[backdrop-filter]:backdrop-blur-lg shadow-lg">
      {/* TOP HEADER ROW - PROPER 3-COLUMN LAYOUT */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6 gap-4">
        {/* LEFT: LOGO - Bigger */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <div className="relative h-14 w-48 md:h-16 md:w-64">
            <Image
              src="/sultan-logo.png"
              alt="Sultan Cloth"
              fill
              className="object-contain drop-shadow-[0_2px_6px_rgba(220,38,38,0.25)]"
              priority
            />
          </div>
        </Link>

        {/* CENTER: SEARCH BAR */}
        <div className="hidden md:flex flex-1 max-w-md">
          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-full border-2 border-red-300 bg-white/80 px-4 py-2.5 text-sm text-gray-800 placeholder-gray-500 focus:border-red-600 focus:outline-none focus:ring-2 focus:ring-red-400/30"
            />
            <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-red-500" />
          </div>
        </div>

        {/* RIGHT: ACCOUNT & CART */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Mobile Search */}
          <button
            className="md:hidden text-gray-700 hover:text-red-600 transition p-2"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Account Button */}
          <button
            className="hidden sm:flex items-center gap-2 rounded-full border-2 border-red-500 bg-white px-3 py-2 text-xs text-gray-700 transition hover:bg-red-50 hover:border-red-700 hover:text-red-700 whitespace-nowrap"
            aria-label="My Account"
          >
            <User className="h-4 w-4 flex-shrink-0" />
            <span className="hidden md:inline text-xs">Account</span>
          </button>

          {/* Cart Button */}
          <button
            className="flex items-center gap-2 rounded-full border-2 border-red-600 bg-red-600 px-3 py-2 text-xs text-white transition hover:bg-red-700 hover:border-red-700 shadow-md flex-shrink-0"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="text-xs font-bold">0</span>
          </button>
        </div>
      </div>

      {/* MEGA MENU ROW */}
      <MegaMenu />
    </header>
  );
}
