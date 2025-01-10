import mysql from 'mysql2';

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,  
  user: process.env.DATABASE_USER,                    
  password: process.env.DATABASE_PASSWORD,           
  database: process.env.DATABASE_NAME,                
  port: 3306,                            
});

(async () => {
  try {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('Database connection failed:', err.message);
      } else {
        console.log('Connected to MySQL database successfully!');
        connection.release();
      }
    });
  } catch (error: any) {
    console.error('Database connection failed:', error.message);
  }
})();

export { pool };
