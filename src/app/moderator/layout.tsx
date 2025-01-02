// src/app/layout.tsx
"use client"
import localFont from "next/font/local";
import '../../styles/globals.css';
import React, { useState } from "react";
import Messages from "../../components/Conversations/Messages";
import Settings from "../../components/Settings/Settings";
import Chats from "../../components/Chats";
import Profile from '../../components/profile/moderatorProfile';
import Insights from "@/components/Insights/Insights";
import { FaBell, FaUser, FaComments } from "react-icons/fa";
import { ImStatsBars2 } from "react-icons/im";
import "../../styles/index.css";
import '../admin/admin/Automation.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import HeaderUI from "@/utils/header";
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <QueryClientProvider client={queryClient}>
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NavbarLayout>{children}</NavbarLayout>
      </body>
    </html>
    </QueryClientProvider>
  );
}

type NavbarProps = {
  onSelect: (section: string) => void;
};

function NavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedContent, setSelectedContent] = useState("home");
  const [isMobile, setIsMobile] = useState(false);

  const renderContent = () => {
    switch (selectedContent) {
      case "updates":
        return <Chats/>;
      case "messages":
        return <Messages/>;
      case "settings":
        return <Settings/>;
      case "insights":  
        return <Insights/>;
      case "profile":  
        return <Profile/>;
      default:
        return <Messages/>;
    }
  };

  return (
    <div className="app">
      <Navbar onSelect={setSelectedContent} />
      <main className="content" >
      {!isMobile?<HeaderUI/>:<></>}
        {renderContent()}
        {children}
      </main>
    </div>
  );
}

function Navbar({ onSelect }: NavbarProps) {
  return (
    <nav className="navbar flex space-x-4 p-4 bg-gray-100 shadow-md" >
    <svg className="logo-img" xmlns="http://www.w3.org/2000/svg" width="82" height="60" fill="none" viewBox="0 0 82 40"><path fill="#FFD43D" d="M73.365 19.71c0 2.904-2.241 5.31-5.27 5.31-3.03 0-5.228-2.406-5.228-5.31 0-2.905 2.199-5.312 5.228-5.312s5.27 2.407 5.27 5.311Z"></path><path fill="#FF0C81" d="M48.764 19.544c0 2.946-2.323 5.145-5.27 5.145-2.904 0-5.227-2.2-5.227-5.145 0-2.947 2.323-5.104 5.228-5.104 2.946 0 5.27 2.158 5.27 5.104Z"></path><path fill="#11EEFC" d="M20.074 25.02c3.029 0 5.27-2.406 5.27-5.31 0-2.905-2.241-5.312-5.27-5.312-3.03 0-5.228 2.407-5.228 5.311 0 2.905 2.199 5.312 5.228 5.312Z"></path><path fill="#171A26" d="M68.095 30.54c-6.307 0-11.12-4.897-11.12-10.872 0-5.934 4.855-10.83 11.12-10.83 6.349 0 11.162 4.938 11.162 10.83 0 5.975-4.855 10.871-11.162 10.871Zm0-5.52c3.03 0 5.27-2.406 5.27-5.31 0-2.905-2.24-5.312-5.27-5.312-3.029 0-5.228 2.407-5.228 5.311 0 2.905 2.199 5.312 5.228 5.312ZM43.08 40c-4.813 0-8.506-2.116-10.373-5.934l4.896-2.655c.913 1.784 2.614 3.195 5.394 3.195 3.486 0 5.85-2.448 5.85-6.473v-.374c-1.12 1.411-3.111 2.49-6.016 2.49-5.768 0-10.373-4.481-10.373-10.581 0-5.934 4.813-10.788 11.12-10.788 6.431 0 11.162 4.605 11.162 10.788v8.299C54.74 35.27 49.76 40 43.08 40Zm.415-15.311c2.946 0 5.27-2.2 5.27-5.145 0-2.947-2.324-5.104-5.27-5.104-2.905 0-5.228 2.158-5.228 5.104s2.323 5.145 5.228 5.145ZM20.074 30.54c-6.307 0-11.12-4.897-11.12-10.872 0-5.934 4.854-10.83 11.12-10.83 6.348 0 11.162 4.938 11.162 10.83 0 5.975-4.855 10.871-11.162 10.871Zm0-5.52c3.029 0 5.27-2.406 5.27-5.31 0-2.905-2.241-5.312-5.27-5.312-3.03 0-5.228 2.407-5.228 5.311 0 2.905 2.199 5.312 5.228 5.312ZM0 0h5.892v30H0V0ZM82 6.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0Z"></path></svg>
    <button onClick={() => onSelect("messages")} className="flex items-center space-x-2" style={{justifyContent:'left'}}>
            <FaComments />
        <span>Message</span>
      </button>
      <button onClick={() => onSelect("insights")} className="flex items-center space-x-2" style={{justifyContent:'left'}}>
        <ImStatsBars2 />
        <span>Insights</span>
      </button>
      <button onClick={() => onSelect("updates")} className="flex items-center space-x-2" style={{justifyContent:'left'}}>
        <FaBell />
        <span>Updates</span>
      </button>
      <button onClick={() => onSelect("profile")} className="flex items-center space-x-2" style={{justifyContent:'left'}}>
        <FaUser />
        <span>Profile</span>
      </button>
      {/* <button onClick={() => onSelect("chats")} className="flex items-center space-x-2">
        <FaComments />
        <span>Chats</span>
      </button> */}
      {/* <button onClick={() => onSelect("settings")} className="flex items-center space-x-2" style={{justifyContent:'left'}}>
        <FaCog />
        <span>Settings</span>
      </button> */}
    </nav>
  );
}
