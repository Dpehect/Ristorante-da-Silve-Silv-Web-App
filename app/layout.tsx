import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { LenisProvider } from "@/components/providers/LenisProvider";

// Premium typography - refined and emotional
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "da Silve • Ristorante in Fasano",
  description: "An intimate table in Fasano. Maria cooks with the day's harvest. Silve serves with quiet warmth. No written menu — only what feels right that evening.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#F7F4EE] text-[#1C1714]">
        <LenisProvider>
          {children}
        </LenisProvider>
        <Toaster position="top-center" closeButton richColors />
      </body>
    </html>
  );
}
