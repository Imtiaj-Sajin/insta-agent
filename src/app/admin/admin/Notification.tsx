import React, { useState, useEffect, FC } from "react";
import NotificationDetails from "./NotificationDetails"; // Details component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faComment, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import "../../../styles/index.css";
import "../../../styles/globals.css";
import "./Automation.css";
import { comment } from "postcss";

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
  const [notifications, setNotifications] = useState<NotificationData[]>([]); // Store notifications from the database
  const [selectedContent, setSelectedContent] = useState<React.ReactNode>(""); // Render NotificationDetails component
  const [showRightDiv, setShowRightDiv] = useState<boolean>(false);

  useEffect(() => {
    // Fetch notifications from the API
    const fetchNotifications = async (): Promise<void> => {
      try {
        const response = await fetch("/api/getNotifications");
        const result = await response.json();
        if (response.ok) {
          setNotifications(result); // Set the fetched notifications
        } else {
          console.error("Error fetching notifications:", result.error);
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const toggleDivs = (forceShowRightDiv?: boolean): void => {
    if (typeof forceShowRightDiv === "boolean") {
      setShowRightDiv(forceShowRightDiv); // Directly set based on parameter
    } else {
      setShowRightDiv(!showRightDiv); // Toggle if no parameter provided
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
        <div
          className={`left-div ${showRightDiv ? "hide" : "show"}`}
          style={{}}
        >
             {/* Sticky Button Holder */}
          <div
            className="sticky-button-holder"
            style={{ display: "flex", flexDirection: "column", width: "100%", padding: 4 }}
          >
            <label>Notifications</label>
            
          </div>

          {/* Notifications Buttons */}
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
            {notifications.map((notification) => (
              <button
                className="right-show-btn"
                key={notification.noti_id}
                style={{
                  display: "flex",
                  flexDirection: "column", // Two rows structure
                  alignItems: "flex-start",
                }}
                onClick={() => {
                  setSelectedContent(
                    <NotificationDetails notification={notification} />
                  );
                  toggleDivs(true); // Force the right-div to show
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
                    <span style={{  fontSize: "0.9rem" }}>
                      <strong> {notification.sender_username || "Unknown user"} </strong> {` `}
                      {notification.notification_type==="comment"
                        ? "commented on your post"
                        :"sent you a message"
                      }
                    </span>
                    {/* <span>
                      
                    </span> */}
                  </div>
                  <span
                    style={{
                      position:"relative",
                      top: "0rem",
                      fontSize: "0.8rem",
                      color: "#55555590",
                      whiteSpace: "nowrap",
                      marginLeft:"8px",
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
