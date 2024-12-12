import { pool } from "../../database/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === "POST") {
        const { auto_id, keyword, action, newKeyword } = req.body;

        if (!auto_id || !keyword || !action) {
            return res.status(400).json({ error: "auto_id, keyword, and action are required." });
        }

        try {
            const client = await pool.connect();

            try {
                let updatedKeywords;

                // Fetch the current keywords
                const fetchQuery = "SELECT keywords FROM automation WHERE auto_id = $1";
                const fetchResult = await client.query(fetchQuery, [auto_id]);

                if (fetchResult.rows.length === 0) {
                    return res.status(404).json({ error: "Automation not found." });
                }

                const currentKeywords = fetchResult.rows[0].keywords;

                switch (action) {
                    case "add":
                        if (currentKeywords.includes(keyword)) {
                            return res.status(400).json({ error: "Keyword already exists." });
                        }
                        updatedKeywords = [...currentKeywords, keyword];
                        break;

                    case "modify":
                        if (!newKeyword) {
                            return res.status(400).json({ error: "newKeyword is required for modify action." });
                        }
                        updatedKeywords = currentKeywords.map((k: string) => (k === keyword ? newKeyword : k));
                        break;

                    case "delete":
                        if (!currentKeywords.includes(keyword)) {
                            return res.status(400).json({ error: "Keyword not found." });
                        }
                        updatedKeywords = currentKeywords.filter((k: string) => k !== keyword);
                        break;

                    default:
                        return res.status(400).json({ error: "Invalid action. Use 'add', 'modify', or 'delete'." });
                }

                // Update the keywords in the database
                const updateQuery = "UPDATE automation SET keywords = $1 WHERE auto_id = $2";
                await client.query(updateQuery, [updatedKeywords, auto_id]);

                res.status(200).json({ message: "Operation successful.", keywords: updatedKeywords });
            } catch (error) {
                console.error("Error during CRUD operation:", error);
                res.status(500).json({ error: "Failed to perform the operation." });
            } finally {
                client.release();
            }
        } catch (error) {
            console.error("Database connection error:", error);
            res.status(500).json({ error: "Database connection failed." });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} not allowed.`);
    }
}
