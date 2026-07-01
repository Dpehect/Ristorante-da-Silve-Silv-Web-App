"use client";

import React from "react";
import { Phone, MapPin } from "lucide-react";

const ADDRESS = "Via Tinella 18, 72015 Fasano BR, Italy";
const PHONE = "+39 331 722 6444";

export default function FindUs() {
  const whatsappLink = `https://wa.me/${PHONE.replace(/[^0-9]/g, "")}?text=Hello%20Silve,%20I'd%20like%20to%20visit%20da%20Silve.`;

  return (
    <section id="find-us" className="max-w-5xl mx-auto px-6 pb-20 pt-4">
      <div className="grid md:grid-cols-2 gap-x-9 gap-y-14 items-center">
        {/* Details */}
        <div>
          <div className="uppercase tracking-[3px] text-xs text-[#81746a]">FIND US</div>
          <h3 className="font-serif text-5xl tracking-[-1px] mt-3 leading-none text-[#2c2522]">
            Come sit with us.<br />We’ll be waiting.
          </h3>

          <div className="mt-9 space-y-6 text-[#5c524b]">
            <div className="flex gap-4">
              <MapPin className="mt-1 shrink-0" size={20} />
              <div>
                <div className="font-medium text-[#2c2522]">Via Tinella 18</div>
                <div>72015 Fasano BR, Italy</div>
              </div>
            </div>

            <div className="flex gap-4">
              <Phone className="mt-1 shrink-0" size={20} />
              <a href={`tel:${PHONE}`} className="hover:text-[#c46b4e] transition-colors">
                {PHONE}
              </a>
            </div>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex items-center gap-3 rounded-2xl border border-[#2c2522] px-6 py-[13px] text-sm hover:bg-[#2c2522] hover:text-[#f9f5ed] transition-all active:scale-[0.985]"
          >
            <span>Message Silve on WhatsApp</span>
            <span aria-hidden>↗</span>
          </a>

          <p className="mt-6 text-xs text-[#81746a] leading-relaxed max-w-[290px]">
            We are a very small restaurant. Reservations are essential.
          </p>
        </div>

        {/* Elegant static "map" visual — hand-crafted, warm feel */}
        <div className="relative rounded-3xl overflow-hidden border border-[#d9d0c2] aspect-[16/10] bg-[#ede6d8] flex items-center justify-center">
          {/* Stylized representation */}
          <div className="absolute inset-0 bg-[radial-gradient(#c8b9a5_0.8px,transparent_1px)] bg-[length:3px_3px] opacity-60" />
          
          <div className="relative text-center px-8">
            <div className="font-serif tracking-tight text-[42px] text-[#2c2522]">Fasano</div>
            <div className="text-[#5c524b] text-sm tracking-[1.5px] mt-1">PUGLIA • ITALY</div>
            
            <div className="mx-auto mt-7 w-[68px] h-px bg-[#c46b4e]" />
            
            <div className="mt-6 text-[13px] text-[#5c524b] max-w-[230px]">
              A quiet street in the countryside.<br />You’ll know the house by the olive tree out front.
            </div>
          </div>

          {/* Subtle pin icon */}
          <div className="absolute bottom-8 right-8 bg-white/90 backdrop-blur px-4 py-1.5 rounded-2xl text-xs flex items-center gap-2 border border-[#d9d0c2]">
            <MapPin size={14} className="text-[#c46b4e]" /> Via Tinella 18
          </div>
        </div>
      </div>
    </section>
  );
}
