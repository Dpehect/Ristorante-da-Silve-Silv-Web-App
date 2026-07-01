import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { z } from "zod";
import type { Reservation, ReservationInput } from "@/lib/types";
import { generateId } from "@/lib/utils";

/**
 * POST /api/reservations
 *
 * Validates the incoming reservation using Zod, then appends
 * it to data/reservations.json using Node fs/promises.
 *
 * This is a deliberate portfolio choice: 100% file-based backend.
 * No external database. Transparent. Easy to inspect.
 */

// Same schema as the frontend for safety
const reservationSchema = z.object({
  fullName: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(8),
  date: z.string(),
  time: z.string(),
  guests: z.union([z.number(), z.string()]).transform((val) =>
    typeof val === "string" ? parseInt(val, 10) : val
  ).pipe(z.number().min(1).max(8)),
  message: z.string().max(480).optional().default(""),
  dietary: z.string().max(240).optional().default(""),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate strictly
    const validated: ReservationInput = reservationSchema.parse(body);

    // Read existing reservations
    const filePath = path.join(process.cwd(), "data", "reservations.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    const existing: Reservation[] = JSON.parse(fileContents);

    // Build new reservation
    const newReservation: Reservation = {
      ...validated,
      id: generateId(),
      submittedAt: new Date().toISOString(),
    };

    // Append & write back
    const updated = [...existing, newReservation];
    await fs.writeFile(filePath, JSON.stringify(updated, null, 2), "utf8");

    return NextResponse.json({ 
      success: true, 
      reservation: newReservation 
    });
  } catch (error: any) {
    console.error("Reservation error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Please check your details and try again." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "We were unable to save your reservation. Please call us." },
      { status: 500 }
    );
  }
}

// Optional: GET all reservations (for the admin page)
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "reservations.json");
    const contents = await fs.readFile(filePath, "utf8");
    const reservations: Reservation[] = JSON.parse(contents);

    return NextResponse.json({ success: true, reservations });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Could not load reservations." },
      { status: 500 }
    );
  }
}
