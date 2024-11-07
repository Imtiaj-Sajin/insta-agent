import React, { useState } from 'react';
import Inbox from './Inbox';

const sampleMessages = [
  { id: 1, name: "John Doe", text: "Hello! How are you?", avatar: "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg", status: "unanswered" },
  { id: 2, name: "Jane Doe", text: "Can you help with my order?", avatar: "https://source.unsplash.com/random/50x50?sig=2", status: "answered-agent1" },
  { id: 3, name: "Alice", text: "Thank you for your response!", avatar: "https://source.unsplash.com/random/50x50?sig=3", status: "answered-agent2" },
];

const Messages = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showRightDiv, setShowRightDiv] = useState(false);

  const filteredMessages = sampleMessages.filter((msg) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Unanswered") return msg.status === "unanswered";
    if (selectedFilter === "Agent1") return msg.status === "answered-agent1";
    if (selectedFilter === "Agent2") return msg.status === "answered-agent2";
    return true;
  });

  const handleSelectMessage = (message) => {
    setSelectedMessage(message);
    setShowRightDiv(true);
  };

  const toggleDivs = () => {
    setShowRightDiv(!showRightDiv);
  };

  return (
    <div style={{ margin: "-1rem" }}>
      <div className="back-arrow" onClick={toggleDivs} style={{
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0)",
        backgroundColor: "white",
        border: "0px solid #ffffff",
        margin: "-1rem"
      }}>
        ← Message
      </div>

      <div className="contentt" style={{ padding: "0", margin: "1rem", border: "0", boxShadow: "0 4px 8px rgba(0, 0, 0, 0)" }}>
        {/* Left Div with Message List and Filter */}
        <div className={`left-div ${showRightDiv ? 'hide' : 'show'}`} style={{ overflow: "auto", borderRadius: '0' }}>
          <div className="header flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">Inbox</h1>
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="filter-dropdown"
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
              className="message-item flex items-center p-2 cursor-pointer"
              onClick={() => handleSelectMessage(msg)}
              style={{ backgroundColor: selectedMessage?.id === msg.id ? "rgb(240,240,240)" : "white" }}
            >
              <img src={msg.avatar} alt={msg.name} className="avatar w-8 h-8 rounded-full mr-2" />
              <div className="text">
                <h2 className="font-semibold">{msg.name}</h2>
                <p className="text-sm text-gray-500 truncate">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Right Div for Displaying Inbox */}
        <div className={`right-div ${showRightDiv ? 'show' : 'hide'}`} style={{ borderRadius: 0 }}>
          <div id="content-display" style={{ marginBottom: 100 }}>
            <Inbox selectedMessage={selectedMessage} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
