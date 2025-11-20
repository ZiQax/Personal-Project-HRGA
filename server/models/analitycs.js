const db = require("../config/db");

const getPeminjamanMonthly =  (month) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT MONTH(created_at) AS month_num, MONTHNAME(created_at) AS month, COUNT(*) AS total FROM peminjaman_kendaraan GROUP BY month_num, month ORDER BY month_num ASC`;
        db.query(sql, [month], (err, result) => {
            if(err) return reject(err);
            resolve(result);
        })
    })
}

const getAllIzin = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT MONTH(created_at) AS month_num, MONTHNAME(created_at) AS month, COUNT(*) AS total FROM permohonan_izin GROUP BY month_num, month ORDER BY month_num ASC`;
        db.query(sql, (err, result) => {
            if(err) return reject(err);
            resolve(result);
        });
    });
};

const getTopPemijaman = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT pk.id, pk.user_id, pk.departement, pk.section, dk.plat_no, dk.merk, COALESCE(GROUP_CONCAT(pt.tujuan SEPARATOR ","), "-") AS tujuan, pk.status, pk.created_at FROM peminjaman_kendaraan pk JOIN data_kendaraan dk ON pk.kendaraan_id = dk.id LEFT JOIN peminjaman_tujuan pt ON pk.id = pt.peminjaman_id GROUP BY pk.id, pk.user_id, pk.departement, pk.section, dk.plat_no, dk.merk, pk.status, pk.created_at ORDER BY pk.created_at DESC LIMIT 5';
        db.query(sql, (err, result) => {
            if(err) return reject(err);
            resolve(result);
        });
    });
};

const getTopIzin = () => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT id, user_id, departement, section, position, alasan, status, created_at FROM permohonan_izin ORDER BY created_at DESC LIMIT 5`;
        db.query(sql, (err, result) => {
            if(err) return reject(err);
            resolve(result);
        });
    });
}

const getStatus = () => {
    return new Promise((resolve, reject) => {
        const sql = `
            SELECT 
              COUNT(CASE WHEN status = 'Menunggu Persetujuan' THEN 1 END) AS pending,
              COUNT(CASE WHEN status = 'Disetujui' THEN 1 END) AS approved,
              COUNT(CASE WHEN status = 'Ditolak' THEN 1 END) AS rejected
            FROM permohonan_izin
        `;
        db.query(sql, (err, result) => {
            if(err) return reject(err);
            resolve(result);
        });
    })
}

module.exports = {
    getPeminjamanMonthly,
    getAllIzin,
    getTopPemijaman,
    getTopIzin,
    getStatus
}