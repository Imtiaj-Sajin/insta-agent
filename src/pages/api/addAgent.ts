import { NextApiRequest, NextApiResponse } from "next";
import { Pool } from "pg";

// Configure PostgreSQL connection
const pool = new Pool({
  user: "postgres", // Replace with your PostgreSQL username
  host: "localhost", // Replace with your database host
  database: "instaAgent", // Replace with your database name
  password: "1234", // Replace with your PostgreSQL password
  port: 5432, // Default PostgreSQL port
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, phone, password, username, title, sendNotification } =
      req.body;

    try {
      // Insert data into the agents table
      const query = `
        INSERT INTO agents (name, email, phone, password, username, title, send_notification)
        VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
      `;
      const values = [
        name,
        email,
        phone || null,
        password,
        username,
        title || null,
        sendNotification,
      ];

      const result = await pool.query(query, values);
      res.status(200).json({ success: true, agent: result.rows[0] });
    } catch (error) {
      console.error("Error inserting data:", error);
      res.status(500).json({ success: false, error: "Failed to add agent" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
