// import { pool } from "../../database/db";
// import { NextApiRequest, NextApiResponse } from "next";

// export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
//     if (req.method === "GET") {
//         try {
//             const client = await pool.connect();

//             try {
//                 const query = `
//                     SELECT 
//                         a.auto_id, 
//                         a.post_id, 
//                         a.auto_type, 
//                         a.keywords,
//                         COALESCE(json_agg(DISTINCT rcmnt.answer) FILTER (WHERE rcmnt.answer IS NOT NULL), '[]') AS comment_answers,
//                         COALESCE(json_agg(DISTINCT rdm.answer) FILTER (WHERE rdm.answer IS NOT NULL), '[]') AS dm_answers
//                     FROM automation a
//                     LEFT JOIN rcmnt ON a.auto_id = rcmnt.auto_id
//                     LEFT JOIN rdm ON a.auto_id = rdm.auto_id
//                     GROUP BY a.auto_id
//                 `;

//                 const result = await client.query(query);
//                 res.status(200).json(result.rows); // Return data as JSON
//             } catch (err) {
//                 console.error("Error fetching automations:", err);
//                 res.status(500).json({ error: "Failed to fetch automation data." });
//             } finally {
//                 client.release();
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
import { NextApiRequest, NextApiResponse } from 'next';

const getAutomations = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const sql = `
      SELECT 
        a.auto_id, 
        a.post_id, 
        a.auto_type, 
        a.keywords,
        r.answer AS comment_answer,
        d.answer AS dm_answer
      FROM automation a
      LEFT JOIN rcmnt r ON a.auto_id = r.auto_id
      LEFT JOIN rdm d ON a.auto_id = d.auto_id;
    `;

    pool.query(sql, (err, results: any[]) => {
      if (err) {
        console.error('Error executing query:', err.message);
        res.status(500).json({ error: 'Internal Server Error' });
        return;
      }

      // Cast results to array of rows
      const rows = results as any[];

      // Transform results into the expected structure
      const automations = rows.reduce((acc: any[], row: any) => {
        let automation = acc.find((item) => item.auto_id === row.auto_id);
      
        if (!automation) {
          automation = {
            auto_id: row.auto_id,
            post_id: row.post_id,
            auto_type: row.auto_type,
            keywords: JSON.parse(row.keywords || '[]'), // Parse JSON keywords
            comment_answers: [],
            dm_answers: [],
          };
          acc.push(automation);
        }
      
        // Add unique comment and DM answers
        if (row.comment_answer && !automation.comment_answers.includes(row.comment_answer)) {
          automation.comment_answers.push(row.comment_answer);
        }
        if (row.dm_answer && !automation.dm_answers.includes(row.dm_answer)) {
          automation.dm_answers.push(row.dm_answer);
        }
      
        return acc;
      }, []);

      res.status(200).json(automations);
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export default getAutomations;
