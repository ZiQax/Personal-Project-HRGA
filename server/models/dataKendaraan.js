const db = require('../config/db')

const getLogData = () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM data_kendaraan'
    db.query(sql, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

const getPaginatedPeminjamanKendaraan = (page, limit) => {
  console.log(page, limit)
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit
    const sql = 'SELECT *FROM data_kendaraan ORDER BY created_at DESC LIMIT ? OFFSET ?'
    const countSql = 'SELECT COUNT(*) AS total FROM data_kendaraan'

    db.query(sql, [limit, offset], (err, result) => {
      if (err) return reject(err)

      db.query(countSql, (err2, countResult) => {
        if (err2) return reject(err2)

        const total = countResult[0].total
        const totalPages = Math.ceil(total / limit)

        resolve({
          data: result,
          currentPage: page,
          totalPages,
          totalData: total,
          limit
        })
      })
    })
  })
}

const insertData = (plat_no, merk, jenis) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO data_kendaraan (plat_no, merk, jenis) VALUES (?, ?, ?)'
    db.query(sql, [plat_no, merk, jenis], (err, result) => {
      if (err) return reject(err)
      resolve({
        isertId: result.insertId,
        affectedRows: result.affectedRows
      })
    })
  })
}

const deleteData = (id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM data_kendaraan WHERE id = ?'
    db.query(sql, [id], (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

module.exports = { getLogData, insertData, deleteData }
