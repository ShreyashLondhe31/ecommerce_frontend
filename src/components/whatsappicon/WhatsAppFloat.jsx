import React from "react";
import { SiWhatsapp } from "react-icons/si";

export default function WhatsAppFloat() {
  console.log("🔥 WhatsAppFloat component loaded");

  return (
    <a
      href="https://wa.me/7020161320"
      className="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white 
                 rounded-full shadow-lg p-4 flex items-center justify-center 
                 hover:scale-110 transition-transform"
      target="_blank"
      rel="noopener noreferrer"
    >
      <SiWhatsapp size={28} />
    </a>
  );
}
