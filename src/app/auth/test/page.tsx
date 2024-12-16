//src/app/auth/test/page.tsx
"use client";

import React, { useState, useEffect, useRef } from "react";

type Message = {
  id: string;
  from: { username: string; id: string };
  to: { data: { username: string; id: string }[] };
  message: string;
  created_time: string;
  attachments?: any;
};

const Messages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [nextUrl, setNextUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [messageIds, setMessageIds] = useState<Set<string>>(new Set());


  useEffect(() => {
    // Initial fetch
    fetchMessages();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        containerRef.current &&
        containerRef.current.scrollTop + containerRef.current.clientHeight >=
          containerRef.current.scrollHeight - 100 // Trigger when near bottom
      ) {
        if (nextUrl && !loading) {
          fetchMessages(nextUrl);
        }
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [nextUrl, loading]);

  const fetchMessages = async (url?: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        url || `/api/fetch-message-scroll` // Your API route to fetch messages
      );
      const data = await response.json();

      // Determine the structure of the response
      //const newMessages = data.messages?.data || data.data || [];
      const newMessages = (data.messages?.data || data.data || []).filter(
        (message: Message) => {
          if (!messageIds.has(message.id)) {
            messageIds.add(message.id);  // Add the new message ID to the set
            return true;
          }
          return false; // Skip duplicate messages
        }
      )
      const pagingNext = data.messages?.paging?.next || data.paging?.next || null;

      // Update messages state
      setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      setNextUrl(pagingNext);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      style={{ height: "500px", overflowY: "scroll", border: "1px solid #ccc" }}
    >
      <ul>
        {messages.map((message) => (
          <li key={message.id}>
            <p>
              <strong>{message.from.username}</strong>: {message.message}
            </p>
            <small>{new Date(message.created_time).toLocaleString()}</small>
          </li>
        ))}
      </ul>
      {loading && <p>Loading more messages...</p>}
    </div>
  );
};

export default Messages;
