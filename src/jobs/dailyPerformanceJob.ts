import { pool } from "../database/dbc";

export async function dailyPerformanceJob() {
  const currentDate = new Date().toISOString().slice(0, 10); // Get today's date in YYYY-MM-DD format

  try {
    const [completedTasks]: any = await pool.promise().query(`
      SELECT agent_id, TIMESTAMPDIFF(SECOND, assigned_time, reply_time) AS response_time
      FROM assigned_tasks
      WHERE completed = true AND DATE(assigned_time) = ?
    `, [currentDate]);

    if (completedTasks.length === 0) {
      console.log("No completed tasks for today.");
      return;
    }

    const agentPerformance: { [key: number]: { tasks: number, totalResponseTime: number } } = {};

    // Aggregate performance data per agent
    completedTasks.forEach((task: any) => {
      if (!agentPerformance[task.agent_id]) {
        agentPerformance[task.agent_id] = { tasks: 0, totalResponseTime: 0 };
      }
      agentPerformance[task.agent_id].tasks += 1;
      agentPerformance[task.agent_id].totalResponseTime += task.response_time;
    });

    // Insert daily performance data for each agent
    for (const agentId in agentPerformance) {
      const { tasks, totalResponseTime } = agentPerformance[agentId];
      const avgResponseTime = tasks > 0 ? totalResponseTime / tasks : 0;

      await pool.promise().query(`
        INSERT INTO daily_performance (agent_id, date, tasks_completed, avg_response_time, new_conversations)
        VALUES (?, ?, ?, ?, ?)
      `, [agentId, currentDate, tasks, avgResponseTime, 0]); // New conversations set to 0 for now
    }

    // Delete completed tasks for the day
    await pool.promise().query(`
      DELETE FROM assigned_tasks
      WHERE completed = true AND DATE(assigned_time) = ?
    `, [currentDate]);

    console.log("Daily performance data recorded successfully.");
  } catch (error) {
    console.error("Error recording daily performance:", error);
  }
}
