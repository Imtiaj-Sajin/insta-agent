// components/Navbar.tsx

"use client";

import React from "react";
import { FaBell, FaUser, FaComments } from "react-icons/fa";
import { ImStatsBars2 } from "react-icons/im";

type NavbarProps = {
  onSelect: (section: string) => void;
};

export default function Navbar({ onSelect }: NavbarProps) {
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
