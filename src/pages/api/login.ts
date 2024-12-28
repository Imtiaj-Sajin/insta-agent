import { pool } from "../../database/dbc"; // Database connection
import bcrypt from "bcrypt"; // To compare hashed passwords
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse): Promise<void> {
  if (req.method === "POST") {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: "Email and password are required." });
      return;
    }

    try {
      const connection = await pool.promise().getConnection();

      try {
        // Query to find the user in the credentials table
        const [rows]: any[] = await connection.query(
          "SELECT * FROM credentials WHERE email = ?",
          [email]
        );

        if (rows.length === 0) {
          res.status(404).json({ message: "User not found." });
          return;
        }

        const user = rows[0];

        // Compare the hashed password with the input password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
          res.status(401).json({ message: "Invalid credentials." });
          return;
        }

        // If the user is found and password matches, return user info
        res.status(200).json({
          message: "Login successful.",
          user: {
            type: user.type,
            user_id: user.user_id,
          },
        });
      } catch (err) {
        console.error("Error querying the database:", err);
        res.status(500).json({ message: "Internal server error." });
      } finally {
        connection.release();
      }
    } catch (err) {
      console.error("Database connection error:", err);
      res.status(500).json({ message: "Failed to connect to the database." });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} not allowed.`);
  }
}
