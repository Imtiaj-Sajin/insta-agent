import React, { useState } from "react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const handleLogin = () => {
    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    const redirectUri = process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI;
    const permissions = [
        'instagram_basic',
        'instagram_manage_messages',
        'pages_manage_metadata',
        'pages_show_list',
        'business_management'
    ].join(',');

    const loginUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${permissions}&response_type=code`;

    window.location.href = loginUrl;
};

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <span>
            <h2 style={styles.sectionTitle}>Profile Settings</h2>
            <span style={styles.formGroup}>
              <label>Name:</label>
              <input type="text" placeholder="Your Name" style={styles.input} />
            </span>
            <span style={styles.formGroup}>
              <label>Email:</label>
              <input type="email" placeholder="Your Email" style={styles.input} />
            </span>
            <span style={styles.formGroup}>
              <label>Phone:</label>
              <input type="tel" placeholder="Your Phone" style={styles.input} />
            </span>
            <span style={styles.formGroup}>
              <label>Password:</label>
              <input type="password" placeholder="New Password" style={styles.input} />
            </span>
            <button style={styles.saveButton}>Save Changes</button>
          </span>
        );
      case "automation":
        return (
          <span>
            <h2 style={styles.sectionTitle}>Automation Settings</h2>
            <span style={styles.formGroup}>
              <label>Default Automation Type:</label>
              <select style={styles.input}>
                <option>Reply to Comment</option>
                <option>Send DM</option>
                <option>Comment+DM</option>
              </select>
            </span>
            <span style={styles.formGroup}>
              <label>Max Daily Automations:</label>
              <input type="number" placeholder="Number of automations" style={styles.input} />
            </span>
            <span style={styles.formGroup}>
              <label>Message Delay:</label>
              <input
                type="number"
                placeholder="Message Delay between automations"
                style={styles.input}
              />
            </span>
            <button style={styles.saveButton}>Save Changes</button>
          </span>
        );
      case "notifications":
        return (
          <span>
            <h2 style={styles.sectionTitle}>Notification Settings</h2>
            <span style={styles.formGroup}>
              <label>
                <input type="checkbox" /> Email Notifications
              </label>
            </span>
            <span style={styles.formGroup}>
              <label>
                <input type="checkbox" /> Push Notifications
              </label>
            </span>
            <span style={styles.formGroup}>
              <label>
                <input type="checkbox" /> There is a new conversation in unassigned chats
              </label>
            </span>
            <button style={styles.saveButton}>Save Changes</button>
          </span>
        );
      case "account":
        return (
          <span>
            <h2 style={styles.sectionTitle}>Account Settings</h2>
            <span style={styles.formGroup}>
              <p>Connected Instagram Account:</p>
              <p style={{ fontWeight: "bold" }}>@current_username</p>
              <button style={styles.disconnectButton}>Disconnect Account</button>
            </span>
            <button onClick={handleLogin} style={styles.saveButton}>Re-authenticate</button>
          </span>
        );
      default:
        return <span>Select a tab to view settings.</span>;
    }
  };

  return (
    <span style={styles.container}>
      <span style={styles.sidebar}>
        <button
          style={activeTab === "profile" ? { ...styles.tab, ...styles.activeTab } : styles.tab}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </button>
        <button
          style={activeTab === "automation" ? { ...styles.tab, ...styles.activeTab } : styles.tab}
          onClick={() => setActiveTab("automation")}
        >
          Automation
        </button>
        <button
          style={activeTab === "notifications" ? { ...styles.tab, ...styles.activeTab } : styles.tab}
          onClick={() => setActiveTab("notifications")}
        >
          Notifications
        </button>
        <button
          style={activeTab === "account" ? { ...styles.tab, ...styles.activeTab } : styles.tab}
          onClick={() => setActiveTab("account")}
        >
          Account
        </button>
      </span>
      <span style={styles.content}>{renderTabContent()}</span>
    </span>
  );
};

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    padding: "0px",
    margin: "0px",
  },
  sidebar: {
    width: "15%",
    background: "#ffffff",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  tab: {
    color: "#393939",
    padding: "10px 15px",
    borderRadius: "5px",
    cursor: "pointer",
    textAlign: "left",
    border: "none",
    fontSize: "1rem",
    transition: "all 0.3s ease",
    background: "transparent", // Default background
  },
  activeTab: {
    color: "#6a4898",
    fontWeight: "bold",
    textDecoration: "underline",
    // background: "#e8e8e8", // Background for active tab
  },
  content: {
    flex: 1,
    padding: "50px",
    background: "white",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    marginBottom: "20px",
    color: "#333",
  },
  formGroup: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  saveButton: {
    padding: "10px 20px",
    background: "#49267e",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  disconnectButton: {
    padding: "10px 20px",
    background: "#d76d77",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Settings;
