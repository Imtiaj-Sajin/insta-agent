import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

// Configure PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "instaAgent",
  password: "1234", // Replace with your PostgreSQL password
  port: 5432,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const query = "SELECT agent_id, username, name, email, phone, title FROM agents;";
      const result = await pool.query(query);
      res.status(200).json({ success: true, agents: result.rows });
    } catch (error) {
      console.error("Error fetching agents:", error);
      res.status(500).json({ success: false, error: "Failed to fetch agents" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
