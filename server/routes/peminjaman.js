const express = require('express');
const router = express.Router();
const peminjamanController = require('../controlers/peminjamanData');
const { route } = require('./authRoutes');

router.get('/', peminjamanController.getPeminjamanData);
router.get('/log/:month', peminjamanController.getLogByMonth);

module.exports = router;