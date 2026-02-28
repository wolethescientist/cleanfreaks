import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Clean Freaks - Professional Cleaning Services",
  description: "Book your quarterly cleaning sessions with Clean Freaks. Quality assurance, dedicated support, and reliable service.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${jakartaSans.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
