import mysql from 'mysql2';

// const pool = mysql.createPool({
//   host: 'commentzap.com',  // Replace with the host you found
//   user: 'ubfmchaagz',                     // Replace with your MySQL username
//   password: 'HNKUtvaY9D',             // Replace with your MySQL password
//   database: 'ubfmchaagz',                      // Replace with your database name
//   port: 3306,                                  // Default MySQL port
// });

const pool = mysql.createPool({
  host: 'localhost', // Default hostname for local connections
  user: 'root',      // Default MySQL username (replace if you've changed it)
  password: '',      // Default MySQL password (replace with your actual password if set)
  database: 'instaNew', // Replace with your database name
  port: 3306         // Default MySQL port
});


// Test the database connection
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
