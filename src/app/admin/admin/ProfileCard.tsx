import React, { FC, useEffect, useState } from "react";

interface AgentData {
  agent_id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  title: string;
  image?: string; // Add optional image property
}

const ProfileCard: FC<{ agent: AgentData }> = ({ agent }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Function to check screen width
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 767);
    };

    // Check initially and add event listener for resizing
    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh", // Full viewport height
      backgroundColor: "var(--background-color)", 
    },
    profileCard: {
      width: isMobile ? "80%" : "40%", // Adjust width for mobile
      borderRadius: "15px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      // backgroundColor: "#fff",
      overflow: "hidden",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "var(--navbar-background) ", 

    },
    profileHeader: {
      backgroundColor: "var(--secondary-color)",
      color: "#fff",
      padding: isMobile ? "10px" : "15px", // Adjust padding for mobile
      fontSize: isMobile ? "16px" : "18px", // Adjust font size
      fontWeight: "bold",
    },
    profileContent: {
      backgroundColor: "var(--navbar-background)", 
      padding: isMobile ? "15px" : "20px",
    },
    profileImage: {
      display: "inline-block",
      width: isMobile ? "60px" : "80px", // Adjust size for mobile
      height: isMobile ? "60px" : "80px",
      borderRadius: "50%",
      marginBottom: isMobile ? "10px" : "15px",
      border: "3px solid #fff",
      boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    },
    profileDetails: {
      backgroundColor: "var(--navbar-background) ", 

      marginBottom: isMobile ? "15px" : "20px",
    },
    detailSection: {
      backgroundColor: "var(--navbar-background) ", 

      display: "flex",
      justifyContent: "space-between",
      marginBottom: isMobile ? "10px" : "15px",
      paddingBottom: isMobile ? "5px" : "10px",
      borderBottom: "1px solid #e0e0e0", // Light gray line
    },
    lastDetailSection: {
      backgroundColor: "var(--navbar-background) ", 

      display: "flex",
      justifyContent: "space-between",
      marginBottom: isMobile ? "15px" : "20px",
    },
    label: {
      display: "block",
      fontSize: isMobile ? "10px" : "12px", // Adjust font size
      color: "#888",
    },
    value: {
      fontSize: isMobile ? "12px" : "14px", // Adjust font size
      fontWeight: "bold",
    },
    editButton: {
      width: "100%",
      backgroundColor: "#ed4b00", // Orange
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      padding: isMobile ? "8px 15px" : "10px 20px", // Adjust padding
      fontSize: isMobile ? "12px" : "14px", // Adjust font size
      cursor: "pointer",
    },
    editButtonHover: {
      backgroundColor: "var(--light-orange)",
    },
  };

  return (
    <div style={styles.container}>
      <div style={{
      width: isMobile ? "80%" : "40%", // Adjust width for mobile
      borderRadius: "15px",
      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
      // backgroundColor: "#fff",
      overflow: "hidden",
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "var(--navbar-background) ", 

    }}>
        <div style={styles.profileHeader}>{agent.username}</div>
        <div style={styles.profileContent}>
          <img
            src={
              agent.image ||
              "https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"
            }
            alt="Jane Smith"
            style={styles.profileImage}
          />
          <div style={styles.profileDetails}>
            <div style={styles.detailSection}>
              <span style={styles.label}>USERNAME</span>
              <span style={styles.value}>{agent.username}</span>
            </div>
            <div style={styles.detailSection}>
              <span style={styles.label}>EMAIL</span>
              <span style={styles.value}>{agent.email}</span>
            </div>
            <div style={styles.detailSection}>
              <span style={styles.label}>PHONE</span>
              <span style={styles.value}>{agent.phone}</span>
            </div>
            <div style={styles.lastDetailSection}>
              <span style={styles.label}>TITLE</span>
              <span style={styles.value}>{agent.title}</span>
            </div>
          </div>
          <button
            style={styles.editButton}
            onMouseEnter={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor =
                styles.editButtonHover.backgroundColor;
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLButtonElement).style.backgroundColor =
                styles.editButton.backgroundColor;
            }}
          >
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
