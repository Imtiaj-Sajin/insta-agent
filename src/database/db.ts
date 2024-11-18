import { Pool } from "pg";

const pool = new Pool({
  user: "your_db_user",
  host: "localhost",
  database: "instaAgent",
  password: "1234",
  port: 5432, // Default PostgreSQL port
});

export const query = (text: string, params?: any[]) => pool.query(text, params);

export default pool;
