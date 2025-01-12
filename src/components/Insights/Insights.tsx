"use client";

import React, { useEffect, useRef, useState } from "react";
import * as echarts from "echarts";
import "./Insights.css";

interface DailyPerformance {
  date: string;
  chatsHandled: number;
  newConversations: number;
  avgResponseTime: number;
}

interface Agent {
  id: number;
  name: string;
  dailyPerformance: DailyPerformance[];
  insights: {
    totalChats: number;
    totalNewConversations: number;
    avgResponseTime: number;
  };
}

const Insights = () => {
  const chartRef = useRef<HTMLDivElement>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const fetchAgentsData = async () => {
    try {
      const response = await fetch("/api/agents-performance");
      if (!response.ok) {
        throw new Error(`Failed to fetch: ${response.statusText}`);
      }
      const data = await response.json();
      setAgents(data.agents);
      setSelectedAgent(data.agents[0] || null); // Set the first agent as default
    } catch (error) {
      console.error("Error fetching agents data:", error);
    }
  };

  useEffect(() => {
    fetchAgentsData();
  }, []);

  useEffect(() => {
    if (!chartRef.current || !selectedAgent) return;

    const chartInstance = echarts.init(chartRef.current);

    // Prepare chart data
    const dates = selectedAgent.dailyPerformance.map((item) => item.date);
    const chatsHandled = selectedAgent.dailyPerformance.map((item) => item.chatsHandled);

    const option: echarts.EChartsOption = {
      xAxis: {
        type: "category",
        data: dates, // Use actual dates
        axisLine: {
          lineStyle: {
            color: "#dfe4ea",
          },
        },
        axisLabel: {
          fontSize: 12,
          formatter: (value: string) => new Date(value).toLocaleDateString(), // Format dates
        },
      },
      yAxis: {
        type: "value",
        name: "Chats Handled",
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
          name: "Chats Handled",
          data: chatsHandled, // Use chats handled data
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

    // Cleanup the chart instance on component unmount
    return () => chartInstance.dispose();
  }, [selectedAgent]);

  const handleAgentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const agent = agents.find((a) => a.id === parseInt(e.target.value));
    setSelectedAgent(agent || null);
  };

  return (
    <div className="insights-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="agent-select-wrapper">
          <select
            id="agent-selector"
            className="agent-selector"
            onChange={handleAgentChange}
          >
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {agent.name}
              </option>
            ))}
          </select>
        </div>
        <input type="text" placeholder="Search" className="search-box" />
      </div>

      {/* Insights Boxes */}
      <div className="insights-boxes">
        <div className="insight-box total-messages">
          <h3>Total Chats</h3>
          <p>{selectedAgent?.insights.totalChats || 0}</p>
        </div>
        <div className="insight-box new-conversations">
          <h3>New Conversations</h3>
          <p>{selectedAgent?.insights.totalNewConversations || 0}</p>
        </div>
        <div className="insight-box avg-response-time">
          <h3>Average Response Time</h3>
          <p>{selectedAgent?.insights.avgResponseTime || 0}s</p>
        </div>
      </div>

      {/* Chart Section */}
      <div className="chart-wrapper">
        <h3>Daily Performance</h3>
        <div ref={chartRef} className="chart"></div>
      </div>
    </div>
  );
};

export default Insights;
