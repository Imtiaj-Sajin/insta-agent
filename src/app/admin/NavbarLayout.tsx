"use client";

import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Messages from "../../components/Conversations/Messages";
import Settings from "../../components/Settings/Settings";
import Automation from "./admin/automation";
import Chats from "../../components/Chats";
import "../../styles/globals.css"
import Agent from "./admin/Agents";
import Notification from "./admin/Notification";
import Insights from "@/components/Insights/Insights";
import HeaderUI from "@/utils/header";


export default function NavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedContent, setSelectedContent] = useState("home");
  const [isMobile, setIsMobile] = useState(false);
  // const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize(); // Set the initial value
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const renderContent = () => {
    switch (selectedContent) {    
      case "messages":
        return <Messages/>;
      case "settings":
        return <Settings/>;
      case "automation":  
        return <Automation/>;
      case "chats":  
        return <Chats/>;
      case "agents":  
        return <Agent/>;
      case "insights":
        return <Insights/>;
      case "notification":
        return <Notification/>;
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
