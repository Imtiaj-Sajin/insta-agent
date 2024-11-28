import React, { useState, useEffect } from 'react';
import Inbox from './Inbox';
import './conversations.css';

interface Conversation {
  id: string;
  name: string;
  updated_time: string;
  last_message: string;
  avatar: string;
  status: string;
}

const Messages = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  let [pageAccessToken, setPageAccessToken] = useState<string | null>(null);
  const username = process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME;

  const [messages, setMessages] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showRightDiv, setShowRightDiv] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
  const fetchConversationList=async (pageAccessToken:string)=>{
    setLoading(true);
    try{
      console.log("fetch conversation list: ", pageAccessToken )
        const response=await fetch(`/api/conversations?accessToken=${pageAccessToken}`,{
          method: 'GET',
        });
        const data =await response.json();
        console.log("inside messages ", data)
        if(response.ok){
            setConversations(data ||[]);
            console.log("everythings ok:", data);
        }
        else{
          setError(data.error_message || 'failed to fetch conversation list');
          console.log("everythings baddddd:", data);

        }
    }
    catch(err){
      setError('Error fetching conversations');
      console.error('Error:', err);
    }
    finally{
      setLoading(false);
    }
  }

  const exchangeToken = async (code: string) => {
      try {
        const tokenResponse = await fetch('/api/get-tokens');
        const tokenData = await tokenResponse.json();
          if (tokenResponse.ok) {
            const { pageAccessToken } = tokenData;
              console.log("inside the token response block", pageAccessToken);
              setPageAccessToken(pageAccessToken);
              //fetchConversations(tokenData.page_access_token);
              fetchConversationList(pageAccessToken);
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

  const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
}, []);

// const isMessageForCurrentUser = (message: Message): boolean => {
//   // Check if the message is directed to the current user
//   return message.to?.data?.some((recipient) => recipient.username === username);
// };


  const filteredMessages = messages.filter((msg) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Unanswered") return true;
    if (selectedFilter === "Agent1") return true;
    if (selectedFilter === "Agent2") return true;
    return true;
  });

  const handleSelectConversation = (conversation) => {
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
          {conversations.map((conversation) => (
            <div
              key={conversation.id}
              className="message-item flex items-center justify-between p-2 cursor-pointer"
              id='chat'
              onClick={() => handleSelectConversation(conversation)}
              style={{ backgroundColor: selectedConversation?.id === conversation.id ? "rgb(240,240,240)" : "white", boxShadow: "0 4px 8px rgba(0, 0, 0, 0)", border:0, marginTop:0, marginBottom:0}}
            >
              <img src={conversation.avatar} alt={conversation.id} className="avatar w-8 h-8 rounded-full mr-2" />
              <div className="text" style={{margin:0, padding:0, border:0, boxShadow:"0 4px 8px rgba(0, 0, 0, 0)", backgroundColor:"rgba(255,255,255,0)"}}>
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
            
          ))}
        </div>

        <div className={`right-div ${showRightDiv ? 'show' : 'hide'}`} style={{ borderRadius: 0, overflow: 'hidden' }}>
          <Inbox pageAccessToken= {pageAccessToken} selectedConversation={selectedConversation} />
          
        </div>
      </div>
    </div>
  );
};

export default Messages;
