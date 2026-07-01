"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { href: "#story", label: "Our Story" },
    { href: "#experience", label: "The Evening" },
    { href: "#menu", label: "The Table" },
    { href: "#gallery", label: "In Our Home" },
    { href: "#reserve", label: "Reserve" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 navbar ${isScrolled ? "navbar-scrolled" : ""}`}>
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#hero" className="flex items-center gap-3">
          <span className="font-serif text-[21px] tracking-tight">da Silve</span>
          <span className="text-[9px] font-mono tracking-[3.5px] text-[#7A6F64] mt-1">FASANO</span>
        </a>

        <div className="hidden md:flex items-center gap-9 text-sm">
          {links.map(link => (
            <a key={link.href} href={link.href} className="text-[#524A43] hover:text-[#1C1714] transition-colors tracking-[-0.1px]">
              {link.label}
            </a>
          ))}
          <a href="#reserve" className="btn btn-primary px-7 py-2 text-xs tracking-[1.5px]">Reserve</a>
        </div>

        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t bg-[#F7F4EE] px-6 py-8 text-lg"
          >
            {links.map(l => (
              <a key={l.href} href={l.href} className="block py-[9px]" onClick={() => setMobileOpen(false)}>{l.label}</a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
