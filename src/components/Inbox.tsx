import React from 'react';

type Message = {
  id: number;
  name: string;
  text: string;
  avatar: string;
  status: string;
};

interface InboxProps {
  selectedMessage: Message | null;
}

const Inbox: React.FC<InboxProps> = ({ selectedMessage }) => {
  if (!selectedMessage) {
    return <p className="text-gray-500">Select a message to view the conversation.</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-2">{selectedMessage.name}</h2>
      <p className="text-gray-500 mb-4">Conversation with {selectedMessage.name}:</p>
      {/* Conversation area example */}
      <div className="conversation">
        <p className="text-sm text-gray-800">Agent: How can I help you?</p>
        <p className="text-sm text-gray-600 mt-2">{selectedMessage.text}</p>
        {/* Add more conversation messages if needed */}
      </div>
    </div>
  );
};

export default Inbox;
