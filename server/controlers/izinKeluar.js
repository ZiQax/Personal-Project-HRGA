const { parse } = require('dotenv')
const modelIzinKeluar = require('../models/modelIzin')

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

const getIzinKeluar = async (req, res) => {
  handleRequest(res, () => modelIzinKeluar.getAllIzin())
}

const getByMonth = async (req, res) => {
  handleRequest(res, () => modelIzinKeluar.getByMonth(req.params.month))
}

const getIzinByStatus = async (req, res) => {
  handleRequest(res, () => modelIzinKeluar.getIzinByStatus(req.params.status))
}

const getPaginationIzin = async (req, res) => {
  if (res.paginatedResults) return res.status(200).json(res.paginatedResults)
}
const getApproveIzin = async (req, res) => {
  handleRequest(res, () => modelIzinKeluar.getApprovedIzin())
}

const getPendIzin = async (req, res) => {
  handleRequest(res, () => modelIzinKeluar.getPendingIzin())
}

const getRejectIzin = async (req, res) => {
  handleRequest(res, () => modelIzinKeluar.getRejectedIzin())
}

const tambahIzinKeluar = async (req, res) => {
  const { employee_id, alasan, estimasi_keluar, tanggal } = req.body

  if (!employee_id || !alasan || !estimasi_keluar || !tanggal) {
    return res.status(400).json({ success: false, message: 'Bad Request' })
  }

  handleRequest(res, () => modelIzinKeluar.insertIzin(employee_id, alasan, estimasi_keluar, tanggal), 201)
}

const deleteIzinKeluar = async (req, res) => {
  if (!req.params.id) return res.status(400).json({ success: false, message: 'Bad Request' })

  handleRequest(res, () => modelIzinKeluar.delIzin(req.params.id), 201)
}

const updateIzinKeluar = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  console.log('Controller Terima -> Status:', status, 'ID:', id) // Cek disini

  if (!status) {
    return res.status(400).json({ success: false, message: 'Bad Request' })
  }

  if (!id, !status) return res.status(400).json({ success: false, message: 'Status dan ID tidak boleh kosong' })

  handleRequest(res, () => modelIzinKeluar.updateIzin(status, id), 201)
}

module.exports = {
  getIzinKeluar,
  getByMonth,
  getPaginationIzin,
  getApproveIzin,
  getPendIzin,
  getRejectIzin,
  tambahIzinKeluar,
  deleteIzinKeluar,
  updateIzinKeluar,
  getIzinByStatus
}
