"use client";

import React, { useState } from "react";
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
  guests: z.number().min(1).max(8),
  message: z.string().optional(),
  dietary: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

const timeSlots = ["19:00", "19:30", "20:00", "20:30", "21:00", "21:30"];

export default function Reservation() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, reset } = useForm<FormData>({
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

      setSubmitted(true);
      toast.success("Your table is being prepared.");

      // Elegant GSAP success transition
      setTimeout(() => {
        const form = document.querySelector("#reserve form");
        if (form) {
          gsap.to(form, {
            opacity: 0,
            y: 25,
            duration: 0.45,
            onComplete: () => {
              reset();
              setSubmitted(false);
            },
          });
        }
      }, 2100);
    } catch {
      toast.error("Could not hold your place. Please call us directly.");
    }
  };

  return (
    <section id="reserve" className="section max-w-[680px] mx-auto px-6 py-20">
      <div className="text-center mb-12">
        <span className="text-xs tracking-[3.5px] text-[#a35f3f]">JOIN US AT THE TABLE</span>
        <h3 className="serif text-[54px] tracking-[-1.6px] mt-3">Reserve your place</h3>
      </div>

      {!submitted ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input {...register("fullName")} placeholder="Full name" className="input" />
            <input {...register("email")} type="email" placeholder="Email" className="input" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <input {...register("phone")} placeholder="Phone" className="input" />
            <input type="date" {...register("date")} className="input" />
            <select {...register("time")} className="input">
              {timeSlots.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input 
              type="number" 
              {...register("guests", { valueAsNumber: true })} 
              className="input" 
              placeholder="Number of guests" 
              min="1" max="8" 
            />
            <input {...register("dietary")} placeholder="Dietary requests" className="input" />
          </div>

          <textarea {...register("message")} className="input h-24" placeholder="Message for the family" />

          <button type="submit" className="btn btn-primary w-full mt-4 text-base tracking-[1.5px]">
            HOLD MY PLACE
          </button>
        </form>
      ) : (
        <div className="success-state text-center py-16 border border-[#d9d0c1] rounded-3xl">
          <p className="text-[#a35f3f] text-sm tracking-widest">WE ARE READY</p>
          <p className="serif text-[44px] tracking-[-1px] mt-3">Your seat is waiting.</p>
          <p className="text-[#5c5146] mt-3">You will receive confirmation shortly.</p>
        </div>
      )}
    </section>
  );
}
