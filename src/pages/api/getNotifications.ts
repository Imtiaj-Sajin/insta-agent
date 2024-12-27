// import { pool } from "../../database/db";
// import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
//     if (req.method === "GET") {
//         try {
//             const client = await pool.connect(); // Connect to the database

//             try {
//                 const query = `
//                     SELECT 
//                         noti_id,
//                         notification_type,
//                         sender_id,
//                         sender_username,
//                         media_id,
//                         text,
//                         created_at
//                     FROM notifications
//                     ORDER BY created_at DESC
//                 `;

//                 const result = await client.query(query);
//                 res.status(200).json(result.rows); // Return the results as JSON
//             } catch (err) {
//                 console.error("Error fetching notifications:", err);
//                 res.status(500).json({ error: "Failed to fetch notifications." });
//             } finally {
//                 client.release(); // Release the database client
//             }
//         } catch (err) {
//             console.error("Database connection error:", err);
//             res.status(500).json({ error: "Database connection failed." });
//         }
//     } else {
//         res.setHeader("Allow", ["GET"]);
//         res.status(405).end(`Method ${req.method} not allowed.`);
//     }
// }


import { pool } from "../../database/dbc";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
    if (req.method === "GET") {
        try {
            pool.getConnection((err, connection) => {
                if (err) {
                    console.error("Database connection error:", err);
                    res.status(500).json({ error: "Database connection failed." });
                    return;
                }

                const query = `
                    SELECT 
                        noti_id,
                        notification_type,
                        sender_id,
                        sender_username,
                        media_id,
                        text,
                        created_at
                    FROM notifications
                    ORDER BY created_at DESC
                `;

                connection.query(query, (queryErr, results) => {
                    connection.release(); // Release the connection back to the pool

                    if (queryErr) {
                        console.error("Error fetching notifications:", queryErr);
                        res.status(500).json({ error: "Failed to fetch notifications." });
                        return;
                    }

                    res.status(200).json(results); // Return the results as JSON
                });
            });
        } catch (err) {
            console.error("Unexpected error:", err);
            res.status(500).json({ error: "An unexpected error occurred." });
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} not allowed.`);
    }
}
