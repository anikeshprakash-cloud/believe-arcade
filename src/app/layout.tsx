import type { Metadata } from "next";
import { Geist, Press_Start_2P } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  variable: "--font-press-start",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LassoQuote — AFC Richmond Arcade",
  description:
    "An 8-bit quote machine for Coach Ted Lasso. Press start and believe.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${pressStart.variable} h-full antialiased`}
    >
      <body className="arcade-room h-dvh overflow-hidden">{children}</body>
    </html>
  );
}
