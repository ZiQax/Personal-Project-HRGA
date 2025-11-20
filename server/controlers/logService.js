const riwayatService = require("../models/logService");


const getAllData = async (req, res) => {
    try {
        const data = await riwayatService.getLogData();

        if(!data || data.length === 0) {
            return res.status(404).json({message : 'Not Found'});
        }

        res.status(200).json({
            message : 'Success',
            data
        });

    } catch (err) {
        return res.status(500).json({
            message : 'Database Error',
            error : err
        });
    }
}

const insertDataServ = async (req, res) => {
    try{
        const {kendaraan_id, tanggal_service, deskripsi, biaya} = req.body;
         console.log("📥 Data diterima:", { kendaraan_id, tanggal_service, deskripsi, biaya })

        if(!kendaraan_id || !tanggal_service || !deskripsi || !biaya) {
            return res.status(400).json({message : 'Bad Request'});
        }

        const result = await riwayatService.insertData(kendaraan_id, tanggal_service, deskripsi, parseFloat(biaya));

        res.status(201).json({
            message : 'Success',
            data : result
        });

    }catch(err){
        return res.status(500).json({
            message : 'Database Error',
            error : err
        });
    }
}

const deleteDataServ = async (req, res) => {
    try{
        const {id} = req.params;

        if(!id) {
            return res.status(400).json({message : 'Bad Request'});
        }

        const result = await riwayatService.deleteData(id);

        res.status(201).json({
            message : 'Success',
            data : result
        });

    }catch(err){
        return res.status(500).json({
            message : 'Database Error',
            error : err
        });
    }
}

module.exports = {getAllData, insertDataServ, deleteDataServ};