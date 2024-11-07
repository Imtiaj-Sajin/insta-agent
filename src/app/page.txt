"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';

interface Message {
  id: string;
  from: { name: string };
  message: string;
}

const MessagesPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        // Log the environment variables to verify they are accessible
        console.log("INSTAGRAM_ACCESS_TOKEN:", process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN);
        console.log("INSTAGRAM_BUSINESS_ACCOUNT_ID:", process.env.NEXT_PUBLIC_INSTAGRAM_BUSINESS_ACCOUNT_ID);

        const response = await axios.get(
          `https://graph.facebook.com/v16.0/${process.env.NEXT_PUBLIC_INSTAGRAM_BUSINESS_ACCOUNT_ID}/conversations`,
          {
            params: {
              access_token: process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN,
              fields: "senders,messages{message}",
            },
          }
        );

        const formattedMessages = response.data.data.map((msg: any) => ({
          id: msg.id,
          from: msg.senders?.data[0] || { name: "Unknown" },
          message: msg.messages?.data[0]?.message || "No message content",
        }));

        setMessages(formattedMessages);
      } catch (err) {
        console.error("Error fetching messages:", err);
        setError("Failed to fetch messages. Check console for details.");
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Instagram Messages</h1>

      {error && <p className="text-red-500">{error}</p>}

      <div className="messages-list space-y-4">
        {messages.length > 0 ? (
          messages.map((msg) => (
            <div key={msg.id} className="border p-3 rounded">
              <p><strong>From:</strong> {msg.from.name}</p>
              <p><strong>Message:</strong> {msg.message}</p>
            </div>
          ))
        ) : (
          <p>No messages available.</p>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
