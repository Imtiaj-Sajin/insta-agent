import React, { useState, useEffect } from 'react';
import axios from 'axios';

type Message = {
  id: string;
  snippet: string;
};

const Chats = () => {
  const [username, setUsername] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const accessToken = process.env.NEXT_PUBLIC_INSTAGRAM_ACCESS_TOKEN; // Your actual token

  useEffect(() => {
    // Function to fetch Instagram username and messages
    const fetchInstagramData = async () => {
      try {
        // Fetch the Instagram username
        const userResponse = await axios.get(
          `https://graph.instagram.com/me?fields=id,username&access_token=${accessToken}`
        );
        setUsername(userResponse.data.username);

        // Fetch Instagram messages
        const messageResponse = await axios.get(
          `https://graph.facebook.com/v16.0/${userResponse.data.id}/conversations?access_token=${accessToken}`
        );
        setMessages(messageResponse.data.data || []);
      } catch (error) {
        console.error("Error fetching Instagram data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramData();
  }, []);

  return (
    <div className="chats-container">
      <h1>Chats</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Connected Instagram Account: {username}</p>
          <h2>Messages</h2>
          {messages.length > 0 ? (
            <ul>
              {messages.map((message) => (
                <li key={message.id}>{message.snippet}</li>
              ))}
            </ul>
          ) : (
            <p>No messages found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default Chats;
