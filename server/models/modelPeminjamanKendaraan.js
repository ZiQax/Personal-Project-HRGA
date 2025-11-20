const { get } = require('mongoose');
const db = require('../config/db');

const getAllPeminjamankendaraan = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT pk.id, pk.user_id, pk.departement, pk.section, dk.plat_no, dk.merk, COALESCE(GROUP_CONCAT(pk.tujuan SEPARATOR ","), "-") AS tujuan, pk.status, pk.created_at FROM peminjaman_kendaraan pk JOIN data_kendaraan dk ON pk.kendaraan_id = dk.id GROUP BY pk.id, pk.user_id, pk.departement, pk.section, dk.plat_no, dk.merk, pk.status, pk.created_at ORDER BY pk.created_at DESC';
    db.query(sql, (err, result) => {
       if(err) return  reject(err);
       resolve(result);
    });
    });
};


const getPaginatedPeminjamanKendaraan = (page, limit) => {
    console.log(page, limit);
    return new Promise((resolve, reject) => {
        const offset = (page - 1) * limit;
        const sql = 'SELECT * FROM peminjaman_kendaraan ORDER BY created_at DESC LIMIT ? OFFSET ?';
        const countSql = 'SELECT COUNT(*) AS total FROM peminjaman_kendaraan';


        db.query(sql, [limit, offset], (err, result) => {
            if (err) return reject(err);

            db.query(countSql, (err2, countResult) => {
                if (err2) return reject(err2);

                const total = countResult[0].total;
                const totalPages = Math.ceil(total / limit);

                resolve({
                    data: result,
                    currentPage : page,
                    totalPages,
                    totalData : total,
                    limit
                });
            });
        });
    });
}

const getLogByMonth = (month) => {
    return new Promise((resolve, reject) => {
        const sql = `
    SELECT * FROM peminjaman_kendaraan 
    WHERE MONTH(created_at)=?`;
    db.query(sql, [month], (err, result) => {
        if(err) return reject(err);
        resolve(result);
    });
    });
};

const getApprovedReq = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM peminjaman_kendaraan WHERE status = "Disetujui"';
        db.query(sql, (err, result) => {
            if (err) return reject("Data Tidak Ditemukan");
            resolve(result);
        });
    });
};

const getPendingReq = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM peminjaman_kendaraan WHERE status = "Menunggu Persetujuan"';
        db.query(sql, (err, result) => {
            if (err) return reject("Data Tidak Ditemukan");
            resolve(result);
        });
    });
};

const getRejectedReq = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM peminjaman_kendaraan WHERE status = "Ditolak"';
        db.query(sql, (err, result) => {
            if (err) return reject("Data Tidak Ditemukan");
            resolve(result);
        });
    });
};

const addPeminjamanKendaraan = (user_id, departement, section, kendaraan_id, tujuanList=[]) => {
    console.log(user_id, departement, section, kendaraan_id, tujuanList);
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO peminjaman_kendaraan (user_id, departement, section, kendaraan_id) VALUES (?, ?, ?, ?)';
        db.query(sql, [user_id, departement, section, kendaraan_id], (err, result) => {
            if(err) return reject(err);

            const peminjaman_id = result.insertId;

            if(tujuanList.length > 0) {
                const values = tujuanList.map(t => [peminjaman_id, t]);
                const sqlTujuan = 'INSERT INTO peminjaman_tujuan (peminjaman_id, tujuan) VALUES ?';
                db.query(sqlTujuan, [values], (err2) => {
                    if(err2) return reject(err2);
                    resolve({peminjaman_id, message: 'Peminjaman Kendaraan & Tujuan Berhasil Disimpan'});
                })
            } else {
                resolve({peminjaman_id, message: 'Peminjaman Kendaraan Berhasil'});
            }
            resolve(result);
        });
    });
};

const updatePeminjam = ( status, id) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE peminjaman_kendaraan SET  status = ? WHERE id = ?';
        db.query(sql, [status, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })
}

const deletePeminjam = (id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM peminjaman_kendaraan WHERE id = ?';
        db.query(sql, [id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
}


module.exports = {
    getAllPeminjamankendaraan,
    getPaginatedPeminjamanKendaraan,
    getLogByMonth,
    getApprovedReq,
    getPendingReq,
    getRejectedReq,
    addPeminjamanKendaraan,
    updatePeminjam,
    deletePeminjam
};