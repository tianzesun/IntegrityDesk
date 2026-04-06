import type { Metadata } from "next";
import { Bricolage_Grotesque, Outfit } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "800"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
});

export const metadata: Metadata = {
  title: "IntegrityDesk | Academic Integrity Platform",
  description: "The world's most powerful integrity platform. Unifying code plagiarism, essay detection, and AI content tracing.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body
        className={`${bricolage.variable} ${outfit.variable} font-body antialiased`}
      >
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
