import React, { useState } from 'react';
import NavbarLayout from '../components/NavbarLayout';

const sampleMessages = [
  { id: 1, name: "John Doe", text: "Hello! How are you?", avatar: "avatar1.jpg", status: "unanswered" },
  { id: 2, name: "Jane Doe", text: "Can you help with my order?", avatar: "avatar2.jpg", status: "answered-agent1" },
  { id: 3, name: "Alice", text: "Thank you for your response!", avatar: "avatar3.jpg", status: "answered-agent2" },
  // More sample messages...
];

const Messages = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");

  const filteredMessages = sampleMessages.filter((msg) => {
    if (selectedFilter === "All") return true;
    if (selectedFilter === "Unanswered") return msg.status === "unanswered";
    if (selectedFilter === "Agent1") return msg.status === "answered-agent1";
    if (selectedFilter === "Agent2") return msg.status === "answered-agent2";
    return true;
  });

  return (
    <div className="messages-container p-4">
      <div className="header flex items-center justify-between">
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

      <div className="message-list mt-4">
        {filteredMessages.map((msg) => (
          <div key={msg.id} className="message-item flex items-center p-2 border-b">
            <img src={msg.avatar} alt={msg.name} className="w-10 h-10 rounded-full mr-3" />
            <div className="text">
              <h2 className="font-semibold">{msg.name}</h2>
              <p className="text-sm text-gray-500">{msg.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
