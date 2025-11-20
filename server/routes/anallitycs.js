const express = require('express');
const router = express.Router();
const analitycsController = require('../controlers/analitycs');
const { anlyticsIzin , getTopRecentPeminjaman, getTopRecentIzin, accumStatusIzin} = require('../controlers/analitycs');

router.get('/', analitycsController.analitycsKendaraan);
router.get('/izin', anlyticsIzin);
router.get('/top-recent', getTopRecentPeminjaman);
router.get('/top-izin', getTopRecentIzin);
router.get('/accum-status', accumStatusIzin);

module.exports = router;