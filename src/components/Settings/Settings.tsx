import React, { useEffect, useState } from "react";
import { DiGitBranch } from "react-icons/di";
import { BsPersonFillGear } from "react-icons/bs";
import { MdOutlineEditNotifications } from "react-icons/md";
import { AiFillInstagram } from "react-icons/ai";

import "./Settings.css"; // Import the CSS file
import { signOut } from "next-auth/react";
import AutomationSlider from "../Slider/Slider"; // Import your AutomationSlider component

const Settings = () => {
  const [pageAccessToken, setPageAccessToken] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [settings, setSettings] = useState({
      maxDailyAutomations: "",
      cyclesBeforeRest: "",
      restTime: "",
      messageMin: 0, // Add messageMin, messageMax, commentMin, commentMax to state
      messageMax: 0,
      commentMin: 0,
      commentMax: 0,
    });
    const [messageMin, setMessageMin] = useState(100); 
    const [messageMax, setMessageMax] = useState(300);
    const [commentMin, setCommentMin] = useState(10);
    const [commentMax, setCommentMax] = useState(180);
  
    // const handleMessageDelayChange = (min: number, max: number) => {
    //   setMessageMin(min);
    //   setMessageMax(max);
    // };
  
    // const handleCommentDelayChange = (min: number, max: number) => {
    //   setCommentMin(min);
    //   setCommentMax(max);
    // };
  
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetchSettings = async () => {
        try {
          const response = await fetch(`/api/automationsettings`);
          if (response.ok) {
            const data = await response.json();
            console.log("data get==> ", data);
            setSettings({
              maxDailyAutomations: data.dailyauto || "",
              cyclesBeforeRest: data.cycle || "",
              restTime: data.notaskrest || "",
              messageMin: data.messagemin || 100, // Set fetched value for messageMin
              messageMax: data.messagemax || 300, // Set fetched value for messageMax
              commentMin: data.commentmin || 10, // Set fetched value for commentMin
              commentMax: data.commentmax || 180, // Set fetched value for commentMax
    
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
  
    const handleMessageDelayChange = (min: number, max: number) => {
      setSettings((prev) => ({ ...prev, messageMin: min, messageMax: max }));
    };
  
    const handleCommentDelayChange = (min: number, max: number) => {
      setSettings((prev) => ({ ...prev, commentMin: min, commentMax: max }));
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
            messagemin: settings.messageMin, // Send messageMin value
            messagemax: settings.messageMax, // Send messageMax value
            commentmin: settings.commentMin, // Send commentMin value
            commentmax: settings.commentMax, // Send commentMax value  
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

    const handleDisconnect = () => {
      console.log("Disconnecting account...");
    };
    

  // Exchange token function: This will exchange the 'code' for a page access token
  const exchangeToken = async (code: string) => {
    try {
      const tokenResponse = await fetch('/api/exchange-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code }), // Send the code to exchange for the token
      });

      const tokenData = await tokenResponse.json();

      if (tokenResponse.ok) {
        const accessToken = tokenData.pageAccessToken;
        console.log('Page access token retrieved via exchange-token API:', accessToken);
        setPageAccessToken(accessToken); // Store the access token in state
      } else {
        console.error('Failed to exchange token:', tokenData.error);
      }
    } catch (err) {
      console.error('Error handling token exchange process:', err);
    }
  };
  
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

    // Capture code and exchange token after redirect
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      if (code) {
        console.log('Authorization code received:', code);
        if (!pageAccessToken) {
          exchangeToken(code); // Exchange code for the access token
        }
      } else {
        console.error('Authorization code not found');
      }
    }, [pageAccessToken]);

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
              {/* <div className="form-group">
                <label>Default Automation Type:</label>
                <select className="input">
                  <option>Reply to Comment</option>
                  <option>Send DM</option>
                  <option>Comment+DM</option>
                </select>
              </div> */}
              <div className="form-group">
                <label>Max Daily Automations:</label>
                <input
                  type="number"
                  placeholder="Number of automations"
                  className="input"
                  value={settings.maxDailyAutomations}
                  onChange={(e) => handleChange("maxDailyAutomations", e.target.value)}
                />              </div>
              {/* <AutomationSlider min={settings.min} max={settings.max}/> Slider for automation delay */}
              <AutomationSlider
                messageMin={settings.messageMin}
                messageMax={settings.messageMax}
                commentMin={settings.commentMin}
                commentMax={settings.commentMax}
                onMessageDelayChange={handleMessageDelayChange}
                onCommentDelayChange={handleCommentDelayChange}
              />
              {/* <AutomationSlider min={settings.min} max={settings.max}/>  */}
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
<>
<h2 className="section-title">Account Settings</h2>
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      width: "100%", // Adjusted for wider width
      margin: "0",
      backgroundColor: "#f9f9f9",
    }}
  >
    {/* Main Div */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap", // Ensures wrapping on mobile
        width: "100%",
      }}
    >
      {/* Photo Div */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginRight: "10px",
          marginBottom: "10px", // Adds spacing for mobile wrapping
        }}
      >
        <img
          src="/placeholder-photo.jpg" // Replace with the actual photo URL
          alt="Profile"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            marginRight: "10px",
            objectFit: "cover",
            border: "2px solid #ddd",
          }}
        />
        {/* Labels for Name and Username */}
        <div>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "1rem",
              margin: "0",
              color: "#333",
            }}
          >
            John Doe {/* Replace with dynamic name */}
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              margin: "0",
              color: "#555",
            }}
          >
            @johndoe {/* Replace with dynamic username */}
          </p>
        </div>
      </div>

      {/* Buttons Div */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap", // Wrap buttons on mobile
        }}
      >
        <button
          style={{
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor: "#5bc0de",
            color: "#fff",
          }}
          onClick={handleLogin}
        >
          Re-authenticate
        </button>
        <button
          style={{
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor: "#f0ad4e",
            color: "#fff",
          }}
          onClick={handleDisconnect}
        >
          Disconnect Account
        </button>
      </div>
    </div>
  </div>

  {/* Logout Button */}
  <div
    style={{
      textAlign: "center",
      width: "100%",
      marginTop: "30px", // Spacing between div and logout button
    }}
  >
    <button
      style={{
        padding: "10px 15px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        backgroundColor: "#d9534f",
        color: "#fff",
        width: "100%",
      }}
      onClick={() =>signOut()}
    >
      Logout
    </button>
  </div>
  <br />
  <br />
  <div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "20px 0",
    fontSize: "1rem",
    fontWeight: "bold",
    color: "#555",
    textTransform: "uppercase",
  }}
