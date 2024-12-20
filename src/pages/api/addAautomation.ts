import { pool } from "../../database/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { post_id, auto_type, keywords, commentAnswers, dmAnswers } = req.body;

    try {
      const client = await pool.connect();

      try {
        await client.query("BEGIN");

        // Insert into `automation` table
        const automationResult = await client.query(
          `INSERT INTO automation (post_id, auto_type, keywords) VALUES ($1, $2, $3) RETURNING auto_id`,
          [post_id, auto_type, keywords]
        );
        const auto_id = automationResult.rows[0].auto_id;

        // Insert into `RDM` table if `auto_type` includes DM (2 or 3)
        if ((auto_type === 2 || auto_type === 3) && dmAnswers?.length) {
          for (const answer of dmAnswers) {
            await client.query(
              `INSERT INTO rdm (answer, auto_id) VALUES ($1, $2)`,
              [answer, auto_id]
            );
          }
        }

        // Insert into `RCMNT` table if `auto_type` includes Comment (1 or 3)
        if ((auto_type === 1 || auto_type === 3) && commentAnswers?.length) {
          for (const answer of commentAnswers) {
            await client.query(
              `INSERT INTO rcmnt (answer, auto_id) VALUES ($1, $2)`,
              [answer, auto_id]
            );
          }
        }

        await client.query("COMMIT");
        res.status(201).json({ message: "Automation and responses created successfully!" });
      } catch (err) {
        await client.query("ROLLBACK");
        console.error("Transaction error:", err);
        res.status(500).json({ error: "Failed to create automation and responses." });
      } finally {
        client.release();
      }
    } catch (err) {
      console.error("Database connection error:", err);
      res.status(500).json({ error: "Database connection failed." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
