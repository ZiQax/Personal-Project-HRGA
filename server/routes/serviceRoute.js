const express = require('express');
const router = express.Router();
const serviceController = require('../controlers/logService');
console.log(serviceController);

router.get('/', serviceController.getAllData);
router.post("/form", serviceController.insertDataServ);
router.delete("/form/:id", serviceController.deleteDataServ);

module.exports = router;
