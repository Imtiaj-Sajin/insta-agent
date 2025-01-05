import React, { useEffect, useState } from "react";
import { DiGitBranch } from "react-icons/di";
import { BsPersonFillGear } from "react-icons/bs";
import { MdOutlineEditNotifications } from "react-icons/md";
import { AiFillInstagram } from "react-icons/ai";

import "./Settings.css"; // Import the CSS file
import { signOut } from "next-auth/react";
import AutomationSlider from "../Slider/Slider"; // Import your AutomationSlider component

const Settings = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState({
      defaultAutomationType: "Reply to Comment",
      maxDailyAutomations: "",
      cyclesBeforeRest: "",
      restTime: "",
      min: "",
      max: "",
    });
  
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchSettings = async () => {
        try {
          const response = await fetch(`/api/automationsettings`);
          if (response.ok) {
            const data = await response.json();
            setSettings({
              defaultAutomationType: data.defaultAutomationType || "Reply to Comment",
              maxDailyAutomations: data.dailyauto || "",
              cyclesBeforeRest: data.cycle || "",
              restTime: data.notaskrest || "",
              min: data.min || "",
              max: data.max || "",
            });
          } else {
            console.error("Failed to fetch settings");
          }
        } catch (error) {
          console.error("Error fetching automation settings:", error);
        } finally {
          setLoading(false);
        }
      };
  
      fetchSettings();
    },[]);
  
    const handleChange = (field:any, value:any) => {
      setSettings((prev) => ({ ...prev, [field]: value }));
    };
  
    const saveChanges = async () => {
      try {
        const response = await fetch(`/api/automationsettings`, {
          method: "POST", // Use POST or PUT as appropriate
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dailyauto: settings.maxDailyAutomations,
            cycle: settings.cyclesBeforeRest,
            notaskrest: settings.restTime,
          }),
        });
  
        if (response.ok) {
          alert("Settings saved successfully!");
        } else {
          const errorData = await response.json();
          console.error("Error saving automation settings:", errorData);
          alert("Failed to save settings.");
        }
      } catch (error) {
        console.error("Error saving automation settings:", error);
        alert("Failed to save settings.");
      }
    }

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
            <div className='autoSettBody' style={{maxHeight:'80vh',overflowY:'auto'}}>
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
                <input
                  type="number"
                  placeholder="Number of automations"
                  className="input"
                  value={settings.maxDailyAutomations}
                  onChange={(e) => handleChange("maxDailyAutomations", e.target.value)}
                />              </div>
              <AutomationSlider min={settings.min} max={settings.max}/> {/* Slider for automation delay */}
              <div className="form-group">
                <label>Number of Cycles Before Rest:</label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  placeholder="Number of cycles"
                  className="input"
                  value={settings.cyclesBeforeRest}
                  onChange={(e) => handleChange("cyclesBeforeRest", e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Rest Time (No Tasks):</label>
                <input
                  type="number"
                  min={1}
                  max={60}
                  placeholder="Rest time in minutes"
                  className="input"
                  value={settings.restTime}
                  onChange={(e) => handleChange("restTime", e.target.value)}
                />
                <small className="description">
                  If there are no tasks for the specified cycles, the automation will rest for this duration (in minutes).
                </small>
              </div>
              <button className="save-button" style={{marginTop:"1rem"}} onClick={saveChanges}>Save Changes</button>
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
              <button className="save-button">Disconnect Account</button>
            </div>
            <button onClick={handleLogin} className="save-button">
              Re-authenticate
            </button>
            <br/>
            <br/>
            <button className="save-button" >
              <span onClick={() => signOut()}>Logout</span>
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
