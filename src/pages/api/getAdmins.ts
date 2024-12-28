import { pool } from "../../database/dbc";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === "GET") {
        try {
            pool.getConnection(async (err, connection) => {
                if (err) {
                    console.error("Error getting database connection:", err);
                    res.status(500).json({ error: "Database connection failed." });
                    return;
                }

                try {
                    const query = "SELECT admin_id, username, email, full_name, phone_number, role, updated_at, created_at FROM admins";
                    const [rows] = await connection.promise().query(query);

                    res.status(200).json({ admins: rows });
                } catch (queryErr) {
                    console.error("Error fetching admins:", queryErr);
                    res.status(500).json({ error: "Failed to fetch admins." });
                } finally {
                    connection.release();
                }
            });
        } catch (error) {
            console.error("Unexpected server error:", error);
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} not allowed.`);
    }
}
