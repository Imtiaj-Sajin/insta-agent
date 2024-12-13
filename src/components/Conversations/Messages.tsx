import React, { useState, useEffect } from 'react';
import Inbox from './Inbox';
import './conversations.css';
import { useQuery } from '@tanstack/react-query';
import ProfileCard from '../ProfileCard';

interface ParticipantDetails {
  id: string;
  name: string;
  username: string;
  profile_pic: string;
  is_verified_user: boolean;
  follower_count: number;
  is_user_follow_business: boolean;
  is_business_follow_user: boolean;
}

interface Conversation {
  id: string;
  name: string;
  updated_time: string;
  last_message: string;
  participant_details: ParticipantDetails | null;
  status: string;
}

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showRightDiv, setShowRightDiv] = useState(false);
  const [pageAccessToken, setPageAccessToken] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentView, setCurrentView] = useState("conversation"); // "conversation", "inbox", or "profile"
  const username = process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME;
  const toggleView = (view) => setCurrentView(view);

  // Function to fetch conversation list using React Query
  const fetchConversationList = async (accessToken: string): Promise<Conversation[]> => {
    const response = await fetch(`/api/conversations?accessToken=${accessToken}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch conversation list');
    }

    return response.json();
  };

  // Using React Query to fetch and cache conversation list
  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversationList', pageAccessToken],
    queryFn: () => fetchConversationList(pageAccessToken as string),
    enabled: !!pageAccessToken, // Run query only when the access token is available
    staleTime: 1000 * 60 * 5,  // Cache the data for 5 minutes
  });

  // Function to exchange code for access token
  const exchangeToken = async (code: string) => {
    try {
      const tokenResponse = await fetch('/api/get-tokens');
      const tokenData = await tokenResponse.json();
      if (tokenResponse.ok) {
        const { pageAccessToken } = tokenData;
        setPageAccessToken(pageAccessToken);
      } else {
        console.error('Failed to exchange token');
      }
    } catch (err) {
      console.error('Error fetching access token', err);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      exchangeToken(code);
    } else {
      console.error('Authorization code not found');
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (!isMobile) setCurrentView("conversation"); // Reset view on desktop
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  const filteredConversations = conversations.filter((conversation) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Unanswered" && conversation.status === "unassigned") return true;
    if (selectedFilter === "Agent1" && conversation.status === "answered-agent1") return true;
    if (selectedFilter === "Agent2" && conversation.status === "answered-agent2") return true;
    return false;
  });

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
    toggleView("inbox");
  };


  return (
<div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", height: "100vh" }}>
      {(!isMobile || currentView === "conversation") && (
        <div
          style={{
            flex: isMobile ? "1" : "2",
            display: isMobile && currentView !== "conversation" ? "none" : "block",
            overflowY: "auto",
            borderRight: isMobile ? "none" : "1px solid #ddd",
          }}
        >
          <h1>Conversationsh</h1>
          {filteredConversations.map((conv) => (
            <div
              key={conv.id}
              onClick={() => handleSelectConversation(conv)}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderBottom: "1px solid #ddd",
              }}
            >
              <img src={conv.participant_details?.profile_pic} alt={conv.name} style={{ borderRadius: "50%", marginRight: "10px" }} />
              <div>
                <h2 style={{ margin: 0 }}>{conv.name}</h2>
                <p style={{ margin: 0, fontSize: "0.9rem", color: "gray" }}>{conv.last_message}</p>
              </div>
            </div>
          ))}
        </div>
      )}



{/* Inbox */}
{(!isMobile || currentView === "inbox") && (
  <span
    style={{
      flex: isMobile ? "1" : "4",
      display: isMobile && currentView !== "inbox" ? "none" : "block",
      position: "relative",
      overflowY: isMobile ? "auto" : "visible", // Allow scrolling in mobile view
      maxHeight: isMobile ? "calc(100vh - 50px)" : "none", // Adjust the height for mobile to fit within the screen
    }}
  >
    {/* mobile row */}
      <span
        style={{
          display: "flex",
          justifyContent: "space-between", // Align buttons to the left and right
          alignItems: "center", // Vertically align buttons
          padding: "10px",
          position: "relative",
          backgroundColor: "rgba(240, 240, 240, 1)", // Optional: background for clarity
        }}
      >
        <button
          onClick={() => toggleView("conversation")}
          style={{
            background: "red",
            color: "white",
            border: "none",
            borderRadius: "5px",
            width: "50px",
            height: "30px",
            cursor: "pointer",
          }}
        >
          Back
        </button>
        <button
          onClick={() => toggleView("profile")}
          style={{
            background: "rgba(255, 0, 0, 0.8)",
            color: "white",
            border: "none",
            borderRadius: "10px",
            width: "200px",
            height: "30px",
            cursor: "pointer",
          }}
        >
          {selectedConversation?.name}
        </button>
      </span>
    
    {selectedConversation ? (
      <Inbox pageAccessToken={pageAccessToken} selectedConversation={selectedConversation} />
    ) : (
      <p>Please select a conversation to view messages.</p>
    )}
  </span>
)}



      {/* Profile Card */}
      {(!isMobile || currentView === "profile") && (
        <div
          style={{
            flex: isMobile ? "1" : "2",
            display: isMobile && currentView !== "profile" ? "none" : "block",
            position: "relative",
          }}
        >
          {isMobile && (
            <button onClick={() => toggleView("inbox")} style={{ position: "absolute", top: "10px", left: "10px" }}>
              Back
            </button>
          )}
          {selectedConversation ? (
            <ProfileCard profileData={selectedConversation.participant_details}/>
          ) : (
            <p>No profile selected.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Messages;
