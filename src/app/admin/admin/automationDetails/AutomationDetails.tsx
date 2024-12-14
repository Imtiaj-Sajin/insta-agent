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

    const [newKeywords, setNewKeywords] = useState<string[]>([]);
    const [newComments, setNewComments] = useState<string[]>([]);
    const [newDms, setNewDms] = useState<string[]>([]);

    const containerRef = useRef<HTMLDivElement | null>(null);
    const svgRef = useRef<SVGSVGElement | null>(null);


    const [delArray, setDelArray] = useState<string[]>([]); // State to store deleted keywords
    const [delComments, setDelComments] = useState<string[]>([]); // State to store deleted keywords
    const [delDms, setDelDms] = useState<string[]>([]); // State to store deleted keywords

 
    

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
    // setDelArray([])
    // setNewKeywords([])
  };

const dbKeywords = async (action: string) => {
  const apiUrl = "/api/crudKeywords"; 



  const keywordsToProcess = action === "add" ? newKeywords : delArray;

  const promises = keywordsToProcess.map(async (keyword) => {
      try {
          const body = {
              auto_id: auto_id, 
              keyword: keyword,
              action: action,
              
          };

          // Log action and keyword for debugging
          console.log(`Processing action '${action}' for keyword '${keyword}'`);

          const response = await fetch(apiUrl, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
          });

          const result = await response.json();
          console.log(`Response for keyword '${keyword}' with action '${action}':`, result);
      } catch (error) {
          console.error(`Error processing keyword '${keyword}' with action '${action}':`, error);
      }
  });

  // Wait for all API calls to complete
  await Promise.all(promises);
    alert(`All ${action} actions completed.`);
};

//comments for database with bug
const dbComments = async (action: string) => {
  const apiUrl = "/api/crudAutoComments"; 



  const CommentsToProcess = action === "add" ? newComments : delComments;

  const promises = CommentsToProcess.map(async (comment) => {
      try {
          const body = {
              auto_id: auto_id, 
              answer: comment,
              action: action,
              
          };

          // Log action and keyword for debugging
          console.log(`Processing action '${action}' for Comments '${comment}'`);

          const response = await fetch(apiUrl, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
          });

          const result = await response.json();
          console.log(`Response for comment '${comment}' with action '${action}':`, result);
      } catch (error) {
          console.error(`Error processing comment '${comment}' with action '${action}':`, error);
      }
  });

  // Wait for all API calls to complete
  await Promise.all(promises);
    alert(`All ${action} actions completed.`);
};



