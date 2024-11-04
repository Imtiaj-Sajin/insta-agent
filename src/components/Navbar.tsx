// components/Navbar.tsx

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
    </nav>
  );
}
