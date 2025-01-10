import React, { useState, useEffect } from 'react';
import Inbox from './Inbox';
import './conversations.css';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ProfileCard from '../ProfileCard';
import { IoIosSearch } from 'react-icons/io';
import { GoKebabHorizontal } from 'react-icons/go';
import {IoIosArrowBack} from 'react-icons/io'
import { formatLastMessageTime, parseWebhookPayload } from '@/utils/functions';
import { Conversation, Message } from '@/types/interfaces';
import Image from 'next/image';
import { io } from 'socket.io-client';
const socket = io('http://commentzap.com:3001/'); 

const Messages = () => {
  const [selectedConversation, setSelectedConversation] = useState<Conversation>();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [pageAccessToken, setPageAccessToken] = useState<string>();
  const [isMobile, setIsMobile] = useState(false);
  const [currentView, setCurrentView] = useState("conversation"); // "conversation", "inbox", or "profile"
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const queryClient = useQueryClient();

  
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
  const exchangeToken = async () => {
    try {
      const response = await fetch('/api/get-tokens');
      const data = await response.json();
  
      if (response.ok && data.pageAccessToken) {
        console.log('Page access token retrieved:', data.pageAccessToken);
        setPageAccessToken(data.pageAccessToken);
      } else {
        alert('Please reauthenticate your account.');
      }
    } catch (err) {
      console.error('Error fetching page access token:', err);
    }
  };
  
  useEffect(() => {
    if (!pageAccessToken) {
      exchangeToken();
    }
  }, [pageAccessToken]);
  

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
      if (!isMobile) setCurrentView("conversation"); // Reset view on desktop
    };
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMobile]);

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      console.log("Received data:", data);
      const incomingMessage = parseWebhookPayload(JSON.parse(data));
      console.log("incomingMessage ==> ", incomingMessage);
  
      if (!incomingMessage.is_echo) {
        const senderId = incomingMessage?.from?.id;

        queryClient.setQueryData(['conversations', pageAccessToken, senderId], (oldMessages?: Message[]) => {
          return oldMessages ? [incomingMessage, ...oldMessages] : [incomingMessage];
        });
  
        queryClient.setQueryData(['conversationList', pageAccessToken], (oldConversations?: Conversation[]) => {
          if (!oldConversations) return [];
  
          return oldConversations.map((conversation) => {
            if (conversation.participant_details?.id === senderId) {
return {
                ...conversation,
                last_message: incomingMessage.message, // Update last message
                updated_time: incomingMessage.timestamp
                
              };
            }
            return conversation;
          });
        });
      }
    });
  
    return () => {
      socket.off("receiveMessage");
    };
  }, [queryClient, pageAccessToken]);
  

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

  const handleSearch = (query:any) => {
    // const lowerCaseQuery = query.toLowerCase();
    // const filtered = allConversations.filter((conv) =>
    //   conv.name.toLowerCase().includes(lowerCaseQuery)
    // );
    // setFilteredConversations(filtered);
  };
  
  return (
<span style={{ display: "flex", flexDirection: isMobile ? "column" : "row", height: "100vh" }}>
  {(!isMobile || currentView === "conversation") && (
    <span
      style={{
        background: "#fff",
        flex: isMobile ? "1" : "2",
        display: isMobile && currentView !== "conversation" ? "none" : "block",
        overflowY: "auto",
        borderRight: isMobile ? "none" : "1px solid #ddd",
      }}
    >
      {/* Add "Filter Chat" header and Search Box */}
      <div style={{ padding: "10px", borderBottom: "1px solid #ddd", backgroundColor: "#f9f9f9", display: "flex", gap: "10px" }}>
        {/* Search Box */}
        <input
          type="text"
          placeholder="Search..."
          style={{
            flex: "1",
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            // fontSize: "1rem",
          }}
          onChange={(e) => handleSearch(e.target.value)} 
        />
        
        {/* Filter Dropdown */}
        <select
          value={selectedFilter}
          onChange={(e) => setSelectedFilter(e.target.value)} 
          style={{
            maxWidth:'30%',
            padding: "8px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            // background:'#ec4b00de',
            // color:'#fff',
            // fontSize: "1rem",
          }}
        >
          <option value="All">All</option>
          <option value="Unanswered">Unanswered</option>
          <option value="Agent1">Agent 1</option>
          <option value="Agent2">Agent 2</option>
        </select>
      </div>


      {!filteredConversations
        ? Array.from({ length: 5 }).map((_, index) => (
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
          ))
        : filteredConversations.map((conv) => (
            <span
              key={conv.id}
              onClick={() => handleSelectConversation(conv)}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f0f0f0")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = conv.isUnread ? "#f9f9f9" : "white")}
              style={{
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px 10px",
                borderBottom: "1px solid #ddd",
                backgroundColor: conv.isUnread ? "#f9f9f9" : "white", // Highlight unread messages
              }}
            >
              {/* Profile Picture */}
              <Image
                src={
                  conv.participant_details?.profile_pic ||
                  "https://images.ctfassets.net/23aumh6u8s0i/6pjUKboBuFLvCKkE3esaFA/5f2101d6d2add5c615db5e98a553fc44/nextjs.jpeg"
                }
                alt={conv.name}
                width={50}
                height={50}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  marginRight: "10px",
                }}
              />

              {/* Conversation Details */}
              <span style={{ flex: 1, marginLeft: "10px" }}>
                <h2 style={{ margin: "0 0 5px", fontSize: "1rem", fontWeight: "600" }}>{conv.name}</h2>
                <p
                  style={{
                    margin: 0,
                    fontSize: "0.9rem",
                    color: "gray",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {conv.last_message.slice(0, 25).concat("...")}
                </p>
              </span>

              {/* Right-side Indicators */}
              <span style={{ textAlign: "right" }}>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "gray" }}>
                  {formatLastMessageTime(Date.now() - Date.parse(conv.updated_time))}
                </p>
                {1 ? (
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
                    {"2"}
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
{/* </span> */}



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
          {/* <img
            src={selectedConversation? selectedConversation.participant_details?.profile_pic : "https://imtiaj-sajin.github.io/images/image1.JPG"}
            alt="Profile"
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "50%",
              cursor: "pointer",
              margin: "8px",
            }}
          /> */}

          <Image
                  src={selectedConversation? selectedConversation.participant_details?.profile_pic || "": ""}
                  alt="Profile"
                  width={50}
                  height={50}
                  style={{
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: "10px",
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