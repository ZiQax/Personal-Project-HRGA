const mysql = require('mysql2');

const db = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: 'qiza',
    database: 'system_kendaraan',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

db.getConnection((err, connect) => {
    if (err){
        throw err;
    }else{
        console.log('Database Connected' + connect.threadId);
        connect.release();
    }
});


module.exports = db;