const express = require('express');
const router = express.Router();
const contUpdateKarywan = require('../controlers/updateKaryawan');

router.post('/', contUpdateKarywan.updateKaryawan);

module.exports = router;