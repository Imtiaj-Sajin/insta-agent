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
  const [loading, setLoading] = useState<boolean>(true); // Track loading state
  const [selectedContent, setSelectedContent] = useState<React.ReactNode>("");
  const [showRightDiv, setShowRightDiv] = useState<boolean>(false);

  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchAutomations = async (): Promise<void> => {
      try {
        const response = await fetch("/api/getAutomations");
        const data: AutomationData[] = await response.json();
        setAutomations(data);
      } catch (error) {
        console.error("Error fetching automations:", error);
      } finally{
        setLoading(false);
      }
    };
    fetchAutomations();
  }, []);

  const showContent = (automation: AutomationData): void => {
    setSelectedContent(
      <AutomationDetails
        auto_id={automation.auto_id}
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
    <div style={{  padding:'0rem'}}>
      

      <div
        className="contentt"
        style={{
          // background:'red',
          // padding: "1rem",
          // margin: "1 rem",
          // border: "10",
          // boxShadow: "0 4px 8px rgba(0, 0, 0, 0)",
        }}
      >
        {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
          >
            <button
              style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                // background: "red",
                color: "var(--navbar-active-bg)",
                border: "none",
                borderRadius: "50%",
                padding: "0.5rem",
                cursor: "pointer",
              }}
              onClick={() => setShowModal(false)}
            >
              ✖
            </button>
            <CreateAutomation />
          </div>
        </div>
      )}  
        <div
          className={`left-div ${showRightDiv ? "hide" : "show"}`}
          style={{}}
        >
          <div className="sticky-button-holder" style={{ display: "flex", flexDirection: "column", width:'100%',padding:4 }}>
            <label htmlFor="">Create new automation</label>
            <button className=""
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
              onClick={() =>  setShowModal(true)}
            >
              New
            </button>
          </div>
          <div style={{overflow:"auto",width:"100%",height:'100%', 
                scrollbarWidth: "none",msOverflowStyle: "none",
                paddingBottom:'200px',
                background:"var(--navbar-background)"}}>

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
              : automations.map((automation) => (
                <button
                  className="right-show-btn"
                  key={automation.auto_id}
                  onClick={() => showContent(automation)}
                  style={{
                    
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
          
        </div>

        <div
          className={`right-div ${showRightDiv ? "show" : "hide"}`}
          style={{ borderRadius: 0, margin: 0, padding: 0, paddingTop: 0, background:"var(--background-color)"}}
        >
          <div
            className="back-arrow"
            onClick={toggleDivs}
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
            ← Automation
          </div>

          <div
            id="content-display"
            style={{
              // background:"var(--background-color)",
              margin: 0,
              padding: 0,
              boxShadow: "0 0px 0px rgba(0, 0, 0, 0)",
              border: 0,
              marginBottom: 0,
            }}
          >
            {selectedContent || <div style={{display:'center'}}> Select any Automation or Create a new automation.</div> }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Automation;
