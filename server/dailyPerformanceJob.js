const { pool } = require("./dbc.js");

async function dailyPerformanceJob() {
  const currentDate = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

  
  try {
    // Get completed tasks with response times for the current date
    const [completedTasks] = await pool.promise().query(`
      SELECT agent_id, conversation_id, TIMESTAMPDIFF(SECOND, assigned_time, reply_time) AS response_time
      FROM assigned_tasks
      WHERE status = 1 AND DATE(assigned_time) = ?
    `, [currentDate]);

    if (completedTasks.length === 0) {
      console.log("No completed tasks for today.");
      return;
    }

    const agentPerformance = {};

    // Aggregate performance data per agent
    completedTasks.forEach((task) => {
      const { agent_id, conversation_id, response_time } = task;

      if (!agentPerformance[agent_id]) {
        agentPerformance[agent_id] = { tasks: 0, totalResponseTime: 0, newConversations: new Set() };
      }

      agentPerformance[agent_id].tasks += 1;
      agentPerformance[agent_id].totalResponseTime += response_time;
      agentPerformance[agent_id].newConversations.add(conversation_id);
    });

    // Insert daily performance data for each agent
    for (const agentId in agentPerformance) {
      const { tasks, totalResponseTime, newConversations } = agentPerformance[agentId];
      const avgResponseTime = tasks > 0 ? (totalResponseTime / tasks).toFixed(2) : 0;
      const newConversationsCount = newConversations.size;

      await pool.promise().query(`
        INSERT INTO daily_performance (agent_id, date, tasks_completed, chats_handled, avg_response_time, new_conversations)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [agentId, currentDate, tasks, tasks, avgResponseTime, newConversationsCount]);
    }
    // Delete completed tasks for the day
    await pool.promise().query(`
      DELETE FROM assigned_tasks
      WHERE status = 1 AND DATE(assigned_time) = ?
    `, [currentDate]);

    console.log("Daily performance data recorded successfully.");
  } catch (error) {
    console.error("Error recording daily performance:", error);
  }
}

module.exports = dailyPerformanceJob;
