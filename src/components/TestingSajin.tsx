import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import "./TestingSajin.css";

const TestingSajin = () => {
  const cyContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cyContainer.current) return;

    // Initialize Cytoscape
    const cy = cytoscape({
      container: cyContainer.current,
      elements: [
        { data: { id: "node1", label: "Node 1" }, position: { x: 100, y: 100 } },
        { data: { id: "node2", label: "Node 2" }, position: { x: 300, y: 200 } },
        { data: { id: "node3", label: "Node 3" }, position: { x: 500, y: 100 } },
        { data: { source: "node1", target: "node2" } },
        { data: { source: "node2", target: "node3" } },
        { data: { source: "node3", target: "node1" } },
      ],
      style: [
        {
          selector: "node",
          style: {
            "background-color": "#8058ac",
            label: "data(label)",
            "text-valign": "center",
            "text-halign": "center",
            color: "#fff",
            "font-size": "14px",
            "border-width": 2,
            "border-color": "#49267e",
          },
        },
        {
          selector: "edge",
          style: {
            width: 3,
            "line-color": "#8058ac",
            "target-arrow-color": "#8058ac",
            "target-arrow-shape": "triangle",
            "curve-style": "unbundled-bezier",
            "control-point-distances": [10, -30],
            "control-point-weights": [0.25, 0.75],
          },
        },
      ],
      layout: {
        name: "preset", // Keep node positions as defined
      },
    });

    // Enable interactive dragging for nodes
    cy.nodes().on("drag", (e) => {
      const node = e.target;
      node.scratch("_pos", node.position());
    });

    return () => {
      cy.destroy(); // Clean up Cytoscape instance on unmount
    };
  }, []);

  return <div ref={cyContainer} className="cy-container" />;
};

export default TestingSajin;
