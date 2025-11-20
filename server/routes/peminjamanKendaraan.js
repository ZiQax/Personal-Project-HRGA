const express = require('express');
const router = express.Router();
const peminjamanKendaraan = require('../controlers/peminjamanKendaraan');
const  {getPeminjamanKendaraan, getLogByMonth, addPeminjamanKendaraan, updatePeminjamanKendaraan, deletePeminjamanKendaraan}= require('../controlers/peminjamanKendaraan')
const { paginatedKendaraan } = require('../middleware/pagination');
const { get } = require('mongoose');
const { route } = require('./authRoutes');


router.get('/', getPeminjamanKendaraan);
router.get('/pagination', paginatedKendaraan, peminjamanKendaraan.getPaginationKendaraan);
router.get('/log/:month', getLogByMonth);
router.get('/approved', peminjamanKendaraan.getApproveReq);
router.get('/pending', peminjamanKendaraan.getPendReq);
router.get('/rejected', peminjamanKendaraan.getRejectReq);
router.post('/regist', addPeminjamanKendaraan);
router.put('/edit/:id', updatePeminjamanKendaraan);
router.delete('/delete/:id', deletePeminjamanKendaraan);

module.exports = router;