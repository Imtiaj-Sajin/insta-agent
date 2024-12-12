import React, { useState, useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { FiPaperclip, FiSend } from 'react-icons/fi';
import './conversations.css';
import io from 'socket.io-client';

const socket = io('https://nkf448kn-3001.asse.devtunnels.ms/'); // Replace with your Socket.IO server URL

interface Message1 {
  from: { username: string; id: string };
  to: { data: { username: string; id: string }[] };
  message: string;
  created_time: string;
  id: string;
  attachments?: { data: { type?: string; image_data?: { url: string }; video_data?:{width: number, height: number, url:string, preview_url:string} }[] };
}

interface Conversation {
  id: string;
  name: string;
  updated_time: string;
  last_message: string;
  avatar: string;
  status: string;
}

interface InboxProps {
  pageAccessToken: string | null;
  selectedConversation: Conversation | null;
}

const Inbox: React.FC<InboxProps> = ({ pageAccessToken, selectedConversation }) => {
  //const [messages, setMessages] = useState<Message1[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [attachments, setAttachments] = useState<{ file: File; previewUrl: string }[]>([]);

  const pageId=process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID;
  const queryClient = useQueryClient();
  //useEffect(() => {
    // const fetchMessages = async (pageAccessToken:string, selectedConversation:string): Promise<Message1[]> => {
    //   if (selectedConversation) {
    //     //try {
    //       const response = await fetch(
    //         `/api/fetch-messagess?accessToken=${pageAccessToken}&conversationId=${selectedConversation}`,{method: "GET"}
    //       );
    //       if (!response.ok) {
    //         throw new Error('Failed to fetch conversation list');
    //       }
      
    //       return response.json();

        //   const data = await response.json();
        //   if (response.ok && data) {
        //     setMessages(data.messages.data);
        //   } else {
        //     console.error('Failed to fetch messages', data);
        //   }
        // } catch (error) {
        //   console.error('Error fetching messages:', error);
        // }
    //   }
    // };

   // fetchMessages();
 // }, [selectedConversation]);
  //   const a='aWdfZAG06MTpJR01lc3NhZA2VUaHJlYWQ6MTc4NDE0NzAyOTI1MzQ5MzY6MzQwMjgyMzY2ODQxNzEwMzAxMjQ0Mjc2MjAyNTk0OTcxNTQwODA5'
  // const { data: messages = [], isLoading } = useQuery({
  //   queryKey: ['messages', pageAccessToken, a],
  //   queryFn: () => fetchMessages(pageAccessToken as string, a as string),
  //   enabled: !!selectedConversation, // Ensure query runs only when selectedConversation is available
  //   staleTime: 1000 * 60 * 5,  // Cache the data for 5 minutes
  //   }
  // );
  const fetchMessages = async (pageAccessToken: string, selectedConversationId: string): Promise<Message1[]> => {
    if (selectedConversationId) {
      const response = await fetch(`/api/fetch-messagess?accessToken=${pageAccessToken}&conversationId=${selectedConversationId}`, { method: 'GET' });
      if (!response.ok) {
        throw new Error('Failed to fetch messages');
      }
      const data = await response.json();
      // Ensure the data is returned as Message1[]
      return data.messages.data as Message1[];
    }
    return [];
  };

  // Hardcoded for testing purposes, replace with actual selectedConversation.id
  const selectedConversationId = selectedConversation?.id ;//|| 'aWdfZAG06MTpJR01lc3NhZA2VUaHJlYWQ6MTc4NDE0NzAyOTI1MzQ5MzY6MzQwMjgyMzY2ODQxNzEwMzAxMjQ0Mjc2MjAyNTk0OTcxNTQwODA5';

  // Query to fetch messages
  const { data: messages = [], isLoading, error } = useQuery({
    queryKey: ['messages', pageAccessToken, selectedConversationId],
    queryFn: () => fetchMessages(pageAccessToken as string, selectedConversationId),
    enabled: !!selectedConversation, // Ensure query runs only when selectedConversation is available
    staleTime: 1000 * 60 * 5, // Cache the data for 5 minutes
  });

  useEffect(() => {
    socket.on("receiveMessage", (data) => {
      console.log("Received data:", data);
      const incomingMessage = parseWebhookPayload(JSON.parse(data));
      
      if (!incomingMessage.is_echo) {
        queryClient.setQueryData(['messages', pageAccessToken, selectedConversationId], (oldMessages?: Message1[]) => {
          return oldMessages ? [incomingMessage, ...oldMessages] : [incomingMessage];
        });
      }
    });

    return () => {
      socket.off("receiveMessage");
    };
  }, [queryClient, pageAccessToken, selectedConversationId]);


  const uploadImage = async (imageUrl: string) => {
    const endpoint = `https://graph.facebook.com/v21.0/${pageId}/message_attachments`;
    const payload = {
      access_token: pageAccessToken,
      message: {
        attachment: {
          type: 'image',
          payload: {
            url: imageUrl,
            is_reusable: true,
          },
        },
      },
    };
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        return data.attachment_id;  // Return the attachment ID for use in the next step
      } else {
        console.error('Failed to upload image:', data);
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const uploadImageFromFile = async (file: File) => {
    const formData = new FormData();
    formData.append('filedata', file);
    formData.append('message', JSON.stringify({
      attachment: {
        type: 'image',
      },
    }));
    formData.append('type', 'image/png'); // Adjust according to your file type
  
    const endpoint = `https://graph.facebook.com/v21.0/${pageId}/message_attachments?access_token=${pageAccessToken}`;
    
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (response.ok) {
        return data.attachment_id;  // Return the attachment ID
      } else {
        console.error('Failed to upload image from file:', data);
      }
    } catch (error) {
      console.error('Error uploading image from file:', error);
    }
  };

  const sendMessageWithImage = async (recipientId: string, attachmentId: string, messageText?: string) => {
    const endpoint = `https://graph.facebook.com/v21.0/${pageId}/messages?access_token=${pageAccessToken}`;
    
    const payload = {
      recipient: {
        id: recipientId,
      },
      message: {
        attachment: {
          type: 'image',
          payload: {
            attachment_id: attachmentId,
          },
        },
      },
    };
  
    // If you want to send a message along with the image, add the text to the payload
    // if (messageText) {
    //   payload.message.text = messageText;
    // }
  
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (response.ok) {
        console.log('Message sent successfully:', data);
      } else {
        console.error('Failed to send message:', data);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  
  const sendImageMessage = async (recipientId: string, imageUrl: string, messageText: string) => {
    try {
      // Step 1: Upload the image
      const attachmentId = await uploadImage(imageUrl);
      if (attachmentId) {
        // Step 2: Send the image with the message
        await sendMessageWithImage(recipientId, attachmentId, messageText);
      }
    } catch (error) {
      console.error('Error sending image message:', error);
    }
  };

  const sendVideo = async ({ pageId, recipientId, accessToken, file }) => {
    try {
      const endpoint = `https://graph.facebook.com/v21.0/${pageId}/messages`;
  
      const formData = new FormData();
      formData.append('recipient', JSON.stringify({ id: recipientId }));
      formData.append(
        'message',
        JSON.stringify({
          attachment: {
            type: "video", // 'audio' or 'video'
          },
        })
      );
      formData.append('filedata', file); // Provide the file path or stream
      formData.append('access_token', accessToken);
  
      const response = await fetch(endpoint, {
        method: 'POST',
        body: formData,
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log('Media message sent successfully:', data);
        return data; // Return the successful response
      } else {
        console.error('Failed to send media message:', data);
        throw new Error(data.error.message);
      }
    } catch (error) {
      console.error('Error while sending media message:', error.message);
      throw error; // Re-throw for external handling
    }
  };

  function determineFileType(file: File | undefined): string {
    if (!file) {
      console.warn("File is undefined or null.");
      return "unknown";
    }
  
    if (file.type) {
      const mimeType = file.type;
      if (mimeType.startsWith('image/')) return 'image';
      if (mimeType.startsWith('audio/')) return 'audio';
      if (mimeType.startsWith('video/')) return 'video';
    }
  
    if(file.name){
          const extension = file.name.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) return 'image';
    if (['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(extension)) return 'audio';
    if (['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv'].includes(extension)) return 'video';
  
    }

    return 'unknown';
  }
  function parseWebhookPayload(payload: any): any {
    console.log("hello")
    if (payload.object === 'instagram' && payload.entry) {
      console.log("hello payload")
      for (const entry of payload.entry) {
        console.log("hello payload entry")
  
        const messaging = entry.messaging;
        for (const event of messaging) {
          console.log("hello payload entry messaging")
  
          if (event.message) {
            console.log("hello payload entry messaging event")
  
            // Check for message type
            if (event.message.attachments && event.message.attachments.length > 0) {
              console.log("Processing event with attachments");
            
              const attachmentType = event.message.attachments[0].type;
              const attachmentUrl = event.message.attachments[0].payload.url;
            
              let attachmentData;
              if (attachmentType === "image") {
                attachmentData = {
                  type: attachmentType,
                  image_data: {
                    url: attachmentUrl,
                  },
                };
              } else if (attachmentType === "video") {
                attachmentData = {
                  type: attachmentType,
                  video_data: {
                    url: attachmentUrl,
                    preview_url: attachmentUrl,
                  },
                };
              }
            
              return {
                from: { username: "string", id: event.sender.id },
                to: { data: [{ username: "string", id: event.recipient.id }] },
                message: event.message.text,
                created_time: new Date(event.timestamp),
                id: event.message.mid,
                is_echo: event.message.is_echo,
                attachments: { data: [attachmentData] },
              };
            }
             else {
              console.log("hello payload entry messaging event text")
              return {
                type: 'text_message',
                from: { username: "string", id: event.sender.id },
                to: { data: { username: "string", id: event.recipient.id } },
                message: event.message.text,
                created_time: new Date(event.timestamp),
                id: event.message.mid,
                is_echo:  event.message.is_echo,
              };
            }
          } else if (event.read) {
            // Handle message read event
            return {
              type: 'message_read',
              from: { username: "string", id: event.sender.id },
              to: { data: { username: "string", id: event.recipient.id } },
              message: "Seen",
              created_time: new Date(event.timestamp),
              id: event.read.mid,
            };
          }
        }
  
        const changes = entry.changes || [];
        for (const change of changes) {
          if (change.field === 'comments') {
            // Handle comment events
            return {
              type: 'comment',
              commenterId: change.value.from.id,
              commenterUsername: change.value.from.username,
              mediaId: change.value.media.id,
              text: change.value.text,
              timestamp: entry.time,
            };
          }
        }
      }
    }
  
    // Default response if no recognizable event is found
    return { type: 'unknown_event', payload };
  }
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
        message: fileType === 'video' ? 'Sending a video...' : newMessage,
        created_time: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9), // Temporary ID, replaced later if needed
        attachments: [],
      };
  
      setMessages((prevMessages) => [newMessageToAdd, ...prevMessages]); 
  
      if (fileType === "video") {
        console.log("Video type detected");
        (async () => {
          const pageId = process.env.NEXT_PUBLIC_FACEBOOK_PAGE_ID;
          const accessToken = pageAccessToken;
  
          try {
            setNewMessage(''); // Clear the text input
            setAttachments([]); // Clear the attachments
            const response = await sendVideo({
              pageId,
              recipientId,
              accessToken,
              file: attachment, // Pass the File object directly
            });
            console.log('Response:', response);
            const updatedMessages = [...messages];
          const tempMessageIndex = updatedMessages.findIndex(
            (msg) => msg.id === newMessageToAdd.id
          );
          if (tempMessageIndex > -1) {
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
            setMessages(updatedMessages);
          }
           
          } catch (error) {
            console.error('Failed to send video:', error.message);
          }
        })();
      } else if (fileType === "image") {
        const attachmentId = await uploadImageFromFile(attachment); // Upload image from file
        if (attachmentId) {
          await sendMessageWithImage(recipientId, attachmentId, newMessage); // Send message with the uploaded image
          setNewMessage(''); // Clear the text input
          setAttachments([]); // Clear the attachments
        }
      } else {
        // Send plain text message
        const endpoint = `https://graph.facebook.com/v21.0/me/messages?access_token=${pageAccessToken}`;
        const payload = {
          recipient: { id: recipientId },
          message: { text: newMessage },
        };
  
        try {
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
  
          const data = await response.json();
          if (response.ok) {
            console.log('Message sent successfully:', data);
            setNewMessage(''); // Clear the input field
          } else {
            console.error('Failed to send message:', data);
          }
        } catch (error) {
          console.error('Error sending message:', error);
        }
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

  function isLink(message) {
    const urlRegex = /https?:\/\/[^\s]+/; // Regex to detect HTTP/HTTPS URLs
    return urlRegex.test(message); // Returns true if a link is found
  }
  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  return selectedConversation ? (
    <div className="inbox-container" style={{ padding: 0 }}>
      <h2 className="inbox-header" style={{ margin: 0 }}>{selectedConversation.name}</h2>
      <div className="inbox-messages" style={{ flexDirection: "column-reverse" ,marginBottom: 0, border: 0, boxShadow: '0 0px 0px rgba(0,0,0,0)', backgroundColor: "unset"}}>
        {messages.map((message) => (
          <div
          style={{boxShadow: '0 0px 0px rgba(0,0,0,0)', margin: "unset"}}
            key={message.id}
            className={`inbox-message ${message.from.username === process.env.NEXT_PUBLIC_INSTAGRAM_USERNAME ? 'inbox-message-agent' : 'inbox-message-user'}`}
          >
            <p className="inbox-timestamp">{new Date(message.created_time).toLocaleString()}</p>
            <p className="inbox-text">{isLink(message.message)?<a href={message.message} target="_blank" rel="noopener noreferrer" className="inbox-attachment"> > Open link</a>:message.message}</p>
            {message.attachments?.data?.map((attachment, idx) => (
              <div key={idx} className="inbox-attachment-container" style={{ margin: 0, padding: 0, border: 0 }}>
                {attachment.type === 'link' ? (
                  <a href={attachment.image_data?.url} target="_blank" rel="noopener noreferrer" className="inbox-attachment">📄 File</a>
                ) : attachment.video_data? (
                  <video controls src={attachment.video_data?.url} className="inbox-attachment-media" />
                ) : (
                  <img src={attachment.image_data?.url} alt="attachment" className="inbox-attachment-media" />
                  
                )}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="inbox-message-input" style={{ borderRadius: 40, padding: 0, flexDirection: 'column', backgroundColor:'rgba(0,0,0,0)', border: "unset", boxShadow:"unset"}}>
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

        <div className='inbox-textarea' style={{display: 'flex',alignItems: 'center',width: '100%',gap: '10px', margin: "unset"}}>
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
          style={{ height: `${Math.min(120, 24 + newMessage.split('\n').length * 20)}px` }}
        />
        <button onClick={handleSendMessage} className="inbox-send-button">
          <FiSend />
        </button>
        </div>
      </div>
    </div>
  ) : (
    <p className="inbox-placeholder">Select a message to view the conversation.</p>
  );
};

export default Inbox;


