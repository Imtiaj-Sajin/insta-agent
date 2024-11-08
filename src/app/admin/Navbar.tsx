// components/Navbar.tsx

"use client";

import React from "react";
import { FaEnvelope, FaRobot, FaBell, FaUser, FaComments, FaCog } from "react-icons/fa";

type NavbarProps = {
  onSelect: (section: string) => void;
};

export default function Navbar({ onSelect }: NavbarProps) {
  return (
    <nav className="navbar flex space-x-4 p-4 bg-gray-100 shadow-md" >
      <button onClick={() => onSelect("messages")} className="flex items-center space-x-2" style={{justifyContent:'left'}}>
        <FaComments />
        <span>Message</span>
      </button>
      <button onClick={() => onSelect("automation")} className="flex items-center space-x-2" style={{justifyContent:'left'}}>
        <FaRobot />
        <span>Automation</span>
      </button>
      <button onClick={() => onSelect("updates")} className="flex items-center space-x-2" style={{justifyContent:'left'}}>
        <FaBell />
        <span>Updates</span>
      </button>
      <button onClick={() => onSelect("agents")} className="flex items-center space-x-2" style={{justifyContent:'left'}}>
        <FaUser />
        <span>Agents</span>
      </button>
      {/* <button onClick={() => onSelect("chats")} className="flex items-center space-x-2">
        <FaComments />
        <span>Chats</span>
      </button> */}
      <button onClick={() => onSelect("settings")} className="flex items-center space-x-2" style={{justifyContent:'left'}}>
        <FaCog />
        <span>Settings</span>
      </button>
    </nav>
  );
}
