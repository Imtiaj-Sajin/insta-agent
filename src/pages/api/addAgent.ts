// import { NextApiRequest, NextApiResponse } from "next";
// import { pool } from "../../database/db";

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "POST") {
//     const { name, email, phone, password, username, title, sendNotification } =
//       req.body;

//     try {
//       // Insert data into the agents table
//       const query = `
//         INSERT INTO agents (name, email, phone, password, username, title, send_notification)
//         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *;
//       `;
//       const values = [
//         name,
//         email,
//         phone || null,
//         password,
//         username,
//         title || null,
//         sendNotification,
//       ];

//       const result = await pool.query(query, values);
//       res.status(200).json({ success: true, agent: result.rows[0] });
//     } catch (error) {
//       console.error("Error inserting data:", error);
//       res.status(500).json({ success: false, error: "Failed to add agent" });
//     }
//   } else {
//     res.status(405).json({ success: false, error: "Method not allowed" });
//   }
// }

import { NextApiRequest, NextApiResponse } from "next";
import { pool } from "../../database/dbc"; // MySQL pool connection
import bcrypt from "bcrypt";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, phone, password, username, title, sendNotification } = req.body;

    if (!name || !email || !password || !username) {
      return res.status(400).json({ success: false, error: "Missing required fields." });
    }

    try {
      const connection = await pool.promise().getConnection();

      try {
        // Check if username or email already exists
        const [existingAgents]: any[] = await connection.query(
          "SELECT * FROM credentials WHERE email = ? OR username = ?",
          [email, username]
        );

        if (existingAgents.length > 0) {
          return res.status(409).json({
            success: false,
            error: "Username or email already exists.",
          });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new agent
        const query = `
          INSERT INTO agents (name, email, phone, password, username, title, send_notification)
          VALUES (?, ?, ?, ?, ?, ?, ?);
        `;
        const values = [
          name,
          email,
          phone || null,
          hashedPassword,
          username,
          title || null,
          sendNotification !== undefined ? sendNotification : 1, // Default to 1
        ];

        const [results]:any= await connection.query(query, values);

        // Return the inserted agent data
        res.status(201).json({
          success: true,
          message: "Agent added successfully.",
          agentId: results.insertId,
        });
      } catch (error) {
        console.error("Error inserting data:", error);
        res.status(500).json({ success: false, error: "Failed to add agent." });
      } finally {
        connection.release();
      }
    } catch (error) {
      console.error("Database connection error:", error);
      res.status(500).json({ success: false, error: "Database connection failed." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).json({ success: false, error: "Method not allowed." });
  }
}

