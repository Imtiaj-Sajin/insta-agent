'use client';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://nkf448kn-3001.asse.devtunnels.ms/'); // Replace with your Socket.IO server URL

export default function Settings() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      console.log("Received data:", data);
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, []);


  return (
    <div>
      <h1>Client Page</h1>
      <div>
        {messages.map((msg, idx) => (
          <p key={idx}>{msg}</p>
        ))}
      </div>
    </div>
  );
}