>
  <span
    style={{
      flex: "1",
      borderBottom: "1px solid #ccc",
      margin: "0 10px",
    }}
  ></span>
  Disconnected Account
  <span
    style={{
      flex: "1",
      borderBottom: "1px solid #ccc",
      margin: "0 10px",
    }}
  ></span>
</div>
<br />
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "flex-start",
      padding: "20px",
      border: "1px solid #ddd",
      borderRadius: "8px",
      width: "100%", // Adjusted for wider width
      margin: "0",
      backgroundColor: "#f0f8ff",
    }}
  >
    {/* Main Div */}
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap", // Ensures wrapping on mobile
        width: "100%",
      }}
    >
      {/* Photo Div */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginRight: "10px",
          marginBottom: "10px", // Adds spacing for mobile wrapping
        }}
      >
        <img
          src="/placeholder-photo.jpg" // Replace with the actual photo URL
          alt="Profile"
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "50%",
            marginRight: "10px",
            objectFit: "cover",
            border: "2px dashed #ccc",
          }}
        />
        {/* Labels for Name and Username */}
        <div>
          <p
            style={{
              fontWeight: "bold",
              fontSize: "1rem",
              margin: "0",
              color: "#333",
            }}
          >
            John Doe {/* Replace with dynamic name */}
          </p>
          <p
            style={{
              fontSize: "0.9rem",
              margin: "0",
              color: "#555",
            }}
          >
            @johndoe {/* Replace with dynamic username */}
          </p>
        </div>
      </div>

      {/* Buttons Div */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          flexWrap: "wrap", // Wrap buttons on mobile
        }}
      >
        <button
          style={{
            padding: "10px 15px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            backgroundColor: "#5cb85c",
            color: "#fff",
          }}
          onClick={handleDisconnect}
        >
          Connect Account
        </button>
      </div>
    </div>
  </div>
</>


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
