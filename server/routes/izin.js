const express = require('express');
const router = express.Router();    
const izinController = require('../controlers/izinKeluar');
const { updateIzinKeluar} = require('../controlers/izinKeluar');
const { paginatted } = require('../middleware/pagination');

router.post('/', izinController.tambahIzinKeluar);
router.get('/log',izinController.getIzinKeluar);
router.get('/log/pagination', paginatted, izinController.getPaginationIzin);
router.get('/log/approved', izinController.getApproveIzin);
router.get('/log/pending', izinController.getPendIzin);
router.get('/log/rejected', izinController.getRejectIzin);
router.get('/log/:month', izinController.getByMonth);
router.delete('/log/:id', izinController.deleteIzinKeluar) ;
router.put('/log/update/:id',updateIzinKeluar);


module.exports = router;