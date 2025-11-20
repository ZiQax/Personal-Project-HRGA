const { get } = require("mongoose");
const db = require("../config/db");
const bcrypt = require("bcrypt");



const getAllUser = async () => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT nik, username, role, created_at FROM users";
    db.query(sql, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    })
  })
}


const getPaginationUser = async (page, limit) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit;
    const sql = "SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?";
    const countSql = "SELECT COUNT(*) AS total FROM users";

    db.query(sql, [limit, offset], (err, result) => {
      if (err) return reject(err);

      db.query(countSql, (err2, countSql) => {
        if (err2) return reject(err2);

        const total = countSql[0].total;
        const totalPages = Math.ceil(total / limit);

        resolve({
          data: result,
          currentPage : page,
          totalPages,
          totalData : total,
          limit
        });
      })
    })
  })
}

const getByUsername = (username) => {
    return new Promise((resolve, reject) => {
         const sql = "SELECT * FROM users WHERE username = ?";
         db.query(sql, [username], (err, result) => {
             if (err) return reject(err);
             resolve(result);
         });
    });
};

const createUser = async ({nik, username, password, role}) => {
   return new Promise((resolve, reject) => {
     const sql = "INSERT INTO users (nik, username, password, role) VALUES (?, ?, ?, ?)";
     db.query(sql, [nik, username, password, role], (err, result) => {
       if (err) return reject(err);
       resolve(result.insertId);
     });
   });
};

const findByusernameOrNik = async (identifier) => {
  return new Promise((resolve, reject) => {
    const sql = "SELECT * FROM users WHERE username = ? OR nik = ?";
    db.query(sql, [identifier, identifier], (err, result) => {
      if (err) return reject(err);
      resolve(result[0]);
    })
  })
}

const resetPassword = async (id, newPassword) => {
  return new Promise((resolve, reject) => {

    bcrypt.hash(newPassword, 10, (err, hash) => {
      if (err) return reject(err);
    });
    const sql = "UPDATE users SET password = ? WHERE id = ?";
    db.query(sql, [newPassword, id], (err, result) => {
      if (err) return reject(err);
      resolve(result);
    })
  })
}


module.exports = { getByUsername, getPaginationUser,  createUser, findByusernameOrNik, getAllUser, resetPassword };