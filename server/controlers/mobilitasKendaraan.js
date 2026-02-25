const modelMobilitas = require('../models/modelMobilitas')
const { handleRequest } = require('../services/apiUtils')

const getMobilitasKendaraan = async (req, res) => await handleRequest(res, modelMobilitas.getAllMobilitas)

const LogDataByCar = async (req, res) => {
  const { month } = req.params
  await handleRequest(res, () => modelMobilitas.getLogByMonth(month))
}

const addMobilitasKendaraan = async (req, res) => {
  const { user_id, jenis_kendaraan, tujuan, waktu_berangkat, waktu_pulang, status: statusData } = req.body

  if (!user_id || !jenis_kendaraan || !tujuan || !waktu_berangkat || !waktu_pulang || !statusData) {
    return res.status(400).json({ success: false, message: 'Semua field harus diisi' })
  }

  await handleRequest(res, () => modelMobilitas.insertMobilitas(user_id, jenis_kendaraan, tujuan, waktu_berangkat, waktu_pulang, statusData), 201)
}

module.exports = { getMobilitasKendaraan, LogDataByCar, addMobilitasKendaraan }
