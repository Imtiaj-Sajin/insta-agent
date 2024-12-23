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
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <NavbarLayout>{children}</NavbarLayout>
      </body>
    </html>
  );
}

function NavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedContent, setSelectedContent] = useState("home");

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
      case "chats":  
        return <Chats/>;
      case "profile":  
        return <Profile/>;
      default:
        return <div>Home Content</div>;
    }
  };

  return (
    <div className="app">
      <Navbar onSelect={setSelectedContent} />
      <main className="content" >
        {renderContent()}
        {children}
      </main>
    </div>
  );
}



type NavbarProps = {
  onSelect: (section: string) => void;
};

function Navbar({ onSelect }: NavbarProps) {
  return (
    <nav className="navbar flex space-x-4 p-4 bg-gray-100 shadow-md" style={{background:'linear-gradient(135deg, #CB356B, #BD3F32);'}}>
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
