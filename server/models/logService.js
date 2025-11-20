const db = require("../config/db");

const getLogData = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM riwayat_service';
        db.query(sql, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const insertData = (kendaraan_id, tanggal_service, deskripsi, biaya) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO riwayat_service (kendaraan_id, tanggal_service, deskripsi, biaya) VALUES (?, ?, ?, ?)';
        db.query(sql, [kendaraan_id, tanggal_service, deskripsi, biaya], (err, result) => {
            if(err) return reject(err);
            resolve({
               isertId : result.insertId,
               affectedRows : result.affectedRows
            });
        });
    });
};

const deleteData = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM riwayat_service WHERE id = ?';
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = { getLogData, insertData, deleteData };