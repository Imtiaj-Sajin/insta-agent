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
      <button onClick={() => onSelect("home")}>Home</button>
      <button onClick={() => onSelect("search")}>Search</button>
      <button onClick={() => onSelect("messages")}>Messages</button>
      <button onClick={() => onSelect("profile")}>Profile</button>
      <button onClick={() => onSelect("settings")}>Settings</button>
      <button onClick={() => onSelect("chats")}>Chats</button>
    </nav>
  );
}
