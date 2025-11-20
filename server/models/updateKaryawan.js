const db = require("../config/db");

const updateKaryawan = (NIK, nama, postion, departement, section) => {
    return new Promise((resolve, reject) => {
        const sql = "INSERT INTO employee (NIK, nama, postion, departement, section) VALUES (?, ?, ?, ?, ?)";
        db.query(sql, [NIK, nama, postion, departement, section], (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = {updateKaryawan};