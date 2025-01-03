import { NextApiRequest, NextApiResponse } from "next";
import { pool } from "../../database/dbc";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { comment_id, page_id, media_id, media_type, user_id, username, parent_comment_id, comment_text, event_time } = req.body;

    try {
      const query = `
        INSERT INTO webhook_comments (
          comment_id, 
          page_id, 
          media_id, 
          media_type, 
          user_id, 
          username, 
          parent_comment_id, 
          comment_text, 
          event_time
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, FROM_UNIXTIME(?));
      `;

      const values = [
        comment_id,
        page_id,
        media_id,
        media_type,
        user_id,
        username,
        parent_comment_id,
        comment_text,
        event_time,
      ];

      await pool.promise().query(query, values);
      res.status(201).json({ message: "Webhook comment stored successfully" });
    } catch (error) {
      console.error("Error storing webhook comment:", error);
      res.status(500).json({ error: "Failed to store webhook comment" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
