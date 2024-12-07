import React, { FC, useEffect, useRef } from "react";
import * as d3 from "d3";
import cytoscape from "cytoscape";

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
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const svg = d3.select(svgRef.current);
    const draggables = container?.querySelectorAll(".detail-card");

    if (!draggables || !container) return;

    // Define the connections
    const connections = [
      { source: "exit_1", target: "entry_2" },
      { source: "exit_2", target: "entry_3" },
      { source: "exit_2", target: "entry_4" },
    ];

    const updateConnections = () => {
      const paths = svg.selectAll("path").data(connections);
      

      paths
        .enter()
        .append("path")
        .merge(paths as any)
        .attr("d", (d) => {
          const sourceEl = document.getElementById(d.source);
          const targetEl = document.getElementById(d.target);

          if (!sourceEl || !targetEl) return "";

          const sourceRect = sourceEl.getBoundingClientRect();
          const targetRect = targetEl.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();

          // Calculate the positions relative to the container
          const sourceX =
            sourceRect.left + sourceRect.width / 2 - containerRect.left;
          const sourceY =
            sourceRect.top + sourceRect.height / 2 - containerRect.top;
          const targetX =
            targetRect.left + targetRect.width / 2 - containerRect.left;
          const targetY =
            targetRect.top + targetRect.height / 2 - containerRect.top;

          // Return a curved path (bezier)
          return `M ${sourceX},${sourceY} 
                  C ${sourceX + 50},${sourceY} ${targetX - 50},${targetY} ${targetX},${targetY}`;
        })
        .attr("stroke", "#8058ac")
        .attr("stroke-width", 2)
        .attr("fill", "none");
      
      paths.exit().remove();
    };

    // Initial rendering of connections
    updateConnections();

    // Attach drag behavior
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

        updateConnections(); // Update connections on drag
      };

      const onMouseUp = () => {
        isDragging = false;
        document.body.style.cursor = "default";
      };

      // Attach event listeners to the drag handle
      handle.addEventListener("mousedown", onMouseDown);
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
    });

    // Cleanup listeners and destroy connections
    return () => {
      svg.selectAll("*").remove();
    };
  }, [post_id, auto_type, keywords, comment_answers, dm_answers]); // Re-run when props change

  return (
    <div ref={containerRef} className="automation-details-container">
      {/* SVG for connections */}
      <svg
        ref={svgRef}
        className="connection-layer"
        style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none" }}
      />

      {/* Main Details Card */}
      <div className="detail-card" style={{ top: "40%", left: "20px" }}>
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
      <div className="detail-card" style={{ top: "20%", left: "30%" }}>
        <span id="entry_2" className="entry-point"></span>
        <span id="exit_2" className="exit-point"></span>
        <div className="drag-handle"></div>
        <h3>Keywords</h3>
        <ul>
          {keywords.map((keyword, index) => (
            <li key={index}>{keyword}</li>
          ))}
        </ul>
      </div>

      {/* Conditional Boxes */}
      {(auto_type === 1 || auto_type === 3) && (
        <div className="detail-card" style={{ top: "20%", left: "70%" }}>
          <span id="entry_3" className="entry-point"></span>
          <span id="exit_3" className="exit-point"></span>
          <div className="drag-handle"></div>
          <h3>Comment Replies</h3>
          <ul>
            {comment_answers.map((answer, index) => (
              <li key={index}>{answer}</li>
            ))}
          </ul>
        </div>
      )}

      {(auto_type === 2 || auto_type === 3) && (
        <div className="detail-card" style={{ top: "50%", left: "50%" }}>
          <span id="entry_4" className="entry-point"></span>
          <span id="exit_4" className="exit-point"></span>
          <div className="drag-handle"></div>
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
