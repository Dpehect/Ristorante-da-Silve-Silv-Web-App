import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-[#D8D0C2] py-14 text-center text-xs text-[#7A6F64]">
      <div className="font-serif text-[#1C1714] tracking-tighter text-xl mb-1">da Silve</div>
      <div>Fasano, Puglia • +39 331 722 6444</div>
      <div className="mt-6">© {new Date().getFullYear()} Maria and Silve. No menu. Only heart.</div>
    </footer>
  );
}
