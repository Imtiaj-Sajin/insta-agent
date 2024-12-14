import React, { useState, useEffect, FC } from "react";
import AddAgent from "./AddAgent";
import ProfileCard from "./ProfileCard";
import "../../../styles/index.css";
import "../../../styles/globals.css";
import "./Automation.css";

interface AgentData {
  agent_id: string;
  name: string;
  username: string;
  email: string;
  phone: string;
  title: string;
  image: string;
}

const Agent: FC = () => {
  const [agents, setAgents] = useState<AgentData[]>([]); // Store agents from the database
  const [selectedContent, setSelectedContent] = useState<React.ReactNode>(""); // Render ProfileCard component
  const [showRightDiv, setShowRightDiv] = useState<boolean>(false);

  useEffect(() => {
    // Fetch agents from the API
    const fetchAgents = async (): Promise<void> => {
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

  const toggleDivs = (forceShowRightDiv?: boolean): void => {
    if (typeof forceShowRightDiv === "boolean") {
      setShowRightDiv(forceShowRightDiv); // Directly set based on parameter
    } else {
      setShowRightDiv(!showRightDiv); // Toggle if no parameter provided
    }
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
            <label>Create new moderator account</label>
            <button
              style={{
                backgroundColor: "var(--navbar-active-bg)",
                color: "#fff",
                width: "30%",
                marginTop: 4,
                padding: 4,
                textAlign: "center",
                display: "block",
                margin: "0",
              }}
              onClick={() => {
                setSelectedContent(
                  <AddAgent />
                );
                toggleDivs(true); // Force the right-div to show
              }}
            >
              New +
            </button>
          </div>

          {/* Agent Buttons */}
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
              onClick={() => {
                setSelectedContent(
                  <ProfileCard agent={agent}/>
                );
                toggleDivs(true); // Force the right-div to show
              }}
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
        </div>

        {/* Right Div */}
        <div
          className={`right-div ${showRightDiv ? "show" : "hide"}`}
          style={{ borderRadius: 0, padding: 0 }}
        >
          <div
            className="back-arrow"
            onClick={()=>(toggleDivs(false))}
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
            ← Agents
          </div>
          <div
            id="content-display"
            style={{
              margin: 0,
              padding: 0,
              boxShadow: "0 0px 0px rgba(0, 0, 0, 0)",
              border: 0,
              marginBottom: 0,
              height:"100%",
              // background:"red",
            }}
          >
            {selectedContent || (
              <div style={{ textAlign: "center" }}>
                Select an agent to view details or create a new agent.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Agent;
