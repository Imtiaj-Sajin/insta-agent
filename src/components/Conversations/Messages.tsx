import React, { useState, useEffect } from 'react';
import Inbox from './Inbox';
import './conversations.css';
import { useQuery } from '@tanstack/react-query';
import ProfileCard from '../ProfileCard';
import { GoKebabHorizontal } from 'react-icons/go';
import {IoIosArrowBack} from 'react-icons/io'
import { formatLastMessageTime } from '@/utils/functions';
import { Conversation } from '@/types/interfaces';

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation>();
  const [selectedFilter, setSelectedFilter] = useState("All");
  // const [showRightDiv, setShowRightDiv] = useState(false);
  const [pageAccessToken, setPageAccessToken] = useState<string>();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [currentView, setCurrentView] = useState("conversation"); // "conversation", "inbox", or "profile"
  // const username = process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME;
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  
  
  const toggleView = (view: any) => setCurrentView(view);

  const fetchConversationList = async (accessToken: string): Promise<Conversation[]> => {
    const response = await fetch(`/api/conversations?accessToken=${accessToken}`, {
      method: 'GET',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch conversation list');
    }
    setLoading(false);
    return response.json();
  };

  const { data: conversations = [], isLoading } = useQuery({
    queryKey: ['conversationList', pageAccessToken],
    queryFn: () => fetchConversationList(pageAccessToken as string),
    enabled: !!pageAccessToken, 
    staleTime: 1000 * 60 * 5,  
  });

  console.log(isLoading);
  // useEffect(() => {
  //   if (isFetched) {
  //     setLoading(false);
  //   }
  // }, [isFetched]);
const exchangeToken = async (code: string) => {
  try {
    const cookieResponse = await fetch('/api/get-tokens'); 
    const cookieData = await cookieResponse.json();

    if (cookieResponse.ok && cookieData.pageAccessToken) {
      console.log('Page access token retrieved from cookies:', cookieData.pageAccessToken);
      setPageAccessToken(cookieData.pageAccessToken);
    } else {
      console.log('Page access token not found in cookies. Attempting to exchange token.');

      const tokenResponse = await fetch('/api/exchange-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }), 
      });

      const tokenData = await tokenResponse.json();

      if (tokenResponse.ok) {
        const pageAccessToken = tokenData.pageAccessToken;
        console.log('Page access token retrieved via exchange-token API:', pageAccessToken);

        setPageAccessToken(pageAccessToken);
      } else {
        console.error('Failed to exchange token:', tokenData.error);
      }
    }
  } catch (err) {
    console.error('Error handling token exchange process:', err);
  }
};


  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      if(!pageAccessToken){
          exchangeToken(code);
      }
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

  const handleSelectConversation = (conversation: any) => {
    setSelectedConversation(conversation);
    toggleView("inbox");
  };


  return (
<span style={{ display: "flex", flexDirection: isMobile ? "column" : "row", height: "100vh" }}>
      {(!isMobile || currentView === "conversation") && (
        <span
          style={{
            flex: isMobile ? "1" : "2",
            display: isMobile && currentView !== "conversation" ? "none" : "block",
            overflowY: "auto",
            borderRight: isMobile ? "none" : "1px solid #ddd",
          }}
        >
          <h1>Conversations</h1>
          {!filteredConversations?
          Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="skeleton-loader"
              style={{
                height: "60px",
                marginBottom: "10px",
                borderRadius: "8px",
                background: "linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%)",
                backgroundSize: "200% 100%",
                animation: "loading 1.5s infinite",
              }}
            ></div>
          )):
          filteredConversations.map((conv) => (
            <span
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                style={{
                  cursor: "pointer",  
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 10px",
                  borderBottom: "1px solid #ddd",
                  //backgroundColor: conv.isUnread ? "#f9f9f9" : "white", // Highlight unread messages
                }}
              >
                {/* Profile Picture */}
                <img
                  src={conv.participant_details?.profile_pic}
                  alt={conv.name}
                  style={{
                    borderRadius: "50%",
                    width: "50px",
                    height: "50px",
                    objectFit: "cover",
                    marginRight: "10px",
                  }}
                />
                
                {/* Conversation Details */}
                <span style={{ flex: 1, marginLeft: "10px" }}>
                  <h2 style={{ margin: "0 0 5px", fontSize: "1rem", fontWeight: "600" }}>{conv.name}</h2>
                  <p style={{ margin: 0, fontSize: "0.9rem", color: "gray", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {conv.last_message}
                  </p>
                </span>

                {/* Right-side Indicators */}
                <span style={{ textAlign: "right" }}>
                  <p style={{ margin: 0, fontSize: "0.8rem", color: "gray" }}>{formatLastMessageTime(Date.now() - Date.parse(conv.updated_time))}</p>
                  {1?(
                    <span
                      style={{
                        backgroundColor: "#007bff",
                        color: "white",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "0.8rem",
                        marginTop: "5px",
                      }}
                    >
                      {'2'}
                    </span>
                  ) : (
                    <span
                      style={{
                        fontSize: "1.2rem",
                        color: "#007bff",
                        marginTop: "5px",
                      }}
                    >
                      ✓✓ {/* Checkmark for read/delivered */}
                    </span>
                  )}
                </span>
              </span>

          ))}
        </span>
      )}



{/* Inbox */}
{(!isMobile || currentView === "inbox") && (
  <span
    style={{
      flex: isMobile ? "1" : "4",
      display: isMobile && currentView !== "inbox" ? "none" : "block",
      position: "relative",
      //overflowY: isMobile ? "auto" : "visible", // Allow scrolling in mobile view
      maxHeight: isMobile ? "calc(100vh - 50px)" : "none", // Adjust the height for mobile to fit within the screen
    }}
  >
    {/* mobile row */}
    {selectedConversation ? (
      <span
        style={{
          display: "flex",
          justifyContent: "space-between", // Align buttons to the left and right
          alignItems: "center", // Vertically align buttons
          padding: "10px",
          position: "relative",
          backgroundColor: "rgba(255, 255, 255, 1)", // Optional: background for clarity
        }}
      ><span style={{ display: "flex", justifyContent: "space-between"}}>
        <button
          onClick={() => toggleView("conversation")}
          style={{
            color: "black",
            border: "none",
            borderRadius: "5px",
            width: "30px",
            padding:"0px",
            cursor: "pointer",
          }}
        >
          <IoIosArrowBack />
        </button>      
        <span>
          <img
            src={selectedConversation? selectedConversation.participant_details?.profile_pic : "https://imtiaj-sajin.github.io/images/image1.JPG"}
            alt="Profile"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              cursor: "pointer",
              margin: "8px",
            }}
          />
        </span> 
        <span style={{ display: "flex", flexDirection:"column", justifyContent: "space-between"}}><span>{selectedConversation?.name}</span> <span style={{color:"rgb(200,200,200)", fontSize: "14px"}}>{"Active 1h ago"}</span> </span> 
        
      </span> 
          
        <div onClick={() => toggleView("profile")}
        style={{
            position: "relative",
            marginRight: "20px",
            borderRadius: "50%",
            border: "1px solid rgba(0, 0, 0, 0.2)",
            backgroundColor: "rgba(250, 250, 250, 0.05)",
            width: "30px",
            height: "30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
        }}
        >
        <span
            style={{
            fontSize: "20px",
            color: "rgba(0,0,0,1)",
            }}
        >
        <GoKebabHorizontal />        
        </span>
        </div>
      </span>):(<p style={{margin: "100px"}}>Please select a conversation to view messages.</p>)}
    
    {selectedConversation ? (
      <Inbox pageAccessToken={pageAccessToken?pageAccessToken:""} selectedConversation={selectedConversation} />
    ) : (
      <></>
    )}
  </span>
)}



      {/* Profile Card */}
      {(!isMobile || currentView === "profile") && (
        <span
          style={{
            flex: isMobile ? "1" : "2",
            display: isMobile && currentView !== "profile" ? "none" : "block",
            position: "relative",
            background: "rgba(255,255,255,1)"
          }}
        >
        
        {selectedConversation?(
          <span
            style={{
              display: "flex",
              justifyContent: "space-between", // Align buttons to the left and right
              alignItems: "center", // Vertically align buttons
              padding: "10px",
              position: "relative",
              background: "rgba(255, 255, 255, 1)", // Optional: background for clarity
            }}
          >
            {isMobile && (
              

              <button
              onClick={() => toggleView("inbox")}
              style={{
                background: "red",
                color: "white",
                border: "none",
                borderRadius: "5px",
                width: "50px",
                height: "30px",
                cursor: "pointer",
              }}
              > <IoIosArrowBack /></button>
            )}
          </span>):(<></>)}
          
          {selectedConversation ? (
            <ProfileCard profileData={selectedConversation.participant_details}/>
          ) : (
            <></>
          )}
        </span>
      )}
    </span>
  );
};

export default Messages;
