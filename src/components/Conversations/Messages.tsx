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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [pageAccessToken, setPageAccessToken] = useState<string | null>(null);

  const username = process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME;

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
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const filteredConversations = conversations.filter((conversation) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Unanswered" && conversation.status === "unassigned") return true;
    if (selectedFilter === "Agent1" && conversation.status === "answered-agent1") return true;
    if (selectedFilter === "Agent2" && conversation.status === "answered-agent2") return true;
    return false;
  });

  const handleSelectConversation = (conversation: Conversation) => {
    setSelectedConversation(conversation);
    if (isMobile) {
      setShowRightDiv(true);
    }
  };

  const toggleDivs = () => {
    setShowRightDiv(!showRightDiv);
  };

  return (
    <div style={{ margin: "-1rem" }}>
      {isMobile && showRightDiv && (
        <div 
          className="back-arrow" 
          onClick={toggleDivs} 
          style={{
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0)",
            backgroundColor: "white",
            border: "0px solid #ffffff",
            margin: "-1rem"
          }}
        >
          ← {selectedConversation?.name || "Message"}
        </div>
      )}

      <div className="contentt" style={{ padding: "0", margin: '0rem', marginTop: "1rem", paddingBottom: '5%', border: "0", boxShadow: "0 4px 8px rgba(0, 0, 0, 0)" }}>
        <div className={`left-div ${showRightDiv && isMobile ? 'hide' : 'show'}`} style={{ overflow: "auto", borderRadius: '0' }}>
          <div className="header flex items-center justify-between mb-4" style={{ display: showRightDiv && isMobile ? 'none' : 'flex' }}>
            <h1 className="text-xl font-bold">Inbox</h1>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="filter-dropdown"
              style={{
                color:'white',
                marginLeft: 'auto',
                backgroundColor:'#3A1C71',
                padding: '4px 8px',
                borderRadius: '4px',
                fontSize: '0.9rem',
              }}
            >
              <option>All</option>
              <option>Unanswered</option>
              <option>Agent1</option>
              <option>Agent2</option>
            </select>
          </div>

          {isLoading ? (
            <div>Loading...</div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className="message-item flex items-center justify-between p-2 cursor-pointer"
                id='chat'
                onClick={() => handleSelectConversation(conversation)}
                style={{
                  backgroundColor: selectedConversation?.id === conversation.id ? "rgb(240,240,240)" : "white",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0)",
                  border: 0,
                  marginTop: 0,
                  marginBottom: 0
                }}
              >
                <img src={conversation.participant_details?.profile_pic} alt={conversation.id} className="avatar w-8 h-8 rounded-full mr-2" />
                <div className="text" style={{margin: 0, padding: 0, border: 0, boxShadow:"0 4px 8px rgba(0, 0, 0, 0)", backgroundColor:"rgba(255,255,255,0)"}}>
                  <h2 className="font-semibold flex items-center">
                    {conversation.name}
                  </h2>
                  <p className="text-sm text-gray-500 truncate">{conversation.last_message}</p>
                </div>
                <span style={{marginRight:'1px'}}
                  className={`tag ml-2 ${conversation.status === 'unassigned' ? 'tag-unassigned' : conversation.status === 'answered-agent1' ? 'tag-agent1' : 'tag-agent2'}`}
                >
                  {conversation.status === 'unassigned' ? 'Unassigned' : conversation.status === 'answered-agent1' ? 'Agent1' : 'Agent2'}
                </span>
              </div>
            ))
          )}
        </div>

        <div className={`right-div ${showRightDiv ? 'show' : 'hide'}`} style={{ display: 'flex', flexDirection: 'row', width: '100%' }}>
          <div className="inbox-container" style={{ flex: 1 }}>
            <Inbox pageAccessToken={pageAccessToken} selectedConversation={selectedConversation} />
          </div>
          <div className="profile-card-container" style={{ flex: '0 0 300px', padding: '1rem' }}>
            {!selectedConversation?.participant_details ? (
              <div style={{ background: 'rgb(0,3,4)' }}></div>
            ) : (
              <ProfileCard profileData={selectedConversation.participant_details} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
 