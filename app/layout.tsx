import type { Metadata } from "next";
import { Barlow_Semi_Condensed } from "next/font/google";
import "./globals.css";

const barlowSemiCondensed = Barlow_Semi_Condensed({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-barlow-semi',
});

export const metadata: Metadata = {
  title: "Agenda CR25 by @9gustin",
  description: "Agenda para Cosquín Rock 2025",
  manifest: '/manifest.json',
  themeColor: '#006533',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Agenda CR25 by @9gustin",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        <link rel="apple-touch-icon" href="/icon-192.png" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className={`${barlowSemiCondensed.variable} font-barlow antialiased`}>
        {children}
      </body>
    </html>
  );
}
