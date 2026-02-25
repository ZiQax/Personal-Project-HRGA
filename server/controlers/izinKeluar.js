const modelIzinKeluar = require('../models/modelIzin')
const { handleRequest } = require('../services/apiUtils')

const getIzinKeluar = async (req, res) => {
  await handleRequest(res, () => modelIzinKeluar.getAllIzin())
}

const getByMonth = async (req, res) => {
  await handleRequest(res, () => modelIzinKeluar.getByMonth(req.params.month))
}

const getIzinByStatus = async (req, res) => {
  await handleRequest(res, () => modelIzinKeluar.getIzinByStatus(req.params.status))
}

const getPaginationIzin = async (req, res) => {
  if (res.paginatedResults) return res.status(200).json(res.paginatedResults)
}
const getApproveIzin = async (req, res) => {
  await handleRequest(res, () => modelIzinKeluar.getApprovedIzin())
}

const getPendIzin = async (req, res) => {
  await handleRequest(res, () => modelIzinKeluar.getPendingIzin())
}

const getRejectIzin = async (req, res) => {
  await handleRequest(res, () => modelIzinKeluar.getRejectedIzin())
}

const tambahIzinKeluar = async (req, res) => {
  const { employee_id, alasan, estimasi_keluar, tanggal } = req.body

  if (!employee_id || !alasan || !estimasi_keluar || !tanggal) {
    return res.status(400).json({ success: false, message: 'Bad Request' })
  }

  await handleRequest(res, () => modelIzinKeluar.insertIzin(employee_id, alasan, estimasi_keluar, tanggal), 201)
}

const deleteIzinKeluar = async (req, res) => {
  if (!req.params.id) return res.status(400).json({ success: false, message: 'Bad Request' })

  await handleRequest(res, () => modelIzinKeluar.delIzin(req.params.id), 201)
}

const updateIzinKeluar = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!id || !status) {
    return res.status(400).json({ success: false, message: 'Status dan ID tidak boleh kosong' })
  }

  await handleRequest(res, () => modelIzinKeluar.updateIzin(status, id), 201)
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
