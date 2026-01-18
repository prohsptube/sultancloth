// components/layout/Footer.tsx
"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react";
import { useState, useEffect } from "react";

interface SiteSettings {
  storeName: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
}

export function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({
    storeName: "Sultan Tag",
    email: "info@sultantag.com",
    phone: "+92 300 1234567",
    address: "Karachi, Pakistan",
    facebook: "",
    instagram: "",
    twitter: ""
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        console.log("[Footer] Fetched settings:", data);
        if (data && !data.error) {
          setSettings({
            storeName: data.storeName || "Sultan Tag",
            email: data.email || "info@sultantag.com",
            phone: data.phone || "+92 300 1234567",
            address: data.address || "Karachi, Pakistan",
            facebook: data.facebook || "",
            instagram: data.instagram || "",
            twitter: data.twitter || ""
          });
        }
      } catch (err) {
        console.error("[Footer] Failed to fetch settings:", err);
      }
    };
    
    fetchSettings();
  }, []);

  return (
    <footer className="border-t border-zinc-800 bg-black">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Store Info */}
          <div className="md:col-span-2">
            <h3 className="text-white font-bold text-lg mb-4">{settings.storeName}</h3>
            <div className="space-y-2 text-zinc-400 text-sm">
              {settings.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 flex-shrink-0 mt-0.5 text-red-500" />
                  <span>{settings.address}</span>
                </div>
              )}
              {settings.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0 text-red-500" />
                  <a href={`mailto:${settings.email}`} className="hover:text-amber-400 transition">
                    {settings.email}
                  </a>
                </div>
              )}
              {settings.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0 text-red-500" />
                  <a href={`tel:${settings.phone}`} className="hover:text-amber-400 transition">
                    {settings.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2 text-zinc-400 text-sm">
              <Link href="/collections" className="block hover:text-amber-400 transition">
                Collections
              </Link>
              <Link href="/fabric-guide" className="block hover:text-amber-400 transition">
                Fabric Guide
              </Link>
              <Link href="/contact" className="block hover:text-amber-400 transition">
                Contact Us
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">Customer Service</h3>
            <div className="space-y-2 text-zinc-400 text-sm">
              <Link href="/shipping-policy" className="block hover:text-amber-400 transition">
                Shipping Policy
              </Link>
              <Link href="/returns" className="block hover:text-amber-400 transition">
                Returns & Exchange
              </Link>
              <Link href="/privacy" className="block hover:text-amber-400 transition">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        {/* Social Media & Copyright */}
        <div className="border-t border-zinc-800 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-xs text-zinc-400">
            © {new Date().getFullYear()} {settings.storeName}. All rights reserved.
          </div>
          
          {/* Social Icons */}
          {(settings.facebook || settings.instagram || settings.twitter) && (
            <div className="flex items-center gap-4">
              {settings.facebook && (
                <a
                  href={settings.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-red-500 transition"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {settings.instagram && (
                <a
                  href={settings.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-red-500 transition"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {settings.twitter && (
                <a
                  href={settings.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-red-500 transition"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
