import React, { FC, useEffect, useRef } from "react";
import "./AutomationDetails.css";
interface AutomationDetailsProps {
  post_id: string;
  auto_type: number;
  keywords: string[];
  comment_answers: string[];
  dm_answers: string[];
}

const AutomationDetails: FC<AutomationDetailsProps> = ({
  post_id,
  auto_type,
  keywords,
  comment_answers,
  dm_answers,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const draggables = container?.querySelectorAll(".detail-card");

    if (!draggables || !container) return;

    const listeners: { handle: HTMLElement; cleanUp: () => void }[] = [];

    draggables.forEach((card) => {
      const handle = card.querySelector(".drag-handle") as HTMLElement;
      let isDragging = false;
      let offsetX = 0;
      let offsetY = 0;

      const onMouseDown = (e: MouseEvent) => {
        const cardRect = card.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        isDragging = true;
        offsetX = e.clientX - (cardRect.left - containerRect.left);
        offsetY = e.clientY - (cardRect.top - containerRect.top);

        document.body.style.cursor = "grabbing";
      };

      const onMouseMove = (e: MouseEvent) => {
        if (!isDragging) return;

        const containerRect = container.getBoundingClientRect();

        const newLeft = Math.max(
          0,
          Math.min(
            container.offsetWidth - card.clientWidth,
            e.clientX - containerRect.left - 20
          )
        );
        const newTop = Math.max(
          0,
          Math.min(
            container.offsetHeight - card.clientHeight,
            e.clientY - containerRect.top - 45
          )
        );

        (card as HTMLElement).style.left = `${newLeft}px`;
        (card as HTMLElement).style.top = `${newTop}px`;
      };

      const onMouseUp = () => {
        isDragging = false;
        document.body.style.cursor = "default";
      };

      // Attach event listeners to the drag handle
      handle.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      // Store cleanup functions for later
      listeners.push({
        handle,
        cleanUp: () => {
          handle.removeEventListener("mousedown", onMouseDown);
          window.removeEventListener("mousemove", onMouseMove);
          window.removeEventListener("mouseup", onMouseUp);
        },
      });
    });

    // Cleanup listeners when the component unmounts or updates
    return () => {
      listeners.forEach((listener) => listener.cleanUp());
    };
  }, [post_id, auto_type, keywords, comment_answers, dm_answers]); // Re-run when props change

  return (
    <div ref={containerRef} className="automation-details-container">
  {/* Main Details Card */}
  <div className="detail-card" style={{ top: "40%", left: "20px" }}>

    {/* <div className="entry-point"></div> */}
    <span id="exit_1" className="exit-point"></span>
    <div className="drag-handle">
     
    </div>
    <h3>Automation Details</h3>
    <p><strong>Post ID:</strong> {post_id}</p>
    <p>
      <strong>Type:</strong>{" "}
      {auto_type === 1 ? "Reply to Comment" : auto_type === 2 ? "Send DM" : "DM + Comment"}
    </p>
  </div>

  {/* Keywords Box */}
  <div className="detail-card" style={{ top: "20%", left: "30%" }}>
    <span id="entry_2" className="entry-point"></span>
    <span id="exit_2" className="exit-point"></span>
    <div className="drag-handle">
      
    </div>
    <h3>Keywords</h3>
    <ul>
      {keywords.map((keyword, index) => (
        <li key={index}>{keyword}</li>
      ))}
    </ul>
  </div>

  {/* Conditional Boxes */}
  {(auto_type === 1 || auto_type === 3) && (
    <div className="detail-card" style={{ top: "40%", left: "60%" }}>
      <span id="entry_3" className="entry-point"></span>
      <span id="exit_3" className="exit-point"></span>
      <div className="drag-handle">
      </div>
      <h3>Comment Replies</h3>
      <ul>
        {comment_answers.map((answer, index) => (
          <li key={index}>{answer}</li>
        ))}
      </ul>
    </div>
  )}

  {(auto_type === 2 || auto_type === 3) && (
    <div className="detail-card" style={{ top: "70%", left: "50%" }}>
      <span id="entry_4"  className="entry-point"></span>
      <span id="exit_4" className="exit-point"></span>
      <div className="drag-handle">
        
      </div>
      <h3>DM Replies</h3>
      <ul>
        {dm_answers.map((answer, index) => (
          <li key={index}>{answer}</li>
        ))}
      </ul>
    </div>
  )}
</div>

  );
};
// {let count=0;}

export default AutomationDetails;
