import Link from "next/link";
import Image from "next/image";
import { Search, ShoppingBag, User } from "lucide-react";
import { MegaMenu } from "./MegaMenu";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur-lg">
      {/* TOP HEADER ROW */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        {/* LEFT: LOGO */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <div className="relative h-10 w-40">
            <Image
              src="/sultan-logo.png"
              alt="Sultan Cloth"
              fill
              className="object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]"
              priority
            />
          </div>
        </Link>

        {/* CENTER: SEARCH BAR */}
        <div className="hidden md:flex flex-1 mx-8 items-center">
          <div className="relative w-full max-w-sm">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-full border border-zinc-700 bg-zinc-900/50 px-4 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-400/30"
            />
            <Search className="absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>

        {/* RIGHT: ACCOUNT & CART */}
        <div className="flex items-center gap-3">
          {/* Mobile Search */}
          <button
            className="md:hidden text-zinc-300 hover:text-amber-400 transition"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Account Button */}
          <button
            className="hidden sm:flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-xs text-zinc-200 transition hover:border-amber-500 hover:text-amber-300"
            aria-label="My Account"
          >
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Account</span>
          </button>

          {/* Cart Button */}
          <button
            className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/70 px-3 py-2 text-xs text-zinc-200 transition hover:border-amber-500 hover:text-amber-300"
            aria-label="Shopping Cart"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="text-xs">0</span>
          </button>
        </div>
      </div>

      {/* MEGA MENU ROW */}
      <MegaMenu />
    </header>
  );
}
