import { pool } from "../../database/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === "GET") {
        try {
            const client = await pool.connect();

            try {
                const query = `
                    SELECT 
                        a.auto_id, 
                        a.post_id, 
                        a.auto_type, 
                        a.keywords,
                        COALESCE(json_agg(DISTINCT rcmnt.answer) FILTER (WHERE rcmnt.answer IS NOT NULL), '[]') AS comment_answers,
                        COALESCE(json_agg(DISTINCT rdm.answer) FILTER (WHERE rdm.answer IS NOT NULL), '[]') AS dm_answers
                    FROM automation a
                    LEFT JOIN rcmnt ON a.auto_id = rcmnt.auto_id
                    LEFT JOIN rdm ON a.auto_id = rdm.auto_id
                    GROUP BY a.auto_id
                `;

                const result = await client.query(query);
                res.status(200).json(result.rows); // Return data as JSON
            } catch (err) {
                console.error("Error fetching automations:", err);
                res.status(500).json({ error: "Failed to fetch automation data." });
            } finally {
                client.release();
            }
        } catch (err) {
            console.error("Database connection error:", err);
            res.status(500).json({ error: "Database connection failed." });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} not allowed.`);
    }
}

