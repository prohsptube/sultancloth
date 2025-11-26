import Link from "next/link";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";

const navLinks = [
  { href: "/unstitched", label: "Unstitched" },
  { href: "/stitched", label: "Stitched" },
  { href: "/fabric-guide", label: "Fabric Guide" },
  { href: "/collections", label: "Collections" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="border-b border-zinc-800 bg-zinc-950/95 backdrop-blur supports-[backdrop-filter]:backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">

        {/* LOGO - Bigger, More Powerful */}
        <Link href="/" className="flex items-center">
          <div className="relative h-12 w-48 md:h-16 md:w-72">
            <Image
              src="/sultan-logo.png"
              alt="Sultan Cloth"
              fill
              className="object-contain drop-shadow-[0_6px_8px_rgba(0,0,0,0.6)]"
              priority
            />
          </div>
        </Link>

        {/* NAVIGATION */}
        <nav className="hidden md:flex items-center gap-7 text-sm text-zinc-300 font-medium">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="transition hover:text-red-400"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* CART BUTTON */}
        <div className="flex items-center">
          <button
            className="flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900/70 px-4 py-2 text-sm text-zinc-200 transition hover:border-red-500 hover:text-red-300"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            <span className="text-xs sm:text-sm">0</span>
          </button>
        </div>

      </div>
    </header>
  );
}
