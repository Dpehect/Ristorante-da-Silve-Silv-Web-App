"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const schema = z.object({
  fullName: z.string().min(3, "Please enter your name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(8),
  date: z.string().min(1, "Choose a date"),
  time: z.string(),
  guests: z.number().min(1, "Please select at least 1 guest").max(8, "Maximum 8 guests"),
  message: z.string().optional(),
  dietary: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

const timeSlots = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

export default function Reservation() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { 
      guests: 2, 
      time: "20:00" 
    } as const,
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const json = await res.json();

      if (!json.success) throw new Error();

      setIsSuccess(true);
      toast.success("Your table is being prepared.", { duration: 4200 });
      reset();
    } catch {
      toast.error("We could not hold your seat. Please call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="reserve" className="section max-w-[680px] mx-auto px-6 pt-16 pb-28">
      <div className="text-center mb-12">
        <div className="text-[#A36A4E] text-xs tracking-[3.5px]">JOIN US AT THE TABLE</div>
        <h3 className="mt-3 text-[54px] leading-none tracking-[-1.2px]">Reserve your place</h3>
      </div>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <input {...register("fullName")} placeholder="Full name" className="input" />
                {errors.fullName && <p className="text-xs text-red-600 mt-1.5 ml-1">{errors.fullName.message}</p>}
              </div>
              <div>
                <input {...register("email")} placeholder="Email address" className="input" />
                {errors.email && <p className="text-xs text-red-600 mt-1.5 ml-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div>
                <input {...register("phone")} placeholder="Phone number" className="input" />
              </div>
              <div>
                <input type="date" {...register("date")} className="input" min="2026-07-03" />
              </div>
              <div>
                <select {...register("time")} className="input">
                  {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <input 
                type="number" 
                {...register("guests", { 
                  valueAsNumber: true 
                })} 
                className="input" 
                placeholder="Number of guests" 
                min="1" 
                max="8" 
              />
              {errors.guests && (
                <p className="text-xs text-red-600 mt-1.5 ml-1">{errors.guests.message}</p>
              )}
              <input {...register("dietary")} className="input" placeholder="Dietary requirements" />
            </div>

            <textarea 
              {...register("message")} 
              className="input min-h-[106px] resize-y" 
              placeholder="Anything you would like us to know?" 
            />

            <button 
              type="submit" 
              disabled={isSubmitting}
              className="btn btn-primary w-full mt-4 py-4 text-[15px] tracking-widest disabled:opacity-70"
            >
              {isSubmitting ? "HOLDING YOUR SEAT..." : "HOLD MY PLACE AT THE TABLE"}
            </button>
          </form>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="success-overlay text-center py-16 border border-[#D8D0C2] rounded-3xl bg-[#FFFBF5]"
          >
            <div className="mx-auto mb-7 text-[#A36A4E] text-xs tracking-[4px]">WE ARE READY</div>
            <div className="text-[46px] tracking-[-1.3px] leading-none mb-4">Your seat is waiting.</div>
            <p className="max-w-xs mx-auto text-[#524A43]">
              We look forward to welcoming you into our home. 
              You will receive a confirmation shortly.
            </p>
            <button 
              onClick={() => setIsSuccess(false)} 
              className="mt-9 text-sm underline underline-offset-4"
            >
              Reserve another evening
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
