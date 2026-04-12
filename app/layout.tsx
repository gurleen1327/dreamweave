import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dreamweave — Your dreams. Your mythology.",
  description: "Log your dreams every morning. Dreamweave finds the hidden symbols, patterns and personal mythology in your sleep over time.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="google-site-verification" content="a4r7e-XTAT7_5yuak06pPh-WcVGaGcE8Pt4byhjCgAI" />
      </head>
      <body>{children}</body>
    </html>
  );
}