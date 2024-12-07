'use client';

import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';

const socket = io('https://nkf448kn-3001.asse.devtunnels.ms/'); 

export default function Settings() {
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      console.log("Received data:", data);
      const data1=parseWebhookPayload(JSON.parse(data))
      setMessages((prev) => [...prev, data1]);
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
          <pre key={idx} style={{ backgroundColor: '#f4f4f4', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
            {JSON.stringify(msg, null, 2)} {/* Format the object */}
          </pre>
        ))}
      </div>
    </div>
  );
}

function parseWebhookPayload(payload: any): any {
  console.log("hello")
  if (payload.object === 'instagram' && payload.entry) {
    console.log("hello payload")
    for (const entry of payload.entry) {
      console.log("hello payload entry")

      const messaging = entry.messaging;
      for (const event of messaging) {
        console.log("hello payload entry messaging")

        if (event.message) {
          console.log("hello payload entry messaging event")

          // Check for message type
          if (event.message.attachments && event.message.attachments.length > 0) {
            console.log("hello payload entry messaging event attachment")

            const attachmentType = event.message.attachments[0].type;
            return {
              type: `message_with_${attachmentType}`, // e.g., message_with_image, message_with_video
              senderId: event.sender.id,
              recipientId: event.recipient.id,
              timestamp: event.timestamp,
              content: event.message.attachments[0].payload.url,
            };
          } else {
            console.log("hello payload entry messaging event text")
            return {
              type: 'text_message',
              senderId: event.sender.id,
              recipientId: event.recipient.id,
              timestamp: event.timestamp,
              content: event.message.text,
            };
          }
        } else if (event.read) {
          // Handle message read event
          return {
            type: 'message_read',
            senderId: event.sender.id,
            recipientId: event.recipient.id,
            timestamp: event.timestamp,
            messageId: event.read.mid,
          };
        }
      }

      const changes = entry.changes || [];
      for (const change of changes) {
        if (change.field === 'comments') {
          // Handle comment events
          return {
            type: 'comment',
            commenterId: change.value.from.id,
            commenterUsername: change.value.from.username,
            mediaId: change.value.media.id,
            text: change.value.text,
            timestamp: entry.time,
          };
        }
      }
    }
  }

  // Default response if no recognizable event is found
  return { type: 'unknown_event', payload };
}
