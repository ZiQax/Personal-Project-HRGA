
const db = require("../config/db");

const getAllIzin = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM permohonan_izin ORDER BY created_at DESC';
        db.query(sql, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const getLogByMonth = (month) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM permohonan_izin WHERE MONTH(created_at)=?`;
        db.query (sql, [month], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const getPaginatedIzin = (page, limit) => {
    console.log(page, limit);
    return new Promise((resolve, reject) => {
        const offset = (page - 1) * limit;
        const sql = 'SELECT * FROM permohonan_izin ORDER BY created_at DESC LIMIT ? OFFSET ?';
        const countSql = 'SELECT COUNT(*) AS total FROM permohonan_izin';


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

const insertIzin = (user_id, departement, section, position, alasan, estimasi_keluar, tanggal) => {
    return new Promise((resolve, reject) => {
        const sql = 'INSERT INTO permohonan_izin (user_id, departement, section, position, alasan, estimasi_keluar, tanggal) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(sql, [user_id, departement, section, position, alasan, estimasi_keluar, tanggal], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

const getApprovedIzin = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM permohonan_izin WHERE status = "Disetujui"';
        db.query(sql, (err, result) => {
            if (err) return reject("Data Tidak Ditemukan");
            resolve(result);
        });
    });
};

const getPendingIzin = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM permohonan_izin WHERE status = "Menunggu Persetujuan"';
        db.query(sql, (err, result) => {
            if (err) return reject("Data Tidak Ditemukan");
            resolve(result);
        });
    });
};

const getRejectedIzin = () => {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT * FROM permohonan_izin WHERE status = "Ditolak"';
        db.query(sql, (err, result) => {
            if (err) return reject("Data Tidak Ditemukan");
            resolve(result);
        });
    });
};

const delIzin = (Id) => {
    return new Promise((resolve, reject) => {
        const sql = 'DELETE FROM permohonan_izin WHERE id = ?';
        db.query(sql, [Id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};


const updateIzin = (status, id) => {
    return new Promise((resolve, reject) => {
        const sql = 'UPDATE permohonan_izin SET status = ? WHERE id = ?';
        db.query(sql, [ status, id], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        })
    })
}




module.exports = {
    getAllIzin, 
    getLogByMonth, 
    getPaginatedIzin,
    getApprovedIzin,
    getPendingIzin,
    getRejectedIzin,
    insertIzin, 
    delIzin,
    updateIzin
};