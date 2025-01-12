import React, { useState, useEffect, FC } from "react";
import NotificationDetails from "./NotificationDetails"; // Details component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "../../../styles/index.css";
import "../../../styles/globals.css";
import "./Automation.css";
import io from "socket.io-client";
import {parseWebhookPayloadNotifications} from '@/utils/functions'
const socket = io('https://phpstack-1385749-5130276.cloudwaysapps.com/'); 
interface NotificationData {
  noti_id: string;
  notification_type: string;
  sender_id: string;
  sender_username: string | null;
  media_id: string | null;
  text: string | null;
  created_at: string;
}

const Notification: FC = () => {
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [selectedContent, setSelectedContent] = useState<React.ReactNode>("");
  const [showRightDiv, setShowRightDiv] = useState<boolean>(false);

  useEffect(() => {
    const fetchNotifications = async (): Promise<void> => {
      try {
        const response = await fetch("/api/getNotifications");
        const result = await response.json();
        if (response.ok) {
          setNotifications(result); // Set fetched notifications
        } else {
          console.error("Error fetching notifications:", result.error);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    fetchNotifications();
  }, []);


  useEffect(() => {
      // Request permission for notifications when the component mounts
  const requestNotificationPermission = async () => {
    if (window.Notification.permission === "default") {
      await window.Notification.requestPermission();
    }
  };

  requestNotificationPermission();
    socket.on("receiveMessage", (data) => {
        const parsedNotification = parseWebhookPayloadNotifications(JSON.parse(data));
  
        if (parsedNotification&&parsedNotification.commentId) {
          setNotifications((prevNotifications) => [
            
            {
              noti_id:parsedNotification.commentId,
              notification_type: "comment", // Example type
              sender_id: parsedNotification.senderId,
              sender_username: parsedNotification.username,
              media_id: parsedNotification.postId,
              text: parsedNotification.text,
              created_at: new Date().toISOString(), // Use current timestamp
            },
            ...prevNotifications,
          ]);
          if (window.Notification.permission === "granted") {
            new window.Notification("New Comment", {
              body: `${parsedNotification.username}: ${parsedNotification.text}`,
              icon: "public/logo.jpg", // Optional icon
            });
          }
        }
    });
    // Cleanup socket listener on unmount
    return () => {
      socket.off("receiveMessage");
    };
  }, []);

  const toggleDivs = (forceShowRightDiv?: boolean): void => {
    if (typeof forceShowRightDiv === "boolean") {
      setShowRightDiv(forceShowRightDiv);
    } else {
      setShowRightDiv(!showRightDiv);
    }
  };

  const timeSince = (dateString: string): string => {
    const now = new Date();
    const createdAt = new Date(dateString);
    const diffInSeconds = Math.floor((now.getTime() - createdAt.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  return (
    <div style={{ padding: "0rem" }}>
      <div className="contentt">
        {/* Left Div */}
        <div className={`left-div ${showRightDiv ? "hide" : "show"}`}>
          <div
            className="sticky-button-holder"
            style={{
              display: "flex",
              flexDirection: "column",
              width: "100%",
              padding: 4,
            }}
          >
            <label>Notifications</label>
          </div>

          <div
            style={{
              overflow: "auto",
              width: "100%",
              height: "100%",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
              paddingBottom: "200px",
              background: "var(--navbar-background)",
            }}
          >
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <div
                    key={index}
                    className="skeleton-loader"
                    style={{
                      height: "60px",
                      marginBottom: "10px",
                      borderRadius: "8px",
                      background: "linear-gradient(90deg, #f2f2f2 25%, #e6e6e6 50%, #f2f2f2 75%)",
                      backgroundSize: "200% 100%",
                      animation: "loading 1.5s infinite",
                    }}
                  ></div>
                ))
              : notifications.map((notification) => (
                  <button
                    className="right-show-btn"
                    key={notification.noti_id}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                    }}
                    onClick={() => {
                      setSelectedContent(
                        <NotificationDetails notification={notification} />
                      );
                      toggleDivs(true);
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        width: "100%",
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <FontAwesomeIcon
                          icon={
                            notification.notification_type === "comment"
                              ? faComment
                              : faEnvelope
                          }
                          style={{
                            marginRight: "0.5rem",
                            fontSize: "1.2rem",
                            color: "var(--navbar-active-bg)",
                          }}
                        />
                        <span style={{ fontSize: "0.9rem" }}>
                          <strong>{notification.sender_username || "Unknown user"}</strong>{" "}
                          {notification.notification_type === "comment"
                            ? "commented on your post"
                            : "sent you a message"}
                        </span>
                      </div>
                      <span
                        style={{
                          position: "relative",
                          top: "0rem",
                          fontSize: "0.8rem",
                          color: "#55555590",
                          whiteSpace: "nowrap",
                          marginLeft: "8px",
                        }}
                      >
                        {timeSince(notification.created_at)}
                      </span>
                    </div>
                    {notification.text && (
                      <div
                        style={{
                          fontSize: "0.8rem",
                          color: "#777",
                          marginTop: "5px",
                          width: "100%",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                        }}
                      >
                        {notification.text}
                      </div>
                    )}
                  </button>
                ))}
          </div>
        </div>

        {/* Right Div */}
        <div
          className={`right-div ${showRightDiv ? "show" : "hide"}`}
          style={{ borderRadius: 0, padding: 0 }}
        >
          <div
            className="back-arrow"
            onClick={() => toggleDivs(false)}
            style={{
              position: "fixed",
              top: "1rem",
              left: "1rem",
              zIndex: 1000,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              backgroundColor: "white",
              padding: "0.5rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              display: "none",
              cursor: "pointer",
            }}
          >
            ← Notifications
          </div>
          <div
            id="content-display"
            style={{
              margin: 0,
              padding: 0,
              boxShadow: "0 0px 0px rgba(0, 0, 0, 0)",
              border: 0,
              marginBottom: 0,
              height: "100%",
            }}
          >
            {selectedContent || (
              <div style={{ textAlign: "center" }}>
                Select a notification to view details.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Notification;
