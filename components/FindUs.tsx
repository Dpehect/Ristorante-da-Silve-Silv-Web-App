"use client";

import React from "react";

export default function FindUs() {
  return (
    <section className="max-w-4xl mx-auto px-6 pb-24 pt-6 text-center">
      <div className="text-[#A36A4E] text-xs tracking-[3.5px] mb-2">VIA TINELLA 18 • FASANO</div>
      <div className="text-[42px] tracking-tight mb-5">We are here.</div>
      
      <div className="text-[#524A43] max-w-xs mx-auto text-[14.5px]">
        A small house on a quiet lane. <br />The olive tree marks the door.
      </div>

      <div className="mt-10 flex justify-center gap-4 text-sm">
        <a href="tel:+393317226444" className="underline underline-offset-4">+39 331 722 6444</a>
        <span className="text-[#A36A4E]">•</span>
        <a 
          href="https://wa.me/393317226444" 
          target="_blank" 
          className="underline underline-offset-4"
        >
          Message Silve
        </a>
      </div>
    </section>
  );
}
