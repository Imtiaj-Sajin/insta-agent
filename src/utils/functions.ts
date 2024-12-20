export function isLink(message: string) {
  const urlRegex = /https?:\/\/[^\s]+/; // Regex to detect HTTP/HTTPS URLs
  return urlRegex.test(message); // Returns true if a link is found
}

export function determineFileType(file: File | undefined): string {
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

  if(file?.name){
    const extension = file.name.split('.').pop()?.toLowerCase() || "";
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) return 'image';
  if (['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(extension)) return 'audio';
  if (['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv'].includes(extension)) return 'video';

  }

  return 'unknown';
}

export function parseWebhookPayload(payload: any) {
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


export const uploadImage = async (imageUrl: string, pageAccessToken: string, pageId: string) => {
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

export const getImageUrl = async (imageFile: File) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);
    const imgbbResponse = await fetch(`https://api.imgbb.com/1/upload?key=90d5d6b066dfe2c82c8e22e880eb3a02`, {
      method: 'POST',
      body: formData,
    });

    if (!imgbbResponse.ok) {
      throw new Error('Failed to upload image to imgbb');
    }
    const imgbbData = await imgbbResponse.json();
    return imgbbData.data.url; 
  } catch (error) {
    console.error('Error sending image message:', error);
  }
};



export const formatLastMessageTime = (ms: number) => {
  const seconds = Math.floor((ms / 1000) % 60);
  const minutes = Math.floor((ms / (1000 * 60)) % 60);
  const hours = Math.floor((ms / (1000 * 60 * 60)) % 24);
  const days = Math.floor(ms / (1000 * 60 * 60 * 24));

  if (days > 0) {
    return `${days}d`; // Show days if non-zero
  } else if (hours > 0) {
    return `${hours}h`; // Show hours if days are zero
  } else if (minutes > 0) {
    return `${minutes}m`; // Show minutes if hours are zero
  } else {
    return `${seconds}s`; // Show seconds if minutes are zero
  }
};

export const sendText = async ( recipientId: string, pageAccessToken: string, newMessage: string) => {
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
      } else {
          console.error('Failed to send message:', data);
      }
  } catch (error) {
      console.error('Error sending message:', error);
  }
}
export const sendImage = async ( url: string, recipientId: string, pageAccessToken:string) => {
  const endpoint = `https://graph.facebook.com/v21.0/113921618461646/messages?access_token=${pageAccessToken}`;
  const payload = {
      recipient: {
      id: recipientId,
      },
      message: {
      attachment: {
          type: 'image',
          payload: {
          url: url,
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
      console.log('Message sent successfully:', data);
      } else {
      console.error('Failed to send message:', data);
      }
  } catch (error) {
      console.error('Error sending message:', error);
  }
};


export const sendVideo = async ( pageId: string, recipientId: string, accessToken: string, file: File) => {
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
  } catch (error: any) {
      console.error('Error while sending media message:', error.message);
      throw error; // Re-throw for external handling
  }
};
