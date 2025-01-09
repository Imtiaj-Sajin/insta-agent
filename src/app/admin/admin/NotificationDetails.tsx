import React, { FC, useEffect, useState } from "react";
import { InstagramEmbed } from "react-social-media-embed";

interface NotificationDetailsProps {
  notification: {
    noti_id: string;
    notification_type: string;
    sender_id: string;
    sender_username: string | null;
    media_id: string | null;
    text: string | null;
    created_at: string;
  };
}

const NotificationDetails: FC<NotificationDetailsProps> = ({ notification }) => {
  const [instagramPermalink, setInstagramPermalink] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the permalink if media_id is present
    if (notification.media_id) {
      const accessToken = "EAAnZByvmjelsBO8EewuJ3XDghxsRQsej3uqoLPDcfQ9DGZBo5CB2zcJSVsx8VB5BGzyHltyogJl0pDT8sqZCT9tn2AandYGOzsoNjUvqHOu7X8r2PIAI7lnuoziVBacoX6IEbVWUHhPupqVdy8HMwg8Jl6ZA75usQVJBLeQvDoRyEZBbpsMzwKnCoz5sxc2nroTBkAgjlUM3t6PCazxeoUjWG";
      const mediaId = notification.media_id;

      fetch(`https://graph.facebook.com/v21.0/${mediaId}?fields=permalink&access_token=${accessToken}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.permalink) {
            setInstagramPermalink(data.permalink);
          } else {
            console.error("Error: Unable to fetch permalink:", data);
          }
        })
        .catch((error) => console.error("Error fetching permalink:", error));
    }
  }, [notification.media_id]);

  return (
    <div style={{ padding: "1rem" }}>
      <h3>Notification Details</h3>
      <p>
        <strong>Type:</strong> {notification.notification_type}
      </p>
      <p>
        <strong>Sender ID:</strong> {notification.sender_id}
      </p>
      {notification.sender_username && (
        <p>
          <strong>Sender Username:</strong> {notification.sender_username}
        </p>
      )}
      {notification.media_id && (
        <p>
          <strong>Media ID:</strong> {notification.media_id}
        </p>
      )}
      <p>
        <strong>Text:</strong> {notification.text || "No text available"}
      </p>
      <p>
        <strong>Created At:</strong> {new Date(notification.created_at).toLocaleString()}
      </p>

      {/* Instagram Embed */}
      {instagramPermalink ? (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <InstagramEmbed url={instagramPermalink} width={800} captioned />
        </div>
      ) : (
        notification.media_id && <p>Loading Instagram post...</p>
      )}
    </div>
  );
};

export default NotificationDetails;
