// src/app/layout.tsx
'use client'; 
import type { Metadata } from "next";
import localFont from "next/font/local";
import '../../styles/globals.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import NavbarLayout from "@/app/admin/NavbarLayout";
const queryClient = new QueryClient();

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

// export const metadata: Metadata = {
//   title: "Responsive Layout App",
//   description: "Responsive layout with dynamic navbar",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NavbarLayout>{children} </NavbarLayout>
      </body>
    </html>
   </QueryClientProvider>
  );
}
