import React, { FC } from "react";

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
    </div>
  );
};

export default NotificationDetails;
