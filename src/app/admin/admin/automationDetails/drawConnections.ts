import * as d3 from "d3";

interface Connection {
  source: string;
  target: string;
}

interface DrawConnectionsParams {
  container: HTMLDivElement | null;
  svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>;
  connections: Connection[];
}

/**
 * Draws connections between elements in the container based on their IDs.
 * @param {HTMLDivElement | null} container - The container element.
 * @param {d3.Selection<SVGSVGElement | null, unknown, null, undefined>} svg - The SVG layer for drawing connections.
 * @param {Connection[]} connections - Array of connections with source and target IDs.
 */
export const drawConnections = ({ container, svg, connections }: DrawConnectionsParams) => {
  if (!container) return;

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
        const sourceX = sourceRect.left + sourceRect.width / 2 - containerRect.left;
        const sourceY = sourceRect.top + sourceRect.height / 2 - containerRect.top;
        const targetX = targetRect.left + targetRect.width / 2 - containerRect.left;
        const targetY = targetRect.top + targetRect.height / 2 - containerRect.top;

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

  return updateConnections;
};