//database calling for editing dms with some lil bug
const dbDMs = async (action: string) => {
  const apiUrl = "/api/crudAutoDMs"; 



  const DMsToProcess = action === "add" ? newDms : delDms;

  const promises = DMsToProcess.map(async (dm) => {
      try {
          const body = {
              auto_id: auto_id, 
              answer: dm,
              action: action,
              
          };

          // Log action and keyword for debugging
          console.log(`Processing action '${action}' for Comments '${dm}'`);

          const response = await fetch(apiUrl, {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(body),
          });

          const result = await response.json();
          console.log(`Response for DM '${dm}' with action '${action}':`, result);
      } catch (error) {
          console.error(`Error processing dm '${dm}' with action '${action}':`, error);
      }
  });

  // Wait for all API calls to complete
  await Promise.all(promises);
    alert(`All ${action} actions completed.`);
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
      let offsetX = 60;
      let offsetY = 20;
  
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
    if (type === "keywords"){ setEditedKeywords([...editedKeywords, value]); setNewKeywords([...newKeywords, value])}
    if (type === "comments") {setEditedComments([...editedComments, value]); setNewComments([...newComments, value])}
    if (type === "dms") {setEditedDMs([...editedDMs, value]); setNewDms([...newDms, value])}

    if (type === "keywords") setNewKeyword("");
    if (type === "comments") setNewComment("");
    if (type === "dms") setNewDM("");
  };
  const removeKeyword = (index: number) => {
    setEditedKeywords((prev) => {
      const keywordToDelete = prev[index];
  
      setDelArray((delPrev) => {
        if (!delPrev.includes(keywordToDelete)) {
          return [...delPrev, keywordToDelete];
        }
        return delPrev; // Return unchanged array if already included
      });
  
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeDms = (index: number) => {
    setEditedDMs((prev) => {
      const dmToDelete = prev[index];
  
      setDelDms((delPrev) => {
        if (!delPrev.includes(dmToDelete)) {
          return [...delPrev, dmToDelete];
        }
        return delPrev; 
      });
  
      return prev.filter((_, i) => i !== index);
    });
  };
  
  const removeComments = (index: number) => {
    setEditedComments((prev) => {
      const commentToDelete = prev[index];
  
      setDelComments((delPrev) => {
        if (!delPrev.includes(commentToDelete)) {
          return [...delPrev, commentToDelete];
        }
        return delPrev; 
      });
  
      return prev.filter((_, i) => i !== index);
    });
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
          background: 'var(--navbar-active-bg)',
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

{/* save button */}
      <button
        onClick={()=>{

          if (delArray.length > 0 && newKeywords.length > 0) {
            (async () => {
              await dbKeywords("add");
              await dbKeywords("delete");
            })();
          } else if (delArray.length > 0) {
              console.log(delArray);
               dbKeywords("delete");
          } else if (newKeywords.length > 0) {
              dbKeywords("add");
          } else {
            alert("Nothing to change in keywords.");
          }
          
          //comments calling db
          if (delComments.length > 0 && newComments.length > 0) {
            (async () => {
              await dbComments("add");
              await dbComments("delete");
            })();
          } else if (delComments.length > 0) {
              console.log(delComments);
               dbComments("delete");
          } else if (newComments.length > 0) {
              dbComments("add");
          } else {
            alert("Nothing to change in Comments.");
          }

          //callindg db for dms
          if (delDms.length > 0 && newDms.length > 0) {
            (async () => {
              await dbDMs("add");
              await dbDMs("delete");
            })();
          } else if (delDms.length > 0) {
              console.log(delDms);
               dbDMs("delete");
          } else if (newDms.length > 0) {
              dbDMs("add");
          } else {
            alert("Nothing to change in DMs.");
          }

            
          setDelArray([]); 
          setNewKeywords([]); 
          setNewComments([]);
          setDelComments([]);
          setNewDms([]);
          setDelComments([]);
          
                

          // console.log('newKeyword:',newKeyword)
          console.log('editedKeywords:',editedKeywords)
          console.log('delArray:',delArray)
          console.log('newKeywords:',newKeywords)
          console.log('deldms:',delDms)
          console.log('newdms:',newDms)
          console.log('delComments:',delComments)
          console.log('newComments:',newComments)


          // console.log('newDms:',setNewKeyword)
        }}  
        style={{
          top: 160,  
                    right: 30,
          background: 'var(--secondary-color)',
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
          <div className="drag-handle">
            {/* <svg width="100%" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" ><path d="M194.4 211.7a53.3 53.3 0 1 0 59.3 88.7 53.3 53.3 0 1 0 -59.3-88.7zm142.3-68.4c-5.2-5.2-11.5-9.3-18.4-12c-18.1-7.1-57.6-6.8-83.1-6.5c-4.1 0-7.9 .1-11.2 .1c-3.3 0-7.2 0-11.4-.1c-25.5-.3-64.8-.7-82.9 6.5c-6.9 2.7-13.1 6.8-18.4 12s-9.3 11.5-12 18.4c-7.1 18.1-6.7 57.7-6.5 83.2c0 4.1 .1 7.9 .1 11.1s0 7-.1 11.1c-.2 25.5-.6 65.1 6.5 83.2c2.7 6.9 6.8 13.1 12 18.4s11.5 9.3 18.4 12c18.1 7.1 57.6 6.8 83.1 6.5c4.1 0 7.9-.1 11.2-.1c3.3 0 7.2 0 11.4 .1c25.5 .3 64.8 .7 82.9-6.5c6.9-2.7 13.1-6.8 18.4-12s9.3-11.5 12-18.4c7.2-18 6.8-57.4 6.5-83c0-4.2-.1-8.1-.1-11.4s0-7.1 .1-11.4c.3-25.5 .7-64.9-6.5-83l0 0c-2.7-6.9-6.8-13.1-12-18.4zm-67.1 44.5A82 82 0 1 1 178.4 324.2a82 82 0 1 1 91.1-136.4zm29.2-1.3c-3.1-2.1-5.6-5.1-7.1-8.6s-1.8-7.3-1.1-11.1s2.6-7.1 5.2-9.8s6.1-4.5 9.8-5.2s7.6-.4 11.1 1.1s6.5 3.9 8.6 7s3.2 6.8 3.2 10.6c0 2.5-.5 5-1.4 7.3s-2.4 4.4-4.1 6.2s-3.9 3.2-6.2 4.2s-4.8 1.5-7.3 1.5l0 0c-3.8 0-7.5-1.1-10.6-3.2zM448 96c0-35.3-28.7-64-64-64H64C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96zM357 389c-18.7 18.7-41.4 24.6-67 25.9c-26.4 1.5-105.6 1.5-132 0c-25.6-1.3-48.3-7.2-67-25.9s-24.6-41.4-25.8-67c-1.5-26.4-1.5-105.6 0-132c1.3-25.6 7.1-48.3 25.8-67s41.5-24.6 67-25.8c26.4-1.5 105.6-1.5 132 0c25.6 1.3 48.3 7.1 67 25.8s24.6 41.4 25.8 67c1.5 26.3 1.5 105.4 0 131.9c-1.3 25.6-7.1 48.3-25.8 67z"/>
            </svg> */}
              <h3>Automation Details</h3>
          </div>
          <div style={{background:"#fff",padding:"8px",color:"var(--navbar-text-color)",borderRadius:"8px"}}>
                <p style={{borderBottom: ".5px solid #ddd"}}><strong>Post ID:</strong> {post_id}  ({auto_id})</p>
                <p>
                  <strong>Type:</strong>{" "}
                  {auto_type === 1 ? "Reply to Comment" : auto_type === 2 ? "Send DM" : "DM + Comment"}
                </p>
          </div>
         
        </div>

        {/* Keywords Box */}
        
        <div className="detail-card" style={{ top: "5%", left: "30%" ,maxHeight:"500px"}}>
          <span id="entry_2" className="entry-point"></span>
          <span id="exit_2" className="exit-point"></span>
          <div className="drag-handle" style={{}}><h3>Keywords</h3></div>
            

          {/* Toggle View/Edit Mode */}
          <ul>
          {editedKeywords.map((keyword, index) => (
            <li key={index} style={{position:"relative"}}>
              {keyword}
              {isEditMode && ( // Show delete button only in edit mode
              <button
                className="cross-button"
                onClick={() =>
                  // setEditedKeywords((prev) => prev.filter((_, i) => i !== index))
                  removeKeyword(index)}
                
               
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
            
            placeholder="Enter your Keyword"
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
            background: 'var(--light-secondary-color)',
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
            <div className="drag-handle">
                  <h3>Comment Replies</h3> 
            </div>
            <ul>
              {editedComments.map((comment, index) => (
                <li
                  key={index}
                  style={{
                    position: "relative", // Ensure button is contained within the li
                    // marginBottom: "0.5rem",
                    // padding: "0.5rem",
                    // background: "rgba(132, 0, 255, 0.1)",
                    // borderRadius: "8px",
                    // color: "#333",
                  }}
                >
                  {comment}
                  {isEditMode && (
                    <button
                      className="cross-button"
                      onClick={() =>removeComments(index)
                        // setEditedComments((prev) =>
                        //   prev.filter((_, i) => i !== index)
                        // )
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
                className="edit-automation-input"
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
               
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
                  background: 'var(--light-secondary-color)',
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
            
            <div className="drag-handle"><h3>DM Replies</h3> </div>
            <ul>
              {editedDMs.map((dms, index) => (
                <li
                  key={index}
                  style={{
                    position: "relative", // Ensure button is scoped to the list item
                    // marginBottom: "0.5rem",
                    // padding: "0.5rem",
                    // background: "rgba(132, 0, 255, 0.1)",
                    // borderRadius: "8px",
                    // color: "#333",
                  }}
                >
                  {dms}
                  {isEditMode && (
                    <button
                      className="cross-button"
                      onClick={() =>removeDms(index)
                        // setEditedDMs((prev) =>
                        //   prev.filter((_, i) => i !== index)
                        // )
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
            className="edit-automation-input"
            value={newDM}
            onChange={(e) => setNewDM(e.target.value)}
            placeholder="Enter your DM"
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
            background: 'var(--light-secondary-color)',
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
