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
      xAxis: {
        type: "category",
        data: dailyMessages.map((item) => item.date),
        axisLine: {
          lineStyle: {
            color: "#dfe4ea",
          },
        },
        axisLabel: {
          fontSize: 12,
        },
      },
      yAxis: {
        type: "value",
        name: "Messages",
        axisLine: {
          show: false,
        },
        splitLine: {
          lineStyle: {
            color: "#dfe4ea",
          },
        },
        axisLabel: {
          fontSize: 12,
        },
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
        backgroundColor: "#fff",
        borderColor: "#ccc",
        textStyle: {
          color: "#333",
        },
      },
      grid: {
        top: "10%",
        bottom: "15%",
        left: "5%",
        right: "5%",
      },
      legend: {
        show: false,
      },
      series: [
        {
          name: "Messages Replied",
          data: dailyMessages.map((item) => item.messagesReplied),
          type: "bar",
          barWidth: "30%",
          itemStyle: {
            borderRadius: [4, 4, 0, 0],
            color: function (params) {
              return params.dataIndex % 2 === 0 ? "#ed4b00" : "#333465";
            },
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
    <div className="insights-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="agent-select-wrapper">
          {/* <label htmlFor="agent-selector" className="agent-label">
            Agent
          </label> */}
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
        <input
          type="text"
          placeholder="Search"
          className="search-box"
        />
      </div>

      {/* Insights Boxes */}
      <div className="insights-boxes">
        <div className="insight-box total-messages">
          <h3>Total Messages Replied</h3>
          <p>{selectedAgent.insights.monthlySummary.totalMessagesReplied}</p>
        </div>
        <div className="insight-box new-conversations">
          <h3>New Conversations</h3>
          <p>{selectedAgent.insights.monthlySummary.totalNewConversations}</p>
        </div>
        <div className="insight-box avg-response-time">
          <h3>Average Response Time</h3>
          <p>{selectedAgent.insights.monthlySummary.totalFollowUps}s</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-wrapper">
        <h3>Daily Messages Replied</h3>
        <div ref={chartRef} className="chart"></div>
      </div>
    </div>
  );
};

export default Insights;
