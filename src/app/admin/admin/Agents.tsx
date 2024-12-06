import React, { useState, useEffect } from "react";
import AddAgent from "./AddAgent";
import ProfileCard from "./ProfileCard";
import "../../../styles/index.css";
import "../../../styles/globals.css";

const Agent = () => {
  const [agents, setAgents] = useState([]); // Store agents from the database
  const [selectedContent, setSelectedContent] = useState(null); // Render ProfileCard component
  const [showRightDiv, setShowRightDiv] = useState(false);

  useEffect(() => {
    // Fetch agents from the API
    const fetchAgents = async () => {
      try {
        const response = await fetch("/api/getAgents");
        const result = await response.json();
        if (response.ok) {
          setAgents(result.agents); // Set the fetched agents
        } else {
          console.error("Error fetching agents:", result.error);
        }
      } catch (error) {
        console.error("Error fetching agents:", error);
      }
    };

    fetchAgents();
  }, []);

  const toggleDivs = () => {
    setShowRightDiv(!showRightDiv);
  };

  return (
    <div style={{ margin: "-1rem" }}>
      <div
        className="back-arrow"
        onClick={toggleDivs}
        style={{
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0)",
          backgroundColor: "white",
          border: "0px solid #ffffff",
          margin: "-1rem ",
        }}
      >
        ← Agents
      </div>

      <div
        className="contentt"
        style={{
          padding: "0",
          marginLeft:0,
          margin: "1rem",
          border: "0",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0)",
        }}
      >
        {/* Left Div with Buttons */}
        <div
          className={`left-div ${showRightDiv ? "hide" : "show"}`}
          style={{ overflow: "auto", borderRadius: "0", paddingRight: 20 }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label>Create new moderator account </label>
            <button
              style={{
                backgroundColor: "var(--create-button-color)",
                color: "#fff",
                width: "30%",
                marginTop: 4,
                padding: 4,
                textAlign: "center",
                display: "block",
                margin: "0",
              }}
              onClick={() => setSelectedContent(<AddAgent />)}
            >
              New +
            </button>
          </div>

          {/* Render agent buttons dynamically */}
          {agents.map((agent) => (
            <button
              key={agent.agent_id}
              style={{
                alignContent: "left",
                display: "flex",
                alignItems: "center",
                marginBottom: "0.5rem",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "4px",
                backgroundColor: "#f9f9f9",
                cursor: "pointer",
              }}
              onClick={() =>
                setSelectedContent(
                  <ProfileCard
                    name={agent.name}
                    username={agent.username}
                    email={agent.email}
                    phone={agent.phone}
                    title={agent.title}
                    image="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"
                  />
                )
              }
            >
              <img
                src="https://img.freepik.com/free-vector/smiling-young-man-illustration_1308-174669.jpg"
                height={20}
                width={20}
                alt="No Image"
                style={{ marginRight: "0.5rem", borderRadius: "50%" }}
              />
              {agent.username}
            </button>
          ))}
        </div>

        {/* Right Div for Displaying Content */}
        <div
          className={`right-div ${showRightDiv ? "show" : "hide"}`}
          style={{ borderRadius: 0 , padding:0}}
        >
          
            {selectedContent || "Select a button to see content here."}
          
        </div>
      </div>
    </div>
  );
};

export default Agent;
