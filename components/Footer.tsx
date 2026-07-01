import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-[#d9d0c1] py-12 text-center text-sm text-[#8a7b6c]">
      <div className="font-serif text-[#2a211c] text-2xl tracking-tighter">da Silve</div>
      <div className="mt-1 tracking-[1px]">FASANO • PUGLIA</div>
      <div className="mt-7 text-xs">© {new Date().getFullYear()} Maria &amp; Silve. A table with no menu.</div>
    </footer>
  );
}
