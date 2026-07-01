"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#story", label: "Our Story" },
    { href: "#experience", label: "The Evening" },
    { href: "#menu", label: "The Table" },
    { href: "#gallery", label: "Gallery" },
    { href: "#reserve", label: "Reserve" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 nav ${scrolled ? "nav-scrolled" : ""}`}>
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#hero" className="font-serif text-[22px] tracking-[-0.4px]">da Silve</a>

        <div className="hidden md:flex items-center gap-9 text-sm">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-[#a35f3f] transition-colors">{l.label}</a>
          ))}
          <a href="#reserve" className="btn btn-primary text-xs tracking-[1.5px] px-8 py-[11px]">Reserve</a>
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="md:hidden px-6 pb-8 bg-[#f8f4ed] text-lg border-t">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="block py-3" onClick={() => setOpen(false)}>{l.label}</a>
          ))}
        </div>
      )}
    </nav>
  );
}
