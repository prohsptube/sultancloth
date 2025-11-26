// components/layout/Footer.tsx
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-6 text-xs text-zinc-400 md:flex-row md:items-center md:justify-between md:px-6">
        <div>
          © {new Date().getFullYear()} Sultan Cloth. All rights reserved.
        </div>
        <div className="flex flex-wrap gap-4">
          <Link
            href="/shipping-policy"
            className="hover:text-amber-400 transition"
          >
            Shipping Policy
          </Link>
          <Link
            href="/returns"
            className="hover:text-amber-400 transition"
          >
            Returns & Exchange
          </Link>
          <Link
            href="/privacy"
            className="hover:text-amber-400 transition"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
}
