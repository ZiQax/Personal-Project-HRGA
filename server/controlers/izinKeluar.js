
const { parse } = require('dotenv');
const modelIzinKeluar = require('../models/modelIzin');

const getIzinKeluar = async (req, res) => {
    try {
        const data = await modelIzinKeluar.getAllIzin();

        if(!data || data.length === 0) {
            return res.status(404).json({success: false, message : 'Not Data request'});
        }

        res.status(200).json({
            success: true,
            message : 'Success',
            data,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message : 'Database Error',
            error : err
        });
    };
};


const getByMonth = async (req, res) => {
    try{
        const month = req.params.month;
        const data = await modelIzinKeluar.getLogByMonth(month);

        if(!data || data.length === 0) {
            return res.status(404).json({message : 'Not Found'});
        }

        res.status(200).json({
            message : 'Success',
            data
        });

    }catch(err){
        return res.status(500).json({
            message : 'Database Error',
            error : err
        });
    };
};

const getPaginationIzin = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page < 1 || limit < 1) {
            return res.status(400).json({ success: false, message: 'Invalid page or limit parameter' });
        }

        const data = await modelIzinKeluar.getPaginatedIzin(page, limit);
       
        res.status(200).json(
            res.paginatedResults
        );

    } catch(err) {
        return res.status(500).json({
            message : 'Database Error',
            error : err
        })
    }
};

const getApproveIzin = async (req, res) => {
    try{
        const data = await modelIzinKeluar.getApprovedIzin();

        if(!data || data.length === 0 ) {
            return res.status(404).json({success: false, message : 'Data Tidak Ditemukan'});
        }

        res.status(200).json({
            success: true,
            message : 'Data Berhasil Ditemukan',
            data
        });

    }catch (err) {
        console.error('error in getApproveIzin', err);
        return res.status(500).json({
            success: false,
            message : 'Database tidak tersambung.. silahkan coba lagi',
            error : err
        });
    };
};

const getPendIzin = async (req, res) => {
    try{
        const data = await modelIzinKeluar.getPendingIzin();

        if(!data || data.length === 0 ) {
            return res.status(404).json({message : 'Data Tidak Ditemukan'});
        }

        res.status(200).json({
            message : 'Data Berhasil Ditemukan',
            data
        });

    }catch (err) {
        return res.status(500).json({
            success: false,
            message : 'Database tidak tersambung.. silah coba lagi',
            error : err
        });
    };
};

const getRejectIzin = async (req, res) => {
    try{
        const data = await modelIzinKeluar.getRejectedIzin();

        if(!data || data.length === 0 ) {
            return res.status(404).json({message : 'Data Tidak Ditemukan'});
        }
         
        res.status(200).json({
            message : 'Data Berhasil Ditemukan',
            data
        });

    }catch (err) {
        return res.status(500).json({
            message : 'Database tidak tersambung.. silah coba lagi',
            error : err
        });
    };
};



const tambahIzinKeluar = async (req, res) => {
   try {
    const {user_id, departement, section, position, alasan, estimasi_keluar, tanggal} = req.body;

    if(!user_id || !departement || !section || !position || !alasan || !estimasi_keluar || ! tanggal) {
        return res.status(400).json({success: false, message : 'Bad Request'});
    }

    const result = await modelIzinKeluar.insertIzin(user_id, departement, section, position, alasan, estimasi_keluar, tanggal);

    console.log(result);

    res.status(201).json({
        success: true,
        message : 'Success',
        data : result
    });

   } catch (err) {
    console.log(err)
    return res.status(500).json({
        message : 'Database Error',
        error : err
    });
   };
};

const deleteIzinKeluar = async (req, res) => {
    try{
        const {id} = req.params;

        if(!id) {
            return res.status(400).json({success: false, message : 'Bad Request'});
        }

        const result = await modelIzinKeluar.delIzin(id);

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
};

const updateIzinKeluar = async (req, res) => {
    try{
        const {id} = req.params;
        const {status} = req.body;

        if(!status) {
            return res.status(400).json({success: false, message : 'Bad Request'});
        }


        const result = await modelIzinKeluar.updateIzin(status, id);      

        res.status(201).json({
            message : 'Success',
            data : result
        });

    }catch(err) {
        console.error("Update Error",err)
        return res.status(500).json({
            success: false,
            message : 'Database Error',
            error : err
        })
    }
}

module.exports = {
     getIzinKeluar,
     getByMonth,
     getPaginationIzin,
     getApproveIzin,
     getPendIzin,
     getRejectIzin, 
     tambahIzinKeluar, 
     deleteIzinKeluar, 
     updateIzinKeluar
    };