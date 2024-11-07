// components/Navbar.tsx
import NavbarLayout from "./NavbarLayout";

"use client";

import React from "react";

type NavbarProps = {
  onSelect: (section: string) => void;
};

export default function Navbar({ onSelect }: NavbarProps) {
  return (
    <nav>
      <button onClick={() => onSelect("messages")}>Message</button>
      <button onClick={() => onSelect("automation")}>Automation</button>
      <button onClick={() => onSelect("updates")}>Updates</button>
      <button onClick={() => onSelect("agents")}>Agents</button>
      <button onClick={() => onSelect("chats")}>Chats</button>
      <button onClick={() => onSelect("settings")}>Settings</button>
    </nav>
  );
}
