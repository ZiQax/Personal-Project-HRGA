const peminjamanModel = require('../models/peminjamanModel')
const { handleRequest } = require('../services/apiUtils')

const getPeminjamanData = async (req, res) => await handleRequest(res, peminjamanModel.getAllPeminjaman)

const getLogByMonth = async (req, res) => {
  const month = req.params.month
  await handleRequest(res, () => peminjamanModel.getLogByMonth(month))
}

module.exports = {
  getPeminjamanData,
  getLogByMonth
}
