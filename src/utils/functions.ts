export function isLink(message: any) {
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
  
    if(file.name){
          const extension = file.name.split('.').pop().toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp'].includes(extension)) return 'image';
    if (['mp3', 'wav', 'ogg', 'aac', 'flac', 'm4a'].includes(extension)) return 'audio';
    if (['mp4', 'mov', 'avi', 'mkv', 'webm', 'flv'].includes(extension)) return 'video';
  
    }

    return 'unknown';
  }

export function parseWebhookPayload(payload: any): any {
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