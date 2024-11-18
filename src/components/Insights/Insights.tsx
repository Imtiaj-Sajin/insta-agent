"use client";

import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import insightsData from "./insightsData.json";
import "./Insights.css";

const Insights = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [selectedAgent, setSelectedAgent] = useState(insightsData.agents[0]);

  useEffect(() => {
    if (!chartRef.current || !selectedAgent) return;

    const chartInstance = echarts.init(chartRef.current);

    const dailyMessages = selectedAgent.insights.dailyMessages;

    const option: echarts.EChartsOption = {
      title: {
        text: `Daily Messages Replied:`,
        left: "center",
        textStyle: {
          fontSize: 18,
        },
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: dailyMessages.map((item) => item.date),
        axisLabel: {
          rotate: 45,
        },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: dailyMessages.map((item) => item.messagesReplied),
          type: "bar",
          barWidth: "60%",
          itemStyle: {
            color: "#4A90E2",
            // borderRadius: "1rem",
          },
        },
      ],
    };

    chartInstance.setOption(option);

    return () => chartInstance.dispose();
  }, [selectedAgent]);

  const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const agent = insightsData.agents.find((a) => a.id === e.target.value);
    setSelectedAgent(agent || insightsData.agents[0]);
  };

  return (
    <div className="insights-container">
      <h1 className="insights-title">Agent Insights</h1>

      {/* Agent Selector */}
      <div className="selector-wrapper">
        <label htmlFor="agent-selector">Select Agent: </label>
        <select
          id="agent-selector"
          className="agent-selector"
          onChange={handleAgentChange}
        >
          {insightsData.agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>

      {/* Graph Section */}
      {/* <div className="chart-wrapper"> */}
        <div ref={chartRef} className="chart"></div>
      {/* </div> */}

      {/* Insights Boxes */}
      <div className="insights-boxes">
        <div className="insight-box total">
          <h2>Total Messages Replied</h2>
          <p>{selectedAgent.insights.monthlySummary.totalMessagesReplied}</p>
        </div>
        <div className="insight-box new-conversations">
          <h2>New Conversations</h2>
          <p>{selectedAgent.insights.monthlySummary.totalNewConversations}</p>
        </div>
        <div className="insight-box follow-ups">
          <h2>Average Response Time</h2>
          <p>{selectedAgent.insights.monthlySummary.totalFollowUps}s</p>
        </div>
      </div>
    </div>
  );
};

export default Insights;
