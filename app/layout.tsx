import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { LenisProvider } from "@/components/providers/LenisProvider";
import { GSAPProvider } from "@/components/providers/GSAPProvider";
import ScrollProgress from "@/components/ScrollProgress";
import PreloaderWrapper from "@/components/PreloaderWrapper";

// Elegant typography
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
  description: "Maria cooks. Silve serves. A small table in Fasano with no written menu — only what the day and the land offer.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-[#f8f4ed] text-[#2a211c]">
        <GSAPProvider>
          <LenisProvider>
            <PreloaderWrapper>
              <ScrollProgress />
              {children}
            </PreloaderWrapper>
          </LenisProvider>
        </GSAPProvider>
        <Toaster position="top-center" richColors closeButton />
      </body>
    </html>
  );
}
