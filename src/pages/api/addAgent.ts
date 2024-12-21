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
import { pool } from "../../database/dbc"; // Assuming pool is configured for MySQL

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { name, email, phone, password, username, title, sendNotification } = req.body;

    try {
      // Insert data into the agents table using MySQL
      const query = `
        INSERT INTO agents (name, email, phone, password, username, title, send_notification)
        VALUES (?, ?, ?, ?, ?, ?, ?);
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

      // Use MySQL query
      pool.query(query, values, (error, results) => {
        if (error) {
          console.error("Error inserting data:", error);
          return res.status(500).json({ success: false, error: "Failed to add agent" });
        }
        
        // Return the inserted agent data
        res.status(200).json({ success: true, agent: results });
      });
    } catch (error) {
      console.error("Error inserting data:", error);
      res.status(500).json({ success: false, error: "Failed to add agent" });
    }
  } else {
    res.status(405).json({ success: false, error: "Method not allowed" });
  }
}
