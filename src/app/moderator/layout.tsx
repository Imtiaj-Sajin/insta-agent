// src/app/layout.tsx

import type { Metadata } from "next";
import localFont from "next/font/local";
// import '../styles/globals.css';

import NavbarLayout from "@/app/admin/NavbarLayout";

const geistSans = localFont({
  src: "../fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "../fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Responsive Layout App",
  description: "Responsive layout with dynamic navbar",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NavbarLayout>{children}</NavbarLayout>
      </body>
    </html>
  );
}
