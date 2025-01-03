const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'instaagent',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  // Disable type conversion for BIGINT
  typeCast: function (field, next) {
    if (field.type === 'NEWDECIMAL' || field.type === 'BIGINT') {
      return field.string(); // Return as string to prevent precision loss
    }
    return next();
  },
});

module.exports = pool.promise();
