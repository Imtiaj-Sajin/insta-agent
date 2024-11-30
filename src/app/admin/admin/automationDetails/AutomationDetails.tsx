import React, { FC, useEffect } from "react";
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
  useEffect(() => {
    const draggables = document.querySelectorAll(".detail-card");
    const container = document.querySelector(".automation-details-container") as HTMLElement;

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
            e.clientX - containerRect.left - 150
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
      };

      const onMouseUp = () => {
        isDragging = false;
        document.body.style.cursor = "default";
      };

      // Attach event listeners to the drag handle
      handle.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);

      // Cleanup listeners on unmount
      return () => {
        handle.removeEventListener("mousedown", onMouseDown);
        window.removeEventListener("mousemove", onMouseMove);
        window.removeEventListener("mouseup", onMouseUp);
      };
    });
  }, []);

  return (
    <div className="automation-details-container">
      {/* Main Details Card */}
      <div className="detail-card" style={{ top: "20px", left: "20px" }}>
        <div className="drag-handle" />
        <h3>Initial Details</h3>
        <p><strong>Post ID:</strong> {post_id}</p>
        <p>
          <strong>Type:</strong>{" "}
          {auto_type === 1 ? "Reply to Comment" : auto_type === 2 ? "Send DM" : "DM + Comment"}
        </p>
      </div>

      {/* Keywords Box */}
      <div className="detail-card" style={{ top: "200px", left: "40px" }}>
        <div className="drag-handle" />
        <h3>Keywords</h3>
        <ul>
          {keywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
      </div>

      {/* Conditional Boxes */}
      {(auto_type === 1 || auto_type === 3) && (
        <div className="detail-card" style={{ top: "200px", left: "300px" }}>
          <div className="drag-handle" />
          <h3>Comment Replies</h3>
          <ul>
            {comment_answers.map((answer, index) => (
              <li key={index}>{answer}</li>
            ))}
          </ul>
        </div>
      )}

      {(auto_type === 2 || auto_type === 3) && (
        <div className="detail-card" style={{ top: "400px", left: "300px" }}>
          <div className="drag-handle" />
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

export default AutomationDetails;
