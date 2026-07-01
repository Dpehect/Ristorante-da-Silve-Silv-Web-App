import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { MenuData } from "@/lib/types";

/**
 * GET /api/menu
 * Reads the seasonal menu from the JSON file system.
 * This is our "database". Pure file-based architecture — intentional.
 */
export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "menu.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    const menuData: MenuData = JSON.parse(fileContents);

    return NextResponse.json({ success: true, data: menuData });
  } catch (error) {
    console.error("Failed to read menu.json:", error);
    return NextResponse.json(
      { success: false, error: "Could not load the menu right now." },
      { status: 500 }
    );
  }
}
