import React, { FC, useEffect, useState } from "react";
import { InstagramEmbed } from "react-social-media-embed";

interface NotificationDetailsProps {
  notification: {
    noti_id: string;
    notification_type: string;
    sender_id: string;
    sender_username?: string | null;
    media_id?: string | null;
    text?: string | null;
    created_at: string;
  };
}

const NotificationDetails: FC<NotificationDetailsProps> = ({ notification }) => {
  const [instagramPermalink, setInstagramPermalink] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramPermalink = async () => {
      if (!notification.media_id) return;

      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("https://commentzap.com/api/get-permalink", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mediaId: notification.media_id }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch permalink");
        }

        const data = await response.json();
        setInstagramPermalink(data.permalink);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchInstagramPermalink();
  }, [notification.media_id]);

  return (
    <div style={{ padding: "1rem" }}>
      <h3>Notification Details</h3>
      {error ? (
        <p style={{ color: "red" }}>Error loading Instagram post: {error}</p>
      ) : isLoading ? (
        notification.media_id && <p>Loading Instagram post...</p>
      ) : instagramPermalink ? (
        <div style={{ marginTop: "20px", display: "flex", justifyContent: "center" }}>
          <InstagramEmbed url={instagramPermalink} width={800} captioned />
        </div>
      ) : (
        notification.media_id && <p>No Instagram post available</p>
      )}
    </div>
  );
};

export default NotificationDetails;
