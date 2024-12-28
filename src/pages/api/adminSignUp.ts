import { NextApiRequest, NextApiResponse } from "next";
import bcrypt from "bcrypt";
import { pool } from "../../database/dbc"; // Adjusted path to match your setup

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method === "POST") {
    const { username, email, password, full_name, phone_number, role } = req.body;

    // Validate input
    if (!username || !email || !password) {
      res.status(400).json({ message: "Username, email, and password are required." });
      return;
    }

    pool.getConnection(async (err, connection) => {
      if (err) {
        console.error("Database connection error:", err);
        res.status(500).json({ message: "Database connection failed." });
        return;
      }

      try {
        // Check if username or email already exists
        const checkQuery = `
          SELECT COUNT(*) AS count 
          FROM admins 
          WHERE username = ? OR email = ?
        `;
        const [checkResult]:any = await connection.promise().query(checkQuery, [username, email]);
        const count = checkResult[0]?.count || 0;
        console.log("Check result:", checkResult);

        if (count > 0) {
          res.status(409).json({ message: "Username or email already exists." });
        } else {
          // Hash the password
          const hashedPassword = await bcrypt.hash(password, 10);

          // Insert new admin into the database
          const insertQuery = `
            INSERT INTO admins (username, email, password_hash, full_name, phone_number, role) 
            VALUES (?, ?, ?, ?, ?, ?)
          `;
          await connection.promise().query(insertQuery, [
            username,
            email,
            hashedPassword,
            full_name || null,
            phone_number || null,
            role || "admin",
          ]);

          res.status(201).json({ message: "Admin signed up successfully." });
        }
      } catch (err) {
        console.error("Error during admin sign-up:", err);
        res.status(500).json({ message: "Internal server error." });
      } finally {
        connection.release();
      }
    });
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
