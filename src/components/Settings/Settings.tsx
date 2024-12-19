import React, { useState } from "react";
import { DiGitBranch } from "react-icons/di";
import { BsPersonFillGear } from "react-icons/bs";
import { MdOutlineEditNotifications } from "react-icons/md";
import { AiFillInstagram } from "react-icons/ai";

import "./Settings.css"; // Import the CSS file

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");

  const handleLogin = () => {
    const appId = process.env.NEXT_PUBLIC_FACEBOOK_APP_ID;
    const redirectUri = process.env.NEXT_PUBLIC_FACEBOOK_REDIRECT_URI;
    const permissions = [
      "instagram_basic",
      "instagram_manage_messages",
      "pages_manage_metadata",
      "pages_show_list",
      "business_management",
    ].join(",");

    const loginUrl = `https://www.facebook.com/v21.0/dialog/oauth?client_id=${appId}&redirect_uri=${redirectUri}&scope=${permissions}&response_type=code`;

    window.location.href = loginUrl;
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div>
            <h2 className="section-title">Profile Settings</h2>
            <div className="form-group">
              <label>Name:</label>
              <input type="text" placeholder="Your Name" className="input" />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" placeholder="Your Email" className="input" />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input type="tel" placeholder="Your Phone" className="input" />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input type="password" placeholder="New Password" className="input" />
            </div>
            <button className="save-button">Save Changes</button>
          </div>
        );
      case "automation":
        return (
          <div>
            <h2 className="section-title">Automation Settings</h2>
            <div className="form-group">
              <label>Default Automation Type:</label>
              <select className="input">
                <option>Reply to Comment</option>
                <option>Send DM</option>
                <option>Comment+DM</option>
              </select>
            </div>
            <div className="form-group">
              <label>Max Daily Automations:</label>
              <input type="number" placeholder="Number of automations" className="input" />
            </div>
            <div className="form-group">
              <label>Message Delay:</label>
              <input
                type="number"
                placeholder="Message Delay between automations"
                className="input"
              />
            </div>
            <button className="save-button">Save Changes</button>
          </div>
        );
      case "notifications":
        return (
          <div>
            <h2 className="section-title">Notification Settings</h2>
            <div className="form-group">
              <label>
                <input type="checkbox" /> Email Notifications
              </label>
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" /> Push Notifications
              </label>
            </div>
            <div className="form-group">
              <label>
                <input type="checkbox" /> There is a new conversation in unassigned chats
              </label>
            </div>
            <button className="save-button">Save Changes</button>
          </div>
        );
      case "account":
        return (
          <div>
            <h2 className="section-title">Account Settings</h2>
            <div className="form-group">
              <p>Connected Instagram Account:</p>
              <p className="connected-account">@current_username</p>
              <button className="disconnect-button">Disconnect Account</button>
            </div>
            <button onClick={handleLogin} className="save-button">
              Re-authenticate
            </button>
          </div>
        );
      default:
        return <div>Select a tab to view settings.</div>;
    }
  };

  return (
    <div className="settings-container">
      <div className="sidebar">
        <button
          className={`tab ${activeTab === "profile" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          <BsPersonFillGear className="settings-icon" />
          <span className="button-text">Profile</span>
        </button>
        <button
          className={`tab ${activeTab === "automation" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("automation")}
        >
          <DiGitBranch className="settings-icon" />
          <span className="button-text">Automation</span>
        </button>
        <button
          className={`tab ${activeTab === "notifications" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("notifications")}
        >
          <MdOutlineEditNotifications className="settings-icon" />
          <span className="button-text">Notifications</span>
        </button>
        <button
          className={`tab ${activeTab === "account" ? "active-tab" : ""}`}
          onClick={() => setActiveTab("account")}
        >
          <AiFillInstagram className="settings-icon" />
          <span className="button-text">Account</span>
        </button>
      </div>
      <div className="good-content">{renderTabContent()}</div>
    </div>
  );
};

export default Settings;
