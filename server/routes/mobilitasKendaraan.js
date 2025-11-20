const express = require('express');
const router = express.Router();
const mobilitasKendaraanController = require('../controlers/mobilitasKendaraan');

router.get('/', mobilitasKendaraanController.getMobilitasKendaraan);
router.get('/log/:month', mobilitasKendaraanController.LogDataByCar);
router.post('/', mobilitasKendaraanController.addMobilitasKendaraan);

module.exports = router;