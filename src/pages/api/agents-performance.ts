import { NextApiRequest, NextApiResponse } from 'next';
import { pool } from '../../database/dbc';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('API request received.');

    // Fetch agents from the database
    const agentsQuery = `SELECT agent_id, name FROM agents`;
    const agents: any[] = await new Promise((resolve, reject) => {
      pool.query(agentsQuery, (error, results:any) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    console.log('Fetched agents:', agents);

    // Fetch daily performance data from the database
    const performanceQuery = `
      SELECT agent_id, date, chats_handled, new_conversations, avg_response_time
      FROM daily_performance
      ORDER BY date ASC
    `;
    const performance: any[] = await new Promise((resolve, reject) => {
      pool.query(performanceQuery, (error, results:any) => {
        if (error) reject(error);
        else resolve(results);
      });
    });

    console.log('Fetched performance data:', performance);

    // Ensure agents and performance data are arrays
    const agentsArray = Array.isArray(agents) ? agents : [agents];
    const performanceArray = Array.isArray(performance) ? performance : [performance];

    // Merge agents and performance data
    const mergedResults = agentsArray.map((agent: any) => {
      // Filter performance data for this agent
      const agentPerformance = performanceArray.filter(
        (p: any) => p.agent_id === agent.agent_id
      );

      // Calculate average response time
      const totalAvgResponseTime = agentPerformance.reduce(
        (sum: number, record: any) => sum + parseFloat(record.avg_response_time),
        0
      );
      const avgResponseTime =
        agentPerformance.length > 0
          ? totalAvgResponseTime / agentPerformance.length
          : 0;

      return {
        id: agent.agent_id,
        name: agent.name,
        dailyPerformance: agentPerformance.map((p: any) => ({
          date: p.date,
          chatsHandled: p.chats_handled,
          newConversations: p.new_conversations,
          avgResponseTime: parseFloat(p.avg_response_time),
        })),
        insights: {
          totalChats: agentPerformance.reduce(
            (sum: number, record: any) => sum + record.chats_handled,
            0
          ),
          totalNewConversations: agentPerformance.reduce(
            (sum: number, record: any) => sum + record.new_conversations,
            0
          ),
          avgResponseTime: parseFloat(avgResponseTime.toFixed(2)), // Average across all records
        },
      };
    });

    console.log('Merged result:', mergedResults);

    res.status(200).json({ agents: mergedResults });
  } catch (error: any) {
    console.error('Error fetching agent performance data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default handler;
