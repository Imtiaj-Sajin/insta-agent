import React, { FC, useEffect, useRef, useState } from "react"; // Add useState
  import * as d3 from "d3";
  import cytoscape from "cytoscape";
  import { drawConnections } from "./drawConnections";


  import "./AutomationDetails.css";

  interface AutomationDetailsProps {
    auto_id: string;
    post_id: string;
    auto_type: number;
    keywords: string[];
    comment_answers: string[];
    dm_answers: string[];
  }

  const AutomationDetails: FC<AutomationDetailsProps> = ({
    auto_id,
    post_id,
    auto_type,
    keywords,
    comment_answers,
    dm_answers,
  }) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isAddingKeywords, setIsAddingKeywords] = useState(false);
    const [isAddingComments, setIsAddingComments] = useState(false);
    const [isAddingDMs, setIsAddingDMs] = useState(false);
  
    const [newKeyword, setNewKeyword] = useState("");
    const [newComment, setNewComment] = useState("");
    const [newDM, setNewDM] = useState("");
  
    const [editedKeywords, setEditedKeywords] = useState([...keywords]);
    const [editedComments, setEditedComments] = useState([...comment_answers]);
    const [editedDMs, setEditedDMs] = useState([...dm_answers]);
  
    const containerRef = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);


    const removeAttachment = (index: number) => {
      const updatedDMAnswers = [...dm_answers];
      updatedDMAnswers.splice(index, 1);
    };

  useEffect(() => {
    setEditedKeywords([...keywords]);
    setEditedComments([...comment_answers]);
    setEditedDMs([...dm_answers]);
  }, [keywords, comment_answers, dm_answers]);

  const toggleEditMode = () => {
    setIsEditMode((prev) => !prev); // Toggle edit mode
    setIsAddingKeywords(false);
    setIsAddingComments(false);
    setIsAddingDMs(false);
  };

  useEffect(() => {
    const container = containerRef.current;
    const svg = d3.select(svgRef.current);
  
    if (!container) return;
  
    const connections = [
      { source: "exit_1", target: "entry_2" },
      { source: "exit_2", target: "entry_3" },
      { source: "exit_2", target: "entry_4" },
    ];
  
    // Delay the connection update until after the layout stabilizes
    const updateConnections = () => {
      drawConnections({ container, svg, connections });
    };
  
    // Allow layout updates to complete before drawing connections
    const timeoutId = setTimeout(updateConnections, 0);
  
    // Attach drag behavior
    const draggables = container.querySelectorAll(".detail-card");
    draggables.forEach((card) => {
      const handle = card.querySelector(".drag-handle") as HTMLElement;
      let isDragging = false;
      let offsetX = 25;
      let offsetY = 55;
  
      const onMouseDown = () => {
        isDragging = true;
        document.body.style.cursor = "grabbing";
      };
  
      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;
  
        const containerRect = container.getBoundingClientRect();
  
        const newLeft = Math.max(
          0,
          Math.min(
            container.offsetWidth - card.clientWidth,
            e.clientX - containerRect.left - offsetX
          )
        );
        const newTop = Math.max(
          0,
          Math.min(
            container.offsetHeight - card.clientHeight,
            e.clientY - containerRect.top - offsetY
          )
        );
  
        (card as HTMLElement).style.left = `${newLeft}px`;
        (card as HTMLElement).style.top = `${newTop}px`;
  
        updateConnections(); // Update connections on drag
      };
  
      const onMouseUp = () => {
        isDragging = false;
        document.body.style.cursor = "default";
      };
  
      handle.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    });
  
    // Cleanup listeners and timeout
    return () => {
      clearTimeout(timeoutId);
      svg.selectAll("*").remove();
    };
  }, [post_id, auto_type, keywords, comment_answers, dm_answers]);
  
  const addNewItem = (
    type: "keywords" | "comments" | "dms",
    value: string
  ) => {
    if (value.trim() === "") return;
    if (type === "keywords") setEditedKeywords([...editedKeywords, value]);
    if (type === "comments") setEditedComments([...editedComments, value]);
    if (type === "dms") setEditedDMs([...editedDMs, value]);

    if (type === "keywords") setNewKeyword("");
    if (type === "comments") setNewComment("");
    if (type === "dms") setNewDM("");
  };

    return (
      <div ref={containerRef} className="automation-details-container">
        {/* SVG for connections */}
        <button
        onClick={toggleEditMode}
        style={{
          // position: 'absolute',
          top: 100,
          right: 30,
          background: '#49267e',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: 50,
          height: 50,
          cursor: 'pointer',
          position:"fixed",
        }}
      >
        {isEditMode ? "✔" : "🖍"}
      </button>

      <button
        // onClick={pauseFunction} 
        style={{
          top: 160,  
                    right: 30,
          background: '#49267e',
          color: 'white',
          border: 'none',
          borderRadius: '50%',
          width: 50,
          height: 50,
          cursor: 'pointer',
          position: "fixed",
        }}
      >
        ▶
      </button> 
        <svg
          ref={svgRef}
          className="connection-layer"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
        />

        {/* Main Details Card */}
        <div className="detail-card" style={{ top: "20%", left: "20px"}}>
          <span id="exit_1" className="exit-point"></span>
          <div className="drag-handle"></div>
          <h3>Automation Details</h3>
          <p><strong>Post ID:</strong> {post_id}  ({auto_id})</p>
          <p>
            <strong>Type:</strong>{" "}
            {auto_type === 1 ? "Reply to Comment" : auto_type === 2 ? "Send DM" : "DM + Comment"}
          </p>
        </div>

        {/* Keywords Box */}
        <div className="detail-card" style={{ top: "5%", left: "30%" ,maxHeight:"500px" }}>
          <span id="entry_2" className="entry-point"></span>
          <span id="exit_2" className="exit-point"></span>
          <div className="drag-handle"></div>
          <h3>Keywords</h3>

          {/* Toggle View/Edit Mode */}
          <ul>
          {editedKeywords.map((keyword, index) => (
            <li key={index} style={{position:"relative"}}>
              {keyword}
              {isEditMode && ( // Show delete button only in edit mode
              <button
                className="cross-button"
                onClick={() =>
                  setEditedKeywords((prev) => prev.filter((_, i) => i !== index))
                }
               
              >
                x
              </button>
              )}
            </li>
          ))}
        </ul>
        {isEditMode && isAddingKeywords && (
          <input
            className="edit-automation-input"
            type="text"
            value={newKeyword}
            onChange={(e) => setNewKeyword(e.target.value)}
            style={{
              padding: "4px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              marginBottom: "10px",
            }}
          />
        )}
        {isEditMode && (
        <button
          onClick={() =>
            isAddingKeywords
              ? addNewItem("keywords", newKeyword)
              : setIsAddingKeywords(true)
          }
          style={{
            background: "#49267e",
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isAddingKeywords ? "Add" : "+ Add Keyword"}
        </button>
        )}
      </div>



        {/* Conditional Boxes */}
        {/* Comment Boxes */}
        {(auto_type === 1 || auto_type === 3) && (
          <div
            className="detail-card"
            style={{
              top: "1%",
              left: "70%",
              maxHeight: "500px",
            }}
          >
            <span id="entry_3" className="entry-point"></span>
            <span id="exit_3" className="exit-point"></span>
            <div className="drag-handle"></div>
            <h3>Comment Replies</h3>
            <ul>
              {editedComments.map((comment, index) => (
                <li
                  key={index}
                  style={{
                    position: "relative", // Ensure button is contained within the li
                    marginBottom: "0.5rem",
                    // padding: "0.5rem",
                    background: "rgba(132, 0, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#333",
                  }}
                >
                  {comment}
                  {isEditMode && (
                    <button
                      className="cross-button"
                      onClick={() =>
                        setEditedComments((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                      
                    >
                      x
                    </button>
                  )}
                </li>
              ))}
            </ul>
            {isAddingComments && isEditMode && (
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                style={{
                  padding: "8px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                  // marginBottom: "10px",
                  width: "100%",
                }}
                placeholder="Enter your comment"
              />
            )}
            {isEditMode && (
              <button
                onClick={() =>
                  isAddingComments
                    ? addNewItem("comments", newComment)
                    : setIsAddingComments(true)
                }
                style={{
                  background: "#49267e",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  // marginTop: "10px",
                }}
              >
                {isAddingComments ? "Add" : "+ Add Comment"}
              </button>
            )}
          </div>
        )}



        {/* DMs Boxes */}
        {(auto_type === 2 || auto_type === 3) && (
          <div className="detail-card" style={{ top: "30%", left: "50%",maxHeight:"600px" }}>
            <span id="entry_4" className="entry-point"></span>
            <span id="exit_4" className="exit-point"></span>
            <div className="drag-handle"></div>
            <h3>DM Replies</h3>
            <ul>
              {editedDMs.map((dms, index) => (
                <li
                  key={index}
                  style={{
                    position: "relative", // Ensure button is scoped to the list item
                    marginBottom: "0.5rem",
                    padding: "0.5rem",
                    background: "rgba(132, 0, 255, 0.1)",
                    borderRadius: "8px",
                    color: "#333",
                  }}
                >
                  {dms}
                  {isEditMode && (
                    <button
                      className="cross-button"
                      onClick={() =>
                        setEditedDMs((prev) =>
                          prev.filter((_, i) => i !== index)
                        )
                      }
                     
                    >
                      x
                    </button>
                  )}
                </li>
              ))}
            </ul>

        {isAddingDMs && isEditMode && (
          <input
            type="text"
            value={newDM}
            onChange={(e) => setNewDM(e.target.value)}
            style={{
              padding: "4px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              marginBottom: "10px",
            }}
          />
        )}  
        {isEditMode && (
        <button
          onClick={() =>
            isAddingDMs
              ? addNewItem("dms", newDM)
              : setIsAddingDMs(true)
          }
          style={{
            background: "#49267e",
            color: "white",
            padding: "5px 10px",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {isAddingDMs ? "Add" : "+ Add DM"}
        </button>
        )}
      </div>
        )}
        
      </div>
    );
  };

  export default AutomationDetails;