import { NextApiRequest, NextApiResponse } from "next";
// import { pool } from "../../database/db";

  

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "GET") {
//     try {
//       const query = "SELECT agent_id, username, name, email, phone, title FROM agents;";
//       const result = await pool.query(query);
//       res.status(200).json({ success: true, agents: result.rows });
//     } catch (error) {
//       console.error("Error fetching agents:", error);
//       res.status(500).json({ success: false, error: "Failed to fetch agents" });
//     }
//   } else {
//     res.status(405).json({ success: false, error: "Method not allowed" });
//   }
// }

import { pool } from "../../database/dbc"; // Assuming pool is configured for MySQL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const query = "SELECT agent_id, username, name, email, phone, title FROM agents;";
      
      // Execute query using MySQL pool
      pool.query(query, (error, results) => {
        if (error) {
          console.error("Error fetching agents:", error);
          return res.status(500).json({ success: false, error: "Failed to fetch agents" });
        }
        
        // Send response with the agents data
        res.status(200).json({ success: true, agents: results });
      });
      
    } catch (error) {
      console.error("Error in query execution:", error);
      res.status(500).json({ success: false, error: "Failed to fetch agents" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
