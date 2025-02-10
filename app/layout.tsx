import type { Metadata } from "next";
import { Barlow_Semi_Condensed } from "next/font/google";
import "./globals.css";

const barlowSemiCondensed = Barlow_Semi_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow-semi',
});

export const metadata: Metadata = {
  title: "Cosquín Rock 2024",
  description: "Agenda para Cosquín Rock 2024",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${barlowSemiCondensed.variable} font-barlow antialiased`}>
        {children}
      </body>
    </html>
  );
}
