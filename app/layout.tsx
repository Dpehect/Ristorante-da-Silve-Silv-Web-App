import type { Metadata } from "next";
import { Playfair_Display, Inter, Playfair_Display_SC } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

// Elegant serif for the soul of the experience
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

// Refined sans for body text and UI
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

// A more decorative serif option for special moments
const playfairSC = Playfair_Display_SC({
  subsets: ["latin"],
  variable: "--font-playfair-sc",
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "da Silve • Ristorante in Fasano",
  description: "A table at home in Fasano. Intimate family-run restaurant in Puglia where Maria cooks whatever is fresh that day and Silve serves it with warmth. No menu — only heart.",
  icons: {
    icon: "/favicon.ico",
  },
  metadataBase: new URL("https://dasilve.example.com"),
  openGraph: {
    title: "da Silve • A table at home in Fasano, Puglia",
    description: "Experience the intimate warmth of a true family table in the heart of Puglia. Maria cooks. Silve serves. Come as you are.",
    images: [{ url: "/og-image.jpg" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} ${playfairSC.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#f9f5ed] text-[#2c2522]">
        {children}
        {/* Elegant toast notifications */}
        <Toaster 
          position="top-center" 
          richColors 
          closeButton 
          className="toaster group" 
        />
      </body>
    </html>
  );
}
