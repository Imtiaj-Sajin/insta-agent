"use client";

import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Messages from "../../components/Conversations/Messages";
import Settings from "../../components/Settings";
import Automation from "./admin/automation";
import Chats from "../../components/Chats";
import "../../styles/globals.css"
import Agent from "./admin/Agents";
import Updates from "./admin/Updates";

import Insights from "@/components/Insights/Insights";
import TestingSajin from "@/components/TestingSajin"
import HeaderUI from "@/utils/header";


export default function NavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedContent, setSelectedContent] = useState("home");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const renderContent = () => {
    switch (selectedContent) {
      case "updates":
        return <Updates/>;
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
      // case "testing":
      //     return <TestingSajin/>
      default:
        return <Messages/>;
    }
  };

  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);
  
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
