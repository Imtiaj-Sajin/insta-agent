import React, { useState, useEffect, FC } from "react";
import "./Automation.css";
import CreateAutomation from "./CreateAutomation";
import AutomationDetails from "./automationDetails/AutomationDetails";

interface AutomationData {
  auto_id: string;
  post_id: string;
  auto_type: number;
  keywords: string[];
  comment_answers: string[];
  dm_answers: string[];
}

const Automation: FC = () => {
  const [automations, setAutomations] = useState<AutomationData[]>([]);
  const [selectedContent, setSelectedContent] = useState<React.ReactNode>("");
  const [showRightDiv, setShowRightDiv] = useState<boolean>(false);

  useEffect(() => {
    const fetchAutomations = async (): Promise<void> => {
      try {
        const response = await fetch("/api/getAutomations");
        const data: AutomationData[] = await response.json();
        setAutomations(data);
      } catch (error) {
        console.error("Error fetching automations:", error);
      }
    };
    fetchAutomations();
  }, []);

  const showContent = (automation: AutomationData): void => {
    setSelectedContent(
      <AutomationDetails
        post_id={automation.post_id}
        auto_type={automation.auto_type}
        keywords={automation.keywords}
        comment_answers={automation.comment_answers}
        dm_answers={automation.dm_answers}
      />
    );
    setShowRightDiv(window.innerWidth < 768);
  };

  const toggleDivs = (): void => {
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
        ← Automation
      </div>

      <div
        className="contentt"
        style={{
          padding: "0",
          margin: "1 rem",
          border: "0",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0)",
        }}
      >
        <div
          className={`left-div ${showRightDiv ? "hide" : "show"}`}
          style={{ overflow: "auto", borderRadius: "0" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label htmlFor="">Create new automation</label>
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
              onClick={() => setSelectedContent(<CreateAutomation />)}
            >
              New
            </button>
          </div>

          {automations.map((automation) => (
            <button
              key={automation.auto_id}
              onClick={() => showContent(automation)}
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
            >
              {automation.auto_type === 1
                ? `Comment: ${automation.post_id}`
                : automation.auto_type === 2
                ? `DM: ${automation.post_id}`
                : `DM+Comment: ${automation.post_id}`}
            </button>
          ))}
        </div>

        <div
          className={`right-div ${showRightDiv ? "show" : "hide"}`}
          style={{ borderRadius: 0, margin: 0, padding: 0, paddingTop: 10 }}
        >
          <div
            id="content-display"
            style={{
              margin: 0,
              padding: 0,
              boxShadow: "0 0px 0px rgba(0, 0, 0, 0)",
              border: 0,
              marginBottom: 200,
            }}
          >
            {selectedContent || "Select a button to see content here."}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Automation;
