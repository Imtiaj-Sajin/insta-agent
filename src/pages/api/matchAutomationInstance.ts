import { pool } from "../../database/dbc";
import { NextApiRequest, NextApiResponse } from "next";

const matchAutomationInstance = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { media_id, comment_text } = req.body;

  if (!media_id || !comment_text) {
    return res.status(400).json({ error: "media_id and comment_text are required." });
  }

  try {
    // Query automations by post_id
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
      LEFT JOIN rdm d ON a.auto_id = d.auto_id
      WHERE a.post_id = ?;
    `;

    pool.query(sql, [media_id], (err, results: any[]) => {
      if (err) {
        console.error("Error executing query:", err.message);
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Parse and filter results
      const automations = results.reduce((acc: any[], row: any) => {
        let automation = acc.find((item) => item.auto_id === row.auto_id);

        if (!automation) {
          automation = {
            auto_id: row.auto_id,
            post_id: row.post_id,
            auto_type: row.auto_type,
            keywords: JSON.parse(row.keywords || "[]"), // Parse JSON keywords
            comment_answers: [],
            dm_answers: [],
          };
          acc.push(automation);
        }

        if (row.comment_answer) {
          automation.comment_answers.push(row.comment_answer);
        }
        if (row.dm_answer) {
          automation.dm_answers.push(row.dm_answer);
        }

        return acc;
      }, []);

      // Match keywords with comment_text
      
        const normalizeText = (text: string): string[] => {
            return text
            .toLowerCase() 
            .replace(/[^\w\s]/g, "") // Remove punctuation
            .split(/\s+/) // Split by spaces
            .filter((word) => word.length > 0); // Remove empty strings
        };
        
        const commentWords = normalizeText(comment_text);
        const matchedAutomations = automations.map((automation) => {
        const matchedKeywords = automation.keywords.filter((keyword: string) =>
          commentWords.includes(keyword.toLowerCase())
        );
        return { ...automation, matched_keywords: matchedKeywords, match_count: matchedKeywords.length };
      });

      // Find the best match
      const bestMatch = matchedAutomations
        .filter((automation) => automation.match_count > 0)
        .sort((a, b) => b.match_count - a.match_count)[0];

      if (!bestMatch) {
        return res.status(200).json({ message: "No matching automation instance found." });
      }

      const response = {
        auto_id: bestMatch.auto_id,
        post_id: bestMatch.post_id,
        auto_type: bestMatch.auto_type,
        matched_keywords: bestMatch.matched_keywords,
        comment_answers: bestMatch.comment_answers,
        dm_answers: bestMatch.dm_answers,
      };

      res.status(200).json(response);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export default matchAutomationInstance;
