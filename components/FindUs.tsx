"use client";

import React from "react";

export default function FindUs() {
  return (
    <section className="max-w-3xl mx-auto px-6 pb-20 pt-4 text-center">
      <div className="text-[#a35f3f] text-[11px] tracking-[4px]">VIA TINELLA 18, FASANO</div>
      <div className="serif mt-3 text-[40px] tracking-tight">Come sit with us.</div>
      <div className="mt-4 text-[#5c5146]">A quiet house. An olive tree by the door.</div>

      <div className="mt-8 flex justify-center gap-x-6 text-sm">
        <a href="tel:+393317226444" className="hover:text-[#a35f3f]">+39 331 722 6444</a>
        <a href="https://wa.me/393317226444" target="_blank" className="hover:text-[#a35f3f]">Message Silve</a>
      </div>
    </section>
  );
}
