'use client';
import { useEffect, useState } from 'react';

interface Message {
    from: { username: string; id: string };
    to: { data: { username: string; id: string }[] };
    message: string;
    created_time: string;
    id: string;
}

interface Conversation {
    id: string;
    messages: { data: Message[] };
    updated_time: string;
}

export default function Redirect() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const username = process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME;

    useEffect(() => {
        const fetchConversations = async (pageAccessToken: string) => {
            setLoading(true);
            try {
                const response = await fetch(`/api/fetch-messages?accessToken=${pageAccessToken}`, {
                    method: 'GET',
                });

                const data = await response.json();
                if (response.ok) {
                    setConversations(data.data || []);
                } else {
                    setError(data.error_message || 'Failed to fetch conversations');
                }
            } catch (err) {
                setError('Error fetching conversations');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        const exchangeToken = async (code: string) => {
            try {
                const tokenResponse = await fetch('/api/exchange-token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ code }),
                });
                const tokenData = await tokenResponse.json();
                if (tokenResponse.ok) {
                    setAccessToken(tokenData.access_token);
                    fetchConversations(tokenData.page_access_token);
                } else {
                    setError(tokenData.error_message || 'Failed to exchange token');
                }
            } catch (err) {
                setError('Error fetching access token');
                console.error('Error:', err);
            }
        };

        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        if (code) {
            exchangeToken(code);
        } else {
            setError('Authorization code not found');
        }
    }, []);

    const isMessageForCurrentUser = (message: Message): boolean => {
        // Check if the message is directed to the current user
        return message.to?.data?.some((recipient) => recipient.username === username);
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Left Panel: Conversation Buttons */}
            <div style={{ flex: 1, backgroundColor: 'blue', padding: '10px', overflowY: 'auto' }}>
                {conversations.map((conversation) => (
                    <button
                        key={conversation.id}
                        style={{
                            width: '100%',
                            margin: '5px 0',
                            padding: '10px',
                            color: 'white',
                            backgroundColor: 'darkblue',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            textAlign: 'left',
                        }}
                        onClick={() => setSelectedConversation(conversation)}
                    >
                        {conversation.messages?.data?.[0]?.to?.data?.[0]?.username === username
                            ? `${conversation.messages.data[0].from.username}`
                            : `${conversation.messages.data[0].to.data[0].username}`}{conversation.messages.data[conversation.messages.data.length - 1].created_time}
                            <p>{conversation.messages.data[conversation.messages.data.length - 1].message}</p>
                    </button>
                ))}
            </div>

            {/* Right Panel: Messages */}
            <div style={{ flex: 2, padding: '20px', overflowY: 'auto' }}>
                <h1>Messages</h1>
                {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                {loading && <p>Loading conversations...</p>}
                {!loading && !error && !conversations.length && <p>No conversations found.</p>}
                {selectedConversation ? (
                    <ul>
                        {selectedConversation.messages.data.map((message) => (
                            <li
                                key={message.id}
                                style={{
                                    marginBottom: '10px',
                                    padding: '10px',
                                    backgroundColor: 'lightgray',
                                    borderRadius: '5px',
                                    maxWidth: '80%',
                                    wordBreak: 'break-word',
                                    alignSelf: isMessageForCurrentUser(message) ? 'flex-start' : 'flex-end',
                                }}
                            >
                                <strong>{message.from.username}:</strong> {message.message}
                                <br />
                                <small>{new Date(message.created_time).toLocaleString()}</small>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>Select a conversation to view its messages.</p>
                )}
            </div>
        </div>
    );
}
