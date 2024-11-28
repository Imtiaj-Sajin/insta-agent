'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const Settings = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // Create socket connection
    const newSocket = io('https://nkf448kn-4000.asse.devtunnels.ms', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    // Set up connection and event listeners
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('webhook-event', (payload: any) => {
      console.log('Received payload:', payload);
      setMessages((prev) => [...prev, JSON.stringify(payload, null, 2)]);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    // Store socket instance
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div>
      <h1>Webhook Events</h1>
      <div>
        {messages.length === 0 ? (
          <p>No messages received yet.</p>
        ) : (
          messages.map((msg, idx) => (
            <pre key={idx} style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
              {msg}
            </pre>
          ))
        )}
      </div>
    </div>
  );
};

export default Settings;