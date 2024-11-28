"use client";

import { useState, useEffect } from "react";
import { io } from "socket.io-client";

// Connect to the server
const socket = io("https://j7f0x0n5-3001.asse.devtunnels.ms/");

export default function Settings() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<String[]>([]);

  useEffect(() => {
    // Listen for messages from the server
    socket.on("receiveMessage", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const sendMessage = () => {
    if (username && message) {
      socket.emit("sendMessage", { username, message });
      setMessage(""); // Clear the input field after sending
    }
  };

  return (
    <div>
      <h1>Webhook Events</h1>
      <div>
        {messages.length === 0 ? (
          <p>No messages received yet.</p>
        ) : (
          messages.map((msg, idx) => (
            <pre key={idx} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              {message}
            </pre>
          ))
        )}
      </div>
    </div>
  );
};

