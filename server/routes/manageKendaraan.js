const express = require('express')
const router = express.Router()
const kendaraanController = require('../controlers/kendaraanControllers')

router.get('/data-kendaraan', kendaraanController.getAllData)
router.post('/form-kendaraan', kendaraanController.insertData)
router.delete('/form-kendaraan/:id', kendaraanController.deleteData)

module.exports = router
