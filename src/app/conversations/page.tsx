// src/app/conversations/page.tsx
import React, { useState, useEffect } from 'react';

const ConversationsPage = () => {
    const [conversations, setConversations] = useState<any[]>([]);
    const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);

    useEffect(() => {
        // Fetch conversations
        const fetchConversations = async () => {
            try {
                const response = await fetch('/api/fetch-conversations');
                const data = await response.json();

                if (response.ok) {
                    setConversations(data.conversations);
                } else {
                    setError(data.error || 'Failed to fetch conversations');
                }
            } catch (error) {
                setError('Error fetching conversations');
                console.error('Error:', error);
            }
        };

        fetchConversations();

        // Optionally, retrieve the access token from wherever you store it (e.g., cookies, localStorage)
        const storedAccessToken = localStorage.getItem('accessToken');
        if (storedAccessToken) {
            setAccessToken(storedAccessToken);
        }
    }, []);

    // Fetch messages for the selected conversation
    const fetchMessages = async (conversationId: string) => {
        if (!accessToken) {
            setError('Access token is missing');
            return;
        }

        try {
            const response = await fetch(`/api/fetch-messages?accessToken=${accessToken}&conversationId=${conversationId}`);
            const data = await response.json();

            if (response.ok) {
                setMessages(data.messages || []);
            } else {
                setError(data.error_message || 'Failed to fetch messages');
            }
        } catch (error) {
            setError('Error fetching messages');
            console.error('Error:', error);
        }
    };

    const handleConversationClick = (conversationId: string) => {
        setSelectedConversationId(conversationId);
        fetchMessages(conversationId);
    };

    return (
        <div>
            <h1>Conversations</h1>
            {error && <p>Error: {error}</p>}
            <div className="conversation-list">
                {conversations.map((conversation) => (
                    <button
                        key={conversation.conversationId}
                        onClick={() => handleConversationClick(conversation.conversationId)}
                        className="conversation-button"
                    >
                        <img
                            src={conversation.userPhoto}
                            alt="User photo"
                            style={{ width: 40, height: 40, borderRadius: '50%' }}
                        />
                        <div>
                            <p><strong>{conversation.userId}</strong></p>
                            <p>{conversation.lastMessage}</p>
                            <p>{new Date(conversation.lastMessageTime).toLocaleString()}</p>
                        </div>
                    </button>
                ))}
            </div>

            {selectedConversationId && (
                <div className="messages">
                    <h2>Messages</h2>
                    {messages.length === 0 ? (
                        <p>No messages found for this conversation.</p>
                    ) : (
                        <ul>
                            {messages.map((message, index) => (
                                <li key={index}>
                                    <strong>{message.from?.name}: </strong>{message.message}
                                    <p>{new Date(message.created_time).toLocaleString()}</p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
        </div>
    );
};

export default ConversationsPage;
