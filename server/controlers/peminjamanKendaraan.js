const notificationController = require('./notificationControl')
const peminjamanKendaraanModel = require('../models/modelPeminjamanKendaraan')
const { handleRequest } = require('../services/apiUtils')

const getPeminjamanKendaraan = async (req, res) => {
  await handleRequest(res, () => peminjamanKendaraanModel.getAllPeminjamankendaraan())
}

const getPaginationKendaraan = async (req, res) => {
  if (res.paginatedResults) return res.status(200).json(res.paginatedResults)
}

const getLogByMonth = async (req, res) => {
  const month = req.params.month ? String(req.params.month).replaceAll(/[^a-zA-Z0-9-]/g, '') : ''
  await handleRequest(res, () => peminjamanKendaraanModel.getLogByMonth(month))
}

const getApproveReq = async (req, res) => {
  await handleRequest(res, () => peminjamanKendaraanModel.getApproveReq())
}

const getPendReq = async (req, res) => {
  await handleRequest(res, () => peminjamanKendaraanModel.getPendingReq())
}

const getRejectReq = async (req, res) => {
  await handleRequest(res, () => peminjamanKendaraanModel.getRejectedReq())
}

const addPeminjamanKendaraan = async (req, res) => {
  const { employee_id, kendaraan_id } = req.body
  const tujuan = req.body.tujuan || req.body['tujuan[]']

  let tujuanList = []
  if (Array.isArray(tujuan)) {
    tujuanList = tujuan
  } else if (tujuan) {
    tujuanList = [tujuan]
  }
  if (!employee_id || !kendaraan_id || tujuanList.length === 0) {
    return res.status(400).json({ message: 'Bad Request' })
  };

  await handleRequest(res, () => peminjamanKendaraanModel.addPeminjamanKendaraan(employee_id, kendaraan_id, tujuanList), 201)
}

const updatePeminjamanKendaraan = async (req, res) => {
  const { id } = req.params
  const { status } = req.body

  if (!id || !status) {
    return res.status(400).json({ success: false, message: 'Status dan ID tidak boleh kosong' })
  }

  await handleRequest(res, () => peminjamanKendaraanModel.updatePeminjam(status, id), 201)
}

const deletePeminjamanKendaraan = async (req, res) => {
  if (!req.params.id) return res.status(400).json({ message: 'Bad Request' })

  await handleRequest(res, () => peminjamanKendaraanModel.deletePeminjam(req.params.id), 201)
}

module.exports = {
  getPeminjamanKendaraan,
  getPaginationKendaraan,
  getLogByMonth,
  getApproveReq,
  getPendReq,
  getRejectReq,
  addPeminjamanKendaraan,
  updatePeminjamanKendaraan,
  deletePeminjamanKendaraan
}
