const db = require("../config/db");

const getAllPeminjaman = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM peminjaman_kendaraan';
    db.query(sql, (err, result) => {
       if (err) return  reject(err);
       resolve(result);
    });
    });
};

const getLogByMonth = (month) => {
    return new Promise((resolve, reject) => {
        const sql = `
    SELECT * FROM peminjaman_kendaraan
    WHERE MONTH(tanggal_pinjam)=?`;
    db.query(sql, [month], (err, result) => {
        if (err) return reject(err);
        resolve(result);
    });
    });
};

module.exports = {
    getAllPeminjaman,
    getLogByMonth
};