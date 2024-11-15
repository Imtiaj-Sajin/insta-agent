import React, { useState, useEffect } from 'react';
import Inbox from './Inbox';
import msgs from '../../../public/messages.json';
import './conversations.css';

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showRightDiv, setShowRightDiv] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    fetch("/messages.json")
      .then((response) => response.json())
      .then((data) => setMessages(data))
      .catch((error) => console.error("Error loading messages:", error));

    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const filteredMessages = messages.filter((msg) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Unanswered") return msg.status === "unassigned";
    if (selectedFilter === "Agent1") return msg.status === "answered-agent1";
    if (selectedFilter === "Agent2") return msg.status === "answered-agent2";
    return true;
  });

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
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
          ← {selectedMessage?.name || "Message"}
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
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className="message-item flex items-center justify-between p-2 cursor-pointer"
              id='chat'
              onClick={() => handleSelectMessage(msg)}
              style={{ backgroundColor: selectedMessage?.id === msg.id ? "rgb(240,240,240)" : "white", boxShadow: "0 4px 8px rgba(0, 0, 0, 0)", border:0, marginTop:0, marginBottom:0}}
            >
              <img src={msg.avatar} alt={msg.name} className="avatar w-8 h-8 rounded-full mr-2" />
              <div className="text" style={{margin:0, padding:0, border:0, boxShadow:"0 4px 8px rgba(0, 0, 0, 0)", backgroundColor:"rgba(255,255,255,0)"}}>
                <h2 className="font-semibold flex items-center">
                  {msg.name}
                </h2>
                <p className="text-sm text-gray-500 truncate">{msg.messages[0].text}</p>
                
              </div>
              <span style={{marginRight:'1px'}}
                className={`tag ml-2 ${msg.status === 'unassigned' ? 'tag-unassigned' : msg.status === 'answered-agent1' ? 'tag-agent1' : 'tag-agent2'}`}
              >
                {msg.status === 'unassigned' ? 'Unassigned' : msg.status === 'answered-agent1' ? 'Agent1' : 'Agent2'}
              </span>
            </div>
            
          ))}
        </div>

        <div className={`right-div ${showRightDiv ? 'show' : 'hide'}`} style={{ borderRadius: 0, overflow: 'hidden' }}>
          <Inbox selectedMessage={selectedMessage} />
        </div>
      </div>
    </div>
  );
};

export default Messages;
