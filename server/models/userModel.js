const { get } = require('mongoose')
const db = require('../config/db')
const bcrypt = require('bcrypt')

const getAllUser = async () => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT nik, username, role, created_at FROM users'
    db.query(sql, (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

const getPaginationUser = async (page, limit) => {
  return new Promise((resolve, reject) => {
    const offset = (page - 1) * limit
    const sql = 'SELECT * FROM users ORDER BY created_at DESC LIMIT ? OFFSET ?'
    const countSql = 'SELECT COUNT(*) AS total FROM users'

    db.query(sql, [limit, offset], (err, result) => {
      if (err) return reject(err)

      db.query(countSql, (err2, countSql) => {
        if (err2) return reject(err2)

        const total = countSql[0].total
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

const getByUsername = async (identifier) => {
  return new Promise((resolve, reject) => {
    const sql = `SELECT u.id, u.nik, u.username, u.password,
                      r.role_name AS role, 
                      r.permissions,
                      d.name AS departement_name,
                      s.name AS section_name,
                      from users u 
                      LEFT JOIN roles r ON u.role_id = r.id
                      LEFT JOIN departements d ON u.departement_id = d.id
                      LEFT JOIN sections s ON u.section_id = s.id
                      WHERE u.username = ? OR u.nik = ?
                      `

    db.query(sql, [identifier, identifier], (err, result) => {
      if (err) return reject(err)
      if (result.length === 0) return reject(new Error('User Not Found'))

      const user = result[0]

      let permissionsArray = []
      try {
        if (typeof user.permissions === 'string') {
          permissionsArray = JSON.parse(user.permissions)
        } else if (Array.isArray(user.permissions)) {
          permissionsArray = user.permissions
        }
      } catch (error) {
        console.log('Error parsing permissions: ', error)
        permissionsArray = []
      }
      const userData = {
        id: user.id,
        nik: user.nik,
        role: user.role,
        username: user.username,
        password: user.password,

        detailts: {
          departement: user.departement_name || '-',
          section: user.section_name || '-'
        },

        access_right: { permissionsArray }
      }

      resolve(userData)
    })
  })
}

const createUser = async ({ nik, username, password, role }) => {
  return new Promise((resolve, reject) => {
    const sql = 'INSERT INTO users (nik, username, password, role) VALUES (?, ?, ?, ?)'
    db.query(sql, [nik, username, password, role], (err, result) => {
      if (err) return reject(err)
      resolve(result.insertId)
    })
  })
}

const findByusernameOrNik = async (identifier) => {
  return new Promise((resolve, reject) => {
    const sql = 'SELECT * FROM users WHERE username = ? OR nik = ?'
    db.query(sql, [identifier, identifier], (err, result) => {
      if (err) return reject(err)
      resolve(result[0])
    })
  })
}

const resetPassword = async (id, newPassword) => {
  return new Promise((resolve, reject) => {
    bcrypt.hash(newPassword, 10, (err, hash) => {
      if (err) return reject(err)
    })
    const sql = 'UPDATE users SET password = ? WHERE id = ?'
    db.query(sql, [newPassword, id], (err, result) => {
      if (err) return reject(err)
      resolve(result)
    })
  })
}

module.exports = { getByUsername, getPaginationUser, createUser, findByusernameOrNik, getAllUser, resetPassword }
