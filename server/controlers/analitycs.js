const modelAnalitycs = require('../models/analitycs')
const { handleRequest } = require('../services/apiUtils')

const analitycsKendaraan = async (req, res) => {
  try {
    const rows = await modelAnalitycs.getPeminjamanMonthly()
    const labels = rows.map(r => r.month)
    const data = rows.map(r => r.total)

    res.json({ success: true, labels, data })
  } catch (err) {
    console.error('Analitycs Kendaraan Error:', err)
    return res.status(500).json({ success: false, message: 'Database Error', error: err.message })
  }
}

const anlyticsIzin = async (req, res) => {
  try {
    const rows = await modelAnalitycs.getAllIzin()
    const labels = rows.map(r => r.month)
    const data = rows.map(r => r.total)

    res.json({ success: true, labels, data })
  } catch (err) {
    console.error('Anlytics Izin Error:', err)
    return res.status(500).json({ success: false, message: 'Database Error', error: err.message })
  }
}

const getTopRecentPeminjaman = async (req, res) => await handleRequest(res, modelAnalitycs.getTopPemijaman)

const getTopRecentIzin = async (req, res) => await handleRequest(res, modelAnalitycs.getTopIzin)

const accumStatusIzin = async (req, res) => {
  try {
    const rows = await modelAnalitycs.getStatus()
    const data = rows[0]

    res.json({
      success: true,
      labels: ['Pending', 'Approved', 'Rejected'],
      data: [data.pending, data.approved, data.rejected]
    })
  } catch (err) {
    console.error('Accum Status Izin Error:', err)
    return res.status(500).json({ success: false, message: 'Database Error', error: err.message })
  }
}

module.exports = {
  analitycsKendaraan,
  anlyticsIzin,
  getTopRecentPeminjaman,
  getTopRecentIzin,
  accumStatusIzin
}
