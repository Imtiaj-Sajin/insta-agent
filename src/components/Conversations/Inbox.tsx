import React, { useState, useEffect, useRef} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FiPaperclip, FiSend } from 'react-icons/fi';
import io from 'socket.io-client';
import ImageModal from '@/utils/imagePreview';
import { determineFileType, parseWebhookPayload, isLink, getImageUrl, sendText, sendImage, sendVideo} from '@/utils/functions';
import { Conversation, Message } from '@/types/interfaces';

const socket = io('https://nkf448kn-3001.asse.devtunnels.ms/'); 

interface InboxProps {
  pageAccessToken: string ;
  selectedConversation: Conversation;
}

const Inbox: React.FC<InboxProps> = ({ pageAccessToken, selectedConversation }) => {
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<{ file: File; previewUrl: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [messageIds, setMessageIds] = useState<Set<string>>(new Set());
  const [nextUrlMap, setNextUrlMap] = useState<Record<string, string | null>>({});
  const queryClient = useQueryClient();

  const pageId=process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID;
  const selectedConversationId = selectedConversation?.id ;
  const selectedSenderId = selectedConversation?.participant_details?.id ;



  const fetchMessages = async (accessToken: string, conversationId: string, url?: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        url || `/api/fetch-message-scroll?conversationId=${conversationId}&accessToken=${accessToken}` // Your API route to fetch messages
      );
      const data = await response.json();
      const newMessages = (data.messages?.data || data.data).filter(
        (message: Message) => {
          if (!messageIds.has(message.id)) {
            messageIds.add(message.id);  
            return true;
          }
          return false; // Skip duplicate messages
        }
      )
      const pagingNext = data.messages?.paging?.next || data.paging?.next;


      setNextUrlMap((prev) => ({ ...prev, [conversationId]: pagingNext })); // Store per conversation

      return newMessages;
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  const { data: messages = [], isLoading, refetch } = useQuery({
    queryKey: ['messages', pageAccessToken, selectedSenderId],
    queryFn: () => fetchMessages(pageAccessToken as string, selectedConversationId as string),
    enabled: !!selectedConversation, // Ensure query runs only when selectedConversation is available
    staleTime: 1000 * 60 * 5, 
    }
  );

  console.log(refetch);
  console.log(isLoading);

  useEffect(() => {
    const handleScroll = async () => {
      if (
        containerRef.current &&((containerRef.current.clientHeight-containerRef.current.scrollHeight+1)  >= containerRef.current.scrollTop) && nextUrlMap[selectedConversationId] && !loading// Trigger when near bottom
      ){

        console.log('Fetching more messages for:', selectedConversationId);
        fetchMessagesX(pageAccessToken, selectedConversationId, nextUrlMap[selectedConversationId]);
          
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", handleScroll);
      return () => container.removeEventListener("scroll", handleScroll);
    }
  }, [selectedConversationId, nextUrlMap, loading]);



  const fetchMessagesX = async (accessToken: string, conversationId: string, url?: string) => {
    setLoading(true); // Start loading state
    try {
      const response = await fetch(
        url || `/api/fetch-message-scroll?conversationId=${conversationId}&accessToken=${accessToken}` // Your API route to fetch messages
      );
      const data = await response.json();
  
      const newMessages = (data.messages?.data || data.data || []).filter(
        (message: Message) => {
          if (!messageIds.has(message.id)) {
            messageIds.add(message.id); // Add the new message ID to the set
            return true;
          }
          return false; // Skip duplicate messages
        }
      );
  
      const pagingNext = data.messages?.paging?.next || data.paging?.next || null;
      queryClient.setQueryData(
        ['messages', pageAccessToken, selectedSenderId], // Unique cache key
        (oldMessages: Message[] = []) => [...oldMessages, ...newMessages] // Append new messages
      );
  
      setNextUrlMap((prev) => ({ ...prev, [conversationId]: pagingNext })); // Store per conversation

    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setLoading(false); 
    }
  };
    

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      console.log("Received data:", data);
      const incomingMessage = parseWebhookPayload(JSON.parse(data));
  
      if (!incomingMessage.is_echo) {//&& incomingMessage.type!=="message_read") {      
        const senderId  = incomingMessage?.from?.id; // Use senderId as the cache key
        queryClient.setQueryData(['messages', pageAccessToken, senderId], (oldMessages?: Message[]) => {
          return oldMessages ? [incomingMessage, ...oldMessages] : [incomingMessage];
        });
      }
    });
  
    return () => {
      socket.off("receiveMessage");
    };
  }, [queryClient, pageAccessToken]);


  const handleSendMessage = async () => {
    if (newMessage || attachments.length) {
      const recipientId =
        messages[0].from.username === process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME
          ? messages[0].to.data[0].id
          : messages[0].from.id;
  
      const attachment = attachments[0]?.file;
      const fileType = determineFileType(attachment);
      console.log("Detected file type:", fileType);

      const newMessageToAdd = {
        from: { username: process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME, id: pageId }, // Use appropriate user info
        to: { data: [{ id: recipientId }] },
        message: newMessage,
        created_time: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9), // Temporary ID, replaced later if needed
        attachments: [],
      };
  
      queryClient.setQueryData(['messages', pageAccessToken, recipientId], (oldMessages?: Message[]) => {
        return oldMessages ? [newMessageToAdd, ...oldMessages] : [newMessageToAdd];
      });
  
      if (fileType === "video") {
        if(newMessage){
          const message=newMessage;
          setNewMessage(''); 
          await sendText(recipientId, pageAccessToken, message);
        }
        console.log("Video type detected");
        (async () => {
          const pageId = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID;
          const accessToken = pageAccessToken;
  
          try {
            setNewMessage(''); 
            setAttachments([]); 
            const response = await sendVideo(pageId as string, recipientId, accessToken, attachment );
            console.log('Response videop:', response);
            const updatedMessages = [...messages];
            const tempMessageIndex = updatedMessages.findIndex(
              (msg) => msg.id === newMessageToAdd.id
            );
            if (tempMessageIndex > -1) {
              console.log("am i ever coming here???  ")
              updatedMessages[tempMessageIndex] = {
                ...updatedMessages[tempMessageIndex],
                message: 'Video sent successfully', // Or update as needed
                attachments: [
                  {
                    type: 'video',
                    video_data: { url: response?.video_url, width: 640, height: 360 }, // Example URL and size
                  },
                ],
              };
              queryClient.setQueryData(['messages', pageAccessToken, recipientId], (oldMessages?: Message[]) => {
                return oldMessages ? [updatedMessages, ...oldMessages] : [updatedMessages];
              });
            }
          } catch (error: any) {
            console.error('Failed to send video:', error.message);
          }
        })();
      } else if (fileType === "image") {
        const attachmentUrl = await getImageUrl(attachment); // Upload image from file
        if (attachmentUrl) {
          if(newMessage){
            const message=newMessage;
            setNewMessage('');
            await sendText(recipientId, pageAccessToken, message);
          }
          await sendImage(attachmentUrl, recipientId, pageAccessToken); // Send message with the uploaded image
          setAttachments([]); 
        }
      } else {
        const message=newMessage;
        setNewMessage(''); 
        await sendText(recipientId, pageAccessToken, message); 
      }
    }
  };
  
  const handleAttachmentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files ? Array.from(event.target.files) : [];
    const updatedAttachments = files.map((file) => ({
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setAttachments((prev) => [...prev, ...updatedAttachments]);
  };


  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };



  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); 
      handleSendMessage();
    }
  };
  
  return selectedConversation ? (
    <span className="inbox-container"  style={{ padding: 0}}>
      <div ref={containerRef} className="inbox-messages" style={{ display: "flex", flexDirection: "column-reverse", padding: "10px", gap: "10px"}}>
        {messages.map((message: Message) => (
          <div
            key={message.id}
            style={{
              display: "flex",
              flexDirection: message.from.username === process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME ? "row-reverse" : "row",
              alignItems: "flex-start",
              gap: "10px",
              background: "rgba(0,0,0,0)",
            }}
          >
            <div 
              style={{
                maxWidth: "70%",
                backgroundColor: message.from.username === process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME ? "#FCE9E0" : "#FFFFFF",
                color: "#333",
                padding: "10px 15px",
                border:  message.from.username === process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME ? "1px solid #F7CCB6":"1px solid #DBDEEB",
                borderRadius: message.from.username === process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME ? "12px 12px 0 12px" : "12px 12px 12px 0",
              }}
            > <span style={{ display: "flex" , flexDirection:"row", gap: "30px",  justifyContent: "space-between" }}>
              <p style={{ fontSize: "0.9rem", color: "#000" }}>{message.from.username === process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME ? "You" : selectedConversation.name}</p>
              <p style={{ fontSize: "0.9rem", margin: 0, color: "#999" }}>
                {new Date(message.created_time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </p></span>
              <p style={{ margin: "5px 0", fontSize: "1rem" }}>{isLink(message.message) ? <a href={message.message} target="_blank" rel="noopener noreferrer" style={{ color: "#007BFF" }}>  Open link</a> : message.message}</p>
              {message.attachments?.data?.map((attachment, idx) => (
                <div key={idx} style={{ marginTop: "10px" }}>
                  {attachment.type === "link" ? (
                    <a href={attachment.image_data?.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none", color: "#007BFF" }}>📄 File</a>
                  ) : attachment.video_data ? (
                    <video controls src={attachment.video_data?.url} style={{ width: "100%", borderRadius: "8px" }} />
                  ) : (
                    <ImageModal imageUrl={attachment.image_data?.url || ""} />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>


      <span className="inbox-message-input" style={{ borderRadius: 10, padding: "0px", flexDirection: 'column', backgroundColor:'rgba(255,255,255,1)', border: "1px solid #DBDEEB", boxShadow:"unset", marginBottom:"150px" }}>
      {attachments.length > 0 && (
        <div
          className="attachment-preview-section"
          style={{
            all: 'unset',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            marginBottom: '0px',
            marginTop: "0 rem", 
            border: '0px solid #ddd',
            borderRadius: '10px',
            backgroundColor: '#ffffff',
          }}
        >
          {attachments.map((attachment, index) => (
            <div key={index} style={{ position: 'relative', margin: "0px",marginLeft: "5px", padding: "0px", width: 50, height: 50, overflow: 'hidden', borderRadius: 8 }}>
              <img
                src={attachment.previewUrl}
                alt="Preview"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <button
                onClick={() => removeAttachment(index)}
                style={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  background: 'rgba(255, 0, 0, 0.8)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50%',
                  width: 20,
                  height: 20,
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

        <div className='inbox-textarea' style={{borderRadius: "10px",display: 'flex',alignItems: 'center',width: '100%',gap: '10px', margin: "0", background: "rgba(0,0,0,0)"}}>
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
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="inbox-textarea"
            rows={1}
            style={{ height: `${Math.min(120, 24 + newMessage.split('\n').length * 20)}px` }}
          />
          <button onClick={handleSendMessage} className="inbox-send-button">
            <FiSend />
          </button>
        </div>
      </span>
      
    </span>
  ) : (
    <p className="inbox-placeholder">Select a message to view the conversation.</p>
  );
};

export default Inbox;
