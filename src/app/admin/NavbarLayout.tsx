"use client";

import React, { useState } from "react";
import Navbar from "./Navbar";
import Messages from "../../components/Messages";
import Settings from "../../components/Settings";
import Automation from "./admin/automation";
import Chats from "../../components/Chats";
import "../../styles/globals.css"
import Agent from "./admin/Agents";

export default function NavbarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedContent, setSelectedContent] = useState("home");

  const renderContent = () => {
    switch (selectedContent) {
      case "updates":
        return <div>update Content</div>;
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
