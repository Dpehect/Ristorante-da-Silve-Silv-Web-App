"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}

const NavLink = ({ href, children, onClick }: NavLinkProps) => (
  <a
    href={href}
    onClick={onClick}
    className="text-sm tracking-[0.02em] text-[#5c524b] transition-colors hover:text-[#2c2522] relative group"
  >
    {children}
    <span className="absolute -bottom-px left-0 w-0 h-px bg-[#c46b4e] transition-all group-hover:w-full" />
  </a>
);

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#story", label: "Our Story" },
    { href: "#experience", label: "The Experience" },
    { href: "#menu", label: "The Table" },
    { href: "#gallery", label: "Gallery" },
    { href: "#reserve", label: "Reserve" },
  ];

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 nav-blur ${
        isScrolled ? "nav-scrolled" : "bg-[#f9f5ed]/80"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo — intimate, personal */}
        <a href="#hero" className="flex items-center gap-2 group">
          <div className="text-[22px] font-semibold tracking-[-0.02em] text-[#2c2522] font-serif">
            da Silve
          </div>
          <div className="text-[10px] uppercase tracking-[3px] text-[#81746a] font-mono mt-1.5 group-hover:text-[#c46b4e] transition-colors">
            FASANO
          </div>
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-x-9 text-sm">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href}>
              {link.label}
            </NavLink>
          ))}
          <a
            href="#reserve"
            className="ml-3 px-6 py-2.5 text-sm rounded-full btn-primary text-[#f9f5ed] hover:bg-[#c46b4e] inline-flex items-center"
          >
            Reserve Your Place
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="md:hidden p-2 text-[#5c524b] hover:text-[#2c2522] transition-colors"
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Beautiful Mobile Menu with Framer Motion */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.38, ease: [0.23, 1, 0.32, 1] }}
            className="md:hidden border-t border-[#d9d0c2] bg-[#f9f5ed] overflow-hidden mobile-menu"
          >
            <div className="px-6 py-8 flex flex-col gap-y-6 text-base">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="text-[#2c2522] tracking-wide py-1"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#reserve"
                onClick={closeMobileMenu}
                className="mt-2 w-full text-center py-3.5 rounded-full bg-[#2c2522] text-[#f9f5ed] text-sm tracking-[0.02em]"
              >
                Reserve Your Place
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
