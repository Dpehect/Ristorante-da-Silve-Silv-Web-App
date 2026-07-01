// This file is deprecated. The new GSAP version is Reservation.tsx
// You can delete this file.

// Zod schema — strict and thoughtful validation for the experience
const reservationSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(8, "Please include your phone number"),
  date: z.string().min(1, "Please choose a date"),
  time: z.string().min(1, "Please choose a time"),
  guests: z.number().min(1).max(8, "We can comfortably seat up to 8 guests"),
  message: z.string().max(480, "Please keep your note under 480 characters").optional(),
  dietary: z.string().max(240).optional(),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

export default function ReservationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [confirmedName, setConfirmedName] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      guests: 2,
      time: "20:00",
    },
  });

  const onSubmit = async (data: ReservationFormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/reservations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Something went wrong");
      }

      // Success: beautiful state
      setConfirmedName(data.fullName.split(" ")[0] || data.fullName);
      setIsSuccess(true);
      toast.success("Your place has been held. We look forward to welcoming you.", {
        duration: 5200,
      });

      // Reset form underneath success state
      reset();
    } catch (err: any) {
      toast.error(err.message || "We could not save your reservation. Please try again or call us.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
    setConfirmedName("");
  };

  // Nice minimum date — today + a little buffer
  const minDate = new Date();
  minDate.setDate(minDate.getDate() + 1);
  const minDateStr = minDate.toISOString().split("T")[0];

  return (
    <section id="reserve" className="section max-w-3xl mx-auto px-6 pt-16 pb-24">
      <div className="text-center mb-12">
        <div className="font-mono text-[11px] tracking-[4px] text-[#c46b4e]">JOIN US</div>
        <h2 className="font-serif text-6xl tracking-[-1.5px] text-[#2c2522] mt-2">Reserve Your Place</h2>
        <p className="mt-4 text-[#5c524b] max-w-xs mx-auto text-[14.5px]">
          We hold a small table for you. Tell us when you would like to come.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-white border border-[#d9d0c2] rounded-3xl p-9 md:p-14"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-8">
                {/* Full Name */}
                <div className="space-y-2">
                  <label className="block text-xs tracking-[1.5px] text-[#81746a]">YOUR NAME</label>
                  <input
                    {...register("fullName")}
                    type="text"
                    placeholder="Elena Rossi"
                    className="input w-full rounded-2xl px-6 py-3.5"
                  />
                  {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName.message}</p>}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="block text-xs tracking-[1.5px] text-[#81746a]">EMAIL</label>
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="you@family.com"
                    className="input w-full rounded-2xl px-6 py-3.5"
                  />
                  {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email.message}</p>}
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <label className="block text-xs tracking-[1.5px] text-[#81746a]">PHONE</label>
                  <input
                    {...register("phone")}
                    type="tel"
                    placeholder="+39 331 722 6444"
                    className="input w-full rounded-2xl px-6 py-3.5"
                  />
                  {errors.phone && <p className="text-xs text-red-600 mt-1">{errors.phone.message}</p>}
                </div>

                {/* Guests */}
                <div className="space-y-2">
                  <label className="block text-xs tracking-[1.5px] text-[#81746a]">NUMBER OF GUESTS</label>
                  <div className="relative">
                    <Users className="absolute left-6 top-4 text-[#81746a]" size={16} />
                    <input
                      {...register("guests", { valueAsNumber: true })}
                      type="number"
                      min={1}
                      max={8}
                      className="input w-full rounded-2xl pl-12 py-3.5"
                    />
                  </div>
                  {errors.guests && <p className="text-xs text-red-600 mt-1">{errors.guests.message}</p>}
                </div>

                {/* Date */}
                <div className="space-y-2">
                  <label className="block text-xs tracking-[1.5px] text-[#81746a]">PREFERRED DATE</label>
                  <div className="relative">
                    <Calendar className="absolute left-6 top-4 text-[#81746a]" size={16} />
                    <input
                      {...register("date")}
                      type="date"
                      min={minDateStr}
                      className="input w-full rounded-2xl pl-12 py-[15px] text-sm"
                    />
                  </div>
                  {errors.date && <p className="text-xs text-red-600 mt-1">{errors.date.message}</p>}
                </div>

                {/* Time Slots — beautiful select */}
                <div className="space-y-2">
                  <label className="block text-xs tracking-[1.5px] text-[#81746a]">TIME</label>
                  <div className="relative">
                    <Clock className="absolute left-6 top-[17px] text-[#81746a]" size={16} />
                    <select
                      {...register("time")}
                      className="input w-full rounded-2xl pl-12 py-3.5 appearance-none"
                    >
                      {TIME_SLOTS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Message / Dietary */}
              <div className="grid md:grid-cols-2 gap-x-6 gap-y-8">
                <div className="space-y-2 md:col-span-1">
                  <label className="block text-xs tracking-[1.5px] text-[#81746a]">ANYTHING WE SHOULD KNOW?</label>
                  <textarea
                    {...register("message")}
                    rows={3}
                    placeholder="Anniversary, birthday, first visit to Puglia..."
                    className="input w-full rounded-2xl px-6 py-4 resize-y"
                  />
                </div>
                <div className="space-y-2 md:col-span-1">
                  <label className="block text-xs tracking-[1.5px] text-[#81746a]">DIETARY REQUIREMENTS</label>
                  <textarea
                    {...register("dietary")}
                    rows={3}
                    placeholder="Vegetarian, allergies, preferences..."
                    className="input w-full rounded-2xl px-6 py-4 resize-y"
                  />
                  <div className="text-[11px] text-[#81746a]">We will always do our best to accommodate.</div>
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full rounded-2xl py-[17px] text-base tracking-[0.015em] disabled:opacity-75 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Holding your seat..." : "Hold a Place at Our Table"}
                </button>
                <p className="text-center text-[11px] mt-4 text-[#81746a] tracking-widest">
                  WE WILL CONFIRM BY PHONE OR EMAIL WITHIN 24 HOURS
                </p>
              </div>
            </form>
          </motion.div>
        ) : (
          // Elegant success state
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="success-state bg-white border border-[#d9d0c2] rounded-3xl px-10 py-16 text-center"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f4efe6] mb-7">
              <Check className="text-[#c46b4e]" size={38} />
            </div>

            <h3 className="font-serif text-4xl text-[#2c2522] tracking-[-0.6px]">We’re holding a seat for you.</h3>
            <p className="mt-3 text-[#5c524b] max-w-sm mx-auto">
              Thank you, {confirmedName}. We can’t wait to welcome you into our home.
            </p>

            <div className="my-8 text-sm text-[#81746a] max-w-[280px] mx-auto">
              You will receive a confirmation shortly. If you need to change anything, simply reply to our message or call Silve.
            </div>

            <button
              onClick={resetForm}
              className="btn-outline rounded-2xl px-9 py-3 text-sm"
            >
              Reserve another evening
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
