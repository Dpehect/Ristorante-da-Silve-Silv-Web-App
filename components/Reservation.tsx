"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { gsap } from "gsap";
import { toast } from "sonner";

const schema = z.object({
  fullName: z.string().min(3),
  email: z.string().email(),
  phone: z.string().min(8),
  date: z.string(),
  time: z.string(),
  guests: z.coerce.number().min(1).max(8),
  message: z.string().optional(),
  dietary: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const timeSlots = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

export default function Reservation() {
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { guests: 2, time: "20:00" },
  });

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();

      if (!json.success) throw new Error();

      // GSAP success animation
      setSubmitted(true);
      toast.success("Your table is being prepared.");

      if (formRef.current) {
        gsap.to(formRef.current, {
          opacity: 0,
          y: 30,
          duration: 0.4,
          onComplete: () => {
            reset();
            setSubmitted(false);
          },
        });
      }
    } catch {
      toast.error("Could not hold the table. Please call us.");
    }
  };

  return (
    <section id="reserve" className="section max-w-[660px] mx-auto px-6 pt-14 pb-24">
      <div className="text-center mb-10">
        <span className="text-xs tracking-[3.5px] text-[#a35f3f]">JOIN US</span>
        <h3 className="serif mt-2 text-[52px] tracking-[-1.4px]">Reserve your place</h3>
      </div>

      {!submitted ? (
        <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <input {...register("fullName")} placeholder="Full name" className="input" />
            <input {...register("email")} type="email" placeholder="Email" className="input" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <input {...register("phone")} placeholder="Phone" className="input" />
            <input type="date" {...register("date")} className="input" />
            <select {...register("time")} className="input">
              {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <input type="number" {...register("guests")} className="input" min="1" max="8" placeholder="Guests" />
            <input {...register("dietary")} placeholder="Dietary requests" className="input" />
          </div>

          <textarea {...register("message")} className="input h-28" placeholder="Message for Silve and Maria" />

          <button type="submit" className="btn btn-primary w-full mt-3 text-base">
            HOLD MY PLACE AT THE TABLE
          </button>
        </form>
      ) : (
        <div className="success-state text-center py-12 border border-[#d9d0c1] rounded-3xl bg-[#f8f4ed]">
          <p className="text-[#a35f3f] text-sm tracking-widest">WE ARE READY FOR YOU</p>
          <p className="serif text-[38px] mt-4 tracking-tight">Your seat is waiting.</p>
          <p className="text-[#5c5146] mt-3 max-w-xs mx-auto">You’ll receive confirmation shortly. We look forward to having you at our table.</p>
        </div>
      )}
    </section>
  );
}
