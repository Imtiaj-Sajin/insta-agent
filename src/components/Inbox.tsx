import React, { useState } from 'react';
import { FiPaperclip, FiSend } from 'react-icons/fi';

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

interface InboxProps {
  selectedMessage: Message | null;
}

const Inbox: React.FC<InboxProps> = ({ selectedMessage }) => {
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

  return selectedMessage ? (
    <div className="inbox-container">
      <h2 className="inbox-header">{selectedMessage.name}</h2>
      <div className="inbox-messages">
        {selectedMessage.messages.map((msg, index) => (
          <div
            key={index}
            className={`inbox-message ${msg.sender === "Agent" ? "inbox-message-agent" : "inbox-message-user"}`}
          >
            <p className="inbox-timestamp">{new Date(msg.timestamp).toLocaleString()}</p>
            <p className="inbox-text">
              {msg.text}
            </p>
            {msg.attachments?.map((attachment, idx) => (
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
      <div className="inbox-message-input">
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
