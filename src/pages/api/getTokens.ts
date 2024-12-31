import { NextApiRequest, NextApiResponse } from "next";
import { pool } from "../../database/dbc";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    try {
      const query = `
        SELECT 
          t.token_id, 
          t.page_id, 
          t.auth_token, 
          t.admin_id, 
          a.username AS admin_username,
          t.created_at,
          t.updated_at
        FROM tokens t
        LEFT JOIN admins a ON t.admin_id = a.admin_id
        ORDER BY t.created_at DESC;
      `;

      pool.query(query, (error, results) => {
        if (error) {
          console.error("Error fetching tokens:", error);
          return res.status(500).json({ success: false, error: "Failed to fetch tokens." });
        }

        res.status(200).json({ success: true, tokens: results });
      });
    } catch (error) {
      console.error("Unexpected error fetching tokens:", error);
      res.status(500).json({ success: false, error: "Unexpected error occurred." });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
