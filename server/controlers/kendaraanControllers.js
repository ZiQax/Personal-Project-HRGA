const { get } = require('mongoose')
const kendaraaanMod = require('../models/dataKendaraan')

const handleRequest = async (res, action, succesStatus = 200) => {
  try {
    const data = await action()

    if (!data || (Array.isArray(data) && data.length === 0)) {
      return res.status(404).json({ message: 'Data Not Found' })
    }

    return res.status(succesStatus).json({
      success: true,
      message: 'Success',
      data
    })
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: 'Database Error',
      error: err
    })
  }
}

const getPagination = async (req, res) => {
  if (res.paginatedResults) return res.status(200).json(res.paginatedResults)
}

const getAllData = async (req, res) => handleRequest(res, kendaraaanMod.getLogData, 200)
const insertData = async (req, res) => {
  const { merk, type, tahun, plat } = req.body

  if (!merk || !type || !tahun || !plat) return res.status(400).json({ success: false, message: 'Bad Request' })

  handleRequest(res, () => kendaraaanMod.insertData(merk, type, tahun, plat), 201)
}

const deleteData = async (req, res) => {
  if (!req.params.id) return res.status(400).json({ success: false, message: 'Bad Request' })

  handleRequest(res, () => kendaraaanMod.deleteData(req.params.id), 201)
}

module.exports = { getAllData, insertData, deleteData, getPagination }
