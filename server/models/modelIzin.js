const db = require('../config/db')

const getAllIzin = () => {
  return new Promise((resolve, reject) => {
    const sql = `
            SELECT
               p.id, 
               e.nama AS nama_karyawan,
               e.postion AS jabatan,
               d.name AS departement,
               s.name AS section,
               p.alasan,
               p.tanggal,
               p.estimasi_keluar,
               p.status,
               p.created_at
            FROM permohonan_izin p
            JOIN employee e ON p.employee_id = e.id
            JOIN sections s ON e.section = s.id
            JOIN departments d ON s.departments_id = d.id
            ORDER BY p.created_at DESC
        `
    db.query(sql, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

const getIzinByStatus = (status) => {
  return new Promise((resolve, reject) => {
    const sql = `
            SELECT
              p.id,
              e.nama AS nama_karyawan,
              d.name AS departement,
              p.alasan,
              p.tanggal,
              p.status
            FROM permohonan_izin p
            JOIN employee e ON p.employee_id = e.id
            JOIN sections s ON e.section = s.id
            JOIN departments d ON s.departments_id = d.id
            WHERE p.status = ?
         `

    db.query(sql, [status], (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

const getApprovedIzin = () => getIzinByStatus('Disetujui')
const getPendingIzin = () => getIzinByStatus('Menunggu Persetujuan')
const getRejectedIzin = () => getIzinByStatus('Ditolak')

const getLogByMonth = (month) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM permohonan_izin WHERE MONTH(created_at)=?'
    db.query(sql, [month], (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

const getPaginatedIzin = (page, limit) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit
    const sql = `
                  SELECT
                     p.id, 
                     e.nama AS nama_karyawan,
                     e.postion AS jabatan,
                     d.name AS department,
                     s.name AS section,
                     p.alasan,
                     p.tanggal,
                     p.estimasi_keluar,
                     p.status,
                     p.created_at
                  FROM permohonan_izin p
                  JOIN employee e ON p.employee_id = e.id
                  JOIN sections s ON e.section = s.id
                  JOIN departments d ON s.departments_id = d.id
                  ORDER BY p.created_at DESC LIMIT ? OFFSET ?
        `
    const countSql = 'SELECT COUNT(*) AS total FROM permohonan_izin'

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

const insertIzin = (employee_id, alasan, estimasi_keluar, tanggal) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO permohonan_izin (employee_id, alasan, estimasi_keluar, tanggal) VALUES (?, ?, ?, ?)'
    db.query(sql, [employee_id, alasan, estimasi_keluar, tanggal], (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

const delIzin = (Id) => {
  return new Promise((resolve, reject) => {
    const sql = 'DELETE FROM permohonan_izin WHERE id = ?'
    db.query(sql, [Id], (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

const updateIzin = (status, id) => {
  return new Promise((resolve, reject) => {
    const sql = 'UPDATE permohonan_izin SET status = ? WHERE id = ?'
    db.query(sql, [status, id], (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

module.exports = {
  getAllIzin,
  getLogByMonth,
  getPaginatedIzin,
  getIzinByStatus,
  getApprovedIzin,
  getPendingIzin,
  getRejectedIzin,
  insertIzin,
  delIzin,
  updateIzin
}
