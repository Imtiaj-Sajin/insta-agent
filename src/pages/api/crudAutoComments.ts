import { pool } from "../../database/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === "POST") {
        const { auto_id, answer, action, newAnswer } = req.body;

        if (!auto_id || !answer || !action) {
            return res.status(400).json({ error: "auto_id, answer, and action are required." });
        }

        try {
            const client = await pool.connect();

            try {
                let responseMessage;

                switch (action) {
                    case "add":
                        const addQuery = `
                            INSERT INTO rcmnt (answer, auto_id)
                            VALUES ($1, $2)
                            RETURNING *;
                        `;
                        const addResult = await client.query(addQuery, [answer, auto_id]);

                        responseMessage = {
                            message: "Comment added successfully.",
                            comment: addResult.rows[0],
                        };
                        break;

                    case "modify":
                        if (!newAnswer) {
                            return res.status(400).json({ error: "newAnswer is required to modify a comment." });
                        }

                        const modifyQuery = `
                            UPDATE rcmnt
                            SET answer = $1
                            WHERE auto_id = $2 AND answer = $3
                            RETURNING *;
                        `;
                        const modifyResult = await client.query(modifyQuery, [newAnswer, auto_id, answer]);

                        if (modifyResult.rowCount === 0) {
                            return res.status(404).json({
                                error: "Comment not found for the provided auto_id and answer.",
                            });
                        }

                        responseMessage = {
                            message: "Comment modified successfully.",
                            comment: modifyResult.rows[0],
                        };
                        break;

                    case "delete":
                        const deleteQuery = `
                            DELETE FROM rcmnt
                            WHERE auto_id = $1 AND answer = $2
                            RETURNING *;
                        `;
                        const deleteResult = await client.query(deleteQuery, [auto_id, answer]);

                        if (deleteResult.rowCount === 0) {
                            return res.status(404).json({
                                error: "Comment not found for the provided auto_id and answer.",
                            });
                        }

                        responseMessage = {
                            message: "Comment deleted successfully.",
                            comment: deleteResult.rows[0],
                        };
                        break;

                    default:
                        return res.status(400).json({ error: "Invalid action. Use 'add', 'modify', or 'delete'." });
                }

                res.status(200).json(responseMessage);
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
