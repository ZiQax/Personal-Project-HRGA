const kendaraaanMod = require('../models/dataKendaraan')
const { handleRequest } = require('../services/apiUtils')

const getPagination = async (req, res) => {
  if (res.paginatedResults) return res.status(200).json(res.paginatedResults)
}

const getAllData = async (req, res) => await handleRequest(res, kendaraaanMod.getLogData, 200)
const insertData = async (req, res) => {
  const { merk, type, tahun, plat } = req.body

  if (!merk || !type || !tahun || !plat) return res.status(400).json({ success: false, message: 'Bad Request' })

  await handleRequest(res, () => kendaraaanMod.insertData(merk, type, tahun, plat), 201)
}

const deleteData = async (req, res) => {
  if (!req.params.id) return res.status(400).json({ success: false, message: 'Bad Request' })

  await handleRequest(res, () => kendaraaanMod.deleteData(req.params.id), 201)
}

module.exports = { getAllData, insertData, deleteData, getPagination }
