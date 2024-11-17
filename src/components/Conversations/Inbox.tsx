import React, { useState } from 'react';
import { FiPaperclip, FiSend } from 'react-icons/fi';
import './conversations.css';

type Message = {
  id: number;
  name: string;
  avatar: string;
  status: string;
  messages: {
    text: string;
    sender: string;
    timestamp: string;
    attachments?: { type: string; url: string }[];
  }[];
};

interface Message1 {
  from: { username: string; id: string };
  to: { data: { username: string; id: string }[] };
  message: string;
  created_time: string;
  id: string;
  attachments?: { type: string; url: string }[];
}

interface Conversation {
  id: string;
  messages: { data: Message1[] };
  updated_time: string;
  avatar: string;
  status: string;
}
interface InboxProps {
  selectedConversation: Conversation | null;
}

const Inbox: React.FC<InboxProps> = ({ selectedConversation }) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);

  const handleSendMessage = () => {
    if (newMessage || attachments.length) {
      console.log("Sending message:", newMessage, attachments);
      setNewMessage('');
      setAttachments([]);
    }
  };

  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    setAttachments((prev) => [...prev, ...files]);
  };

  return selectedConversation ? (
    <div className="inbox-container" style={{padding:0}}>
      <h2 className="inbox-header" style={{margin:0}}>{selectedConversation.messages.data[0].from.username}</h2>
      <div className="inbox-messages" style={{marginBottom:0,border:0, boxShadow:'0 0px 0px'}}>
        {selectedConversation.messages.data.map((message) => (
          <div
            key={message.id}
            className={`inbox-message ${message.from.username === process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME ? "inbox-message-agent" : "inbox-message-user"}`}
          >
            <p className="inbox-timestamp">{new Date(message.created_time).toLocaleString()}</p>
            <p className="inbox-text">
              {message.message}
            </p>
            {message.attachments?.map((attachment, idx) => (
              <div key={idx} className="inbox-attachment-container" style={{margin:0,  padding:0, border:0}}>
                {attachment.type === "image" ? (
                  <img
                    src={attachment.url}
                    alt="attachment"
                    className="inbox-attachment-media" 

                  />
                ) : attachment.type === "video" ? (
                  <video
                    controls
                    src={attachment.url}
                    className="inbox-attachment-media"
                  />
                ) : (
                  <a href={attachment.url} target="_blank" rel="noopener noreferrer" className="inbox-attachment">
                    📄 File
                  </a>
                )}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="inbox-message-input" style={{borderRadius:40,padding:0}}>
        <label htmlFor="file-input" className="inbox-attach-icon">
          <FiPaperclip />
          <input
            id="file-input"
            type="file"
            multiple
            onChange={handleAttachmentChange}
            className="inbox-file-input"
          />
        </label>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="inbox-textarea"
          rows={1}
          style={{ height: `${Math.min(120, 24 + newMessage.split("\n").length * 20)}px` }}
        />
        <button onClick={handleSendMessage} className="inbox-send-button">
          <FiSend />
        </button>
      </div>
    </div>
  ) : (
    <p className="inbox-placeholder">Select a message to view the conversation.</p>
  );
};

export default Inbox;
