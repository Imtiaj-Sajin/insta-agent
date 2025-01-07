// import TwitterNavbar from "@/components/twitterNavbar";
// import "../styles/globals.css";
import { Inter } from "next/font/google";
import { NextAuthProvider } from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Commentzap",
  description: "One stop automation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* <body className={inter.className + " flex flex-row"}> */}
      <body style={{margin:0}}>
        <NextAuthProvider>
          {/* <TwitterNavbar /> */}
          {children}
        </NextAuthProvider>
      </body>
    </html>
  );
}
