const { get } = require('mongoose');
const peminjamanModel  = require('../models/peminjamanModel');

const getPeminjamanData = async(req, res) => {
    try{
        const data = await peminjamanModel.getAllPeminjaman();

        if(!data || data.length === 0){
            return res.status(404).json({message : 'Not Found'});
        }

        res.status(200).json({
            message : 'Success',
            data
        })
    }catch(err){
        return res.status(500).json({message : 'Database Error', error : err});
    }
};

const getLogByMonth = async (req, res) => {
    try{
        const month = req.params.month;
        const data = await peminjamanModel.getLogByMonth(month);

        if(!data || data.length === 0) {
            return res.status(404).json({message : 'Not Found'});
        }

        res.status(200).json({
            message : 'Success',
            data
        });

    }catch(err){
        return res.status(500).json({message : 'Database Error', error : err});
    };
};

module.exports = {
    getPeminjamanData,
    getLogByMonth
};