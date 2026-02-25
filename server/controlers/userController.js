const usermodel = require('../models/userModel')
const { handleRequest } = require('../services/apiUtils')

const getUser = async (req, res) => await handleRequest(res, usermodel.getAllUser)

const getPaginatedUser = async (req, res) => {
  if (res.paginatedResults) {
    return res.status(200).json(res.paginatedResults)
  }
  return res.status(404).json({ success: false, message: 'Pagination failed' })
}

const resetPasswordUsers = async (req, res) => {
  const { id, newPassword } = req.body

  if (!id || !newPassword) {
    return res.status(400).json({ success: false, message: 'ID dan Password baru tidak boleh kosong' })
  }

  await handleRequest(res, () => usermodel.resetPassword(id, newPassword), 200)
}

module.exports = { getUser, getPaginatedUser, resetPasswordUsers }
