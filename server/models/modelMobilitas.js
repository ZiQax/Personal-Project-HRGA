const db = require("../config/db");

const getAllMobilitas = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM peminjaman_kendaraan';
        db.query(sql, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const getLogByMonth = (month) => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM peminjaman_kendaraan WHERE MONTH(tanggal_pinjam) = ?';
        db.query(sql, [month], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const insertMobilitas = (user_id, jenis_kendaraan, tujuan, waktu_berangkat, waktu_pulang, status) => {
    return new Promise((resolve, reject) =>{
        const sql = 'INSERT INTO peminjaman_kendaraan (user_id, jenis_kendaraan, tujuan, waktu_berangkat, waktu_pulang, status) VALUES (?, ?, ?, ?, ?, ?)';
        db.query(sql, [user_id, jenis_kendaraan, tujuan, waktu_berangkat, waktu_pulang, status], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = {
    getAllMobilitas,
    getLogByMonth,
    insertMobilitas
};
