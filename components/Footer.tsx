import React from "react";

export default function Footer() {
  return (
    <footer className="border-t border-[#d9d0c2] bg-[#f4efe6] py-12">
      <div className="max-w-5xl mx-auto px-6 text-center text-[#81746a] text-xs tracking-widest">
        <div className="font-serif text-xl tracking-normal text-[#5c524b] mb-2">da Silve</div>
        <div>RISTORANTE • FASANO, PUGLIA</div>
        <div className="mt-6">© {new Date().getFullYear()} Maria &amp; Silve. All heart, no menu.</div>
        
        <div className="mt-3 text-[10px]">
          Via Tinella 18 • +39 331 722 6444
        </div>
      </div>
    </footer>
  );
}
