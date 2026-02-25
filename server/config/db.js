const mysql = require('mysql2')

const db = mysql.createPool({
  connectionLimit: 10,
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'system_kendaraan',
  waitForConnections: true,
  queueLimit: 0
})

if (process.env.NODE_ENV !== 'test') {
  db.getConnection((err, connect) => {
    if (err) {
      throw err
    } else {
      console.log('Database Connected' + connect.threadId)
      connect.release()
    }
  })
}

module.exports = db
