const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,  
  user: process.env.DATABASE_USER,                    
  password: process.env.DATABASE_PASSWORD,           
  database: process.env.DATABASE_NAME,  
  port: 3306,
  waitForConnections: true,
  // connectionLimit: 10,
  // queueLimit: 0,
  // typeCast: function (field, next) {
  //   if (field.type === 'NEWDECIMAL' || field.type === 'BIGINT') {
  //     return field.string(); // Return as string to prevent precision loss
  //   }
  //   return next();
  // },
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
  } catch (error) {
    console.error('Database connection failed:', error.message);
  }
})();
module.exports = pool.promise();
