import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/providers/LenisProvider";
import PreloaderWrapper from "@/components/PreloaderWrapper";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Ristorante da Silve | Fasano",
  description: "A premium, intimate family-run restaurant in Fasano, Puglia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} antialiased`}>
        <LenisProvider>
          <PreloaderWrapper>
            {children}
          </PreloaderWrapper>
        </LenisProvider>
      </body>
    </html>
  );
}
