// src/components/layout/FloatingWhatsApp.tsx
import { PhoneCall } from "lucide-react";

const WHATSAPP_NUMBER = "923003795222"; // without '+'

const DEFAULT_MESSAGE = encodeURIComponent(
  "Assalam o Alaikum. I want to know more about Sultan Cloth stitched & unstitched fabrics."
);

export function FloatingWhatsApp() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${DEFAULT_MESSAGE}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="
        fixed bottom-6 right-6 z-50 
        flex h-14 w-14 items-center justify-center
        rounded-full 
        bg-emerald-500 
        shadow-[0_4px_20px_rgba(16,185,129,0.6)] 
        transition 
        hover:scale-110 hover:bg-emerald-400
      "
    >
      <PhoneCall className="h-7 w-7 text-white" />
    </a>
  );
}
