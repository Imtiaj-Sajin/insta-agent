import { Pool } from "pg";

const pool = new Pool({
  user: "postgres", // Replace with your PostgreSQL username
  host: "192.168.0.173", // Replace with your database host
  database: "instaAgent", // Replace with your database name
  password: "1234", // Replace with your PostgreSQL password
  port: 5432, // Replace with your PostgreSQL port (default is 5432)
});

// Test the database connection
(async () => {
  try {
    const client = await pool.connect();
    console.log("Connected to PostgreSQL database successfully!");
    client.release();
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
})();

export { pool };
