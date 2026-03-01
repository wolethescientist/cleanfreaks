import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import "./globals.css";

const quicksand = Quicksand({
  variable: "--font-quicksand",
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
        className={`${quicksand.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
