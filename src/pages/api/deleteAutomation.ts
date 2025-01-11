import { NextApiRequest, NextApiResponse } from "next";
import { pool } from "../../database/dbc"; 


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "DELETE") {
    const { auto_id } = req.body;

    if (!auto_id) {
      return res.status(400).json({ success: false, error: "Missing auto_id" });
    }

    try {
      const query = `DELETE FROM automation WHERE auto_id = ?`;
      const [result] = await pool.promise().query(query, [auto_id]);

      if ((result as any).affectedRows > 0) {
        res.status(200).json({ success: true, message: "Automation deleted successfully" });
      } else {
        res.status(404).json({ success: false, error: "Automation not found" });
      }
    } catch (error) {
      console.error("Error deleting automation:", error);
      res.status(500).json({ success: false, error: "Failed to delete automation" });
    }
  } else {
    res.setHeader("Allow", ["DELETE"]);
    res.status(405).json({ success: false, error: `Method ${req.method} not allowed` });
  }
}
