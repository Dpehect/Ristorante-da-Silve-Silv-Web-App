"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Reservation() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success">("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");
    // Simulate network request
    setTimeout(() => {
      setStatus("success");
    }, 2000);
  };

  return (
    <section className="py-48 px-8 md:px-24 bg-secondary text-primary relative overflow-hidden">
      {/* Subtle background element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-xl mx-auto relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-light tracking-wide mb-6">Join Our Table</h2>
        <p className="text-primary/60 mb-16 tracking-wide leading-relaxed">
          We accept only five reservations per evening. Please provide your details, and we will personally confirm your table.
        </p>

        <AnimatePresence mode="wait">
          {status !== "success" ? (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              onSubmit={handleSubmit}
              className="space-y-8 text-left"
            >
              <div className="space-y-2">
                <label className="text-xs tracking-widest uppercase text-accent">Name</label>
                <input required type="text" className="w-full bg-transparent border-b border-primary/20 pb-2 text-lg focus:outline-none focus:border-accent transition-colors" />
              </div>
              
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs tracking-widest uppercase text-accent">Date</label>
                  <input required type="date" className="w-full bg-transparent border-b border-primary/20 pb-2 text-lg focus:outline-none focus:border-accent transition-colors [&::-webkit-calendar-picker-indicator]:invert" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs tracking-widest uppercase text-accent">Guests</label>
                  <select required className="w-full bg-transparent border-b border-primary/20 pb-2 text-lg focus:outline-none focus:border-accent transition-colors appearance-none cursor-pointer">
                    {[1,2,3,4,5,6].map(n => <option key={n} value={n} className="bg-secondary">{n}</option>)}
                  </select>
                </div>
              </div>

              <motion.button
                type="submit"
                disabled={status === "submitting"}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-12 py-4 bg-primary text-secondary text-sm tracking-[0.2em] uppercase transition-all hover:bg-accent hover:text-primary relative overflow-hidden"
              >
                <span className={status === "submitting" ? "opacity-0" : "opacity-100"}>
                  Request Reservation
                </span>
                {status === "submitting" && (
                  <motion.div 
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="w-4 h-4 border-2 border-secondary/20 border-t-secondary rounded-full animate-spin" />
                  </motion.div>
                )}
              </motion.button>
            </motion.form>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.25, 1, 0.5, 1] }}
              className="py-12"
            >
              <h3 className="text-3xl font-light italic font-serif text-accent mb-4">A Presto</h3>
              <p className="text-primary/70 tracking-wide leading-relaxed">
                Your request has been received.<br/>Maria or Silve will contact you shortly to confirm.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
