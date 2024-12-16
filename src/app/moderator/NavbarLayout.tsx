"use client";

import React, { useState } from "react";
import Navbar from "./Navbar";
import Messages from "../../components/Conversations/Messages";
import Settings from "../../components/Settings/Settings";
import Automation from "../admin/admin/automation";
import Chats from "../../components/Chats";
import Profile from '../../components/profile/moderatorProfile';
import Insights from "@/components/Insights/Insights";

import "../../styles/globals.css"
import "../../styles/index.css";
import { ImOpt } from "react-icons/im";
import '../admin/admin/Automation.css';


// import Agent from "../admin/admin/Agents";
// import Updates from "../admin/admin/Updates";

export default function NavbarLayout({
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
