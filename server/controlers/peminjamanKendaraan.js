
const notificationController = require('./notificationControl'); 
const peminjamanKendaraanModel = require('../models/modelPeminjamanKendaraan');


const getPeminjamanKendaraan = async (req, res) => {
    try {
        const data = await peminjamanKendaraanModel.getAllPeminjamankendaraan();

        if(!data || data.length === 0){
            return res.status(404).json({message: 'Not Found'});
        }

        res.status(200).json({message: 'Success', data: data});
    }catch (err) {
        res.status(500).json({message: 'Database Error', error: err});
    }
};


const getPaginationKendaraan = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page < 1 || limit < 1) {
            return res.status(400).json({ success: false, message: 'Invalid page or limit parameter' });
        }

        const data = await peminjamanKendaraanModel.getPaginatedPeminjamanKendaraan(page, limit);
       
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


const getLogByMonth = async (req, res) => {
    try {
        const { month } = req.params;
        console.log("month", month);
        const data = await peminjamanKendaraanModel.getLogByMonth(month);

        if(!data || data.length === 0){
            return res.status(404).json({message: 'Not Found'});
        }

        res.status(200).json({message: 'Success', data: data});
    }catch (err) {
        res.status(500).json({message: 'Database Error', error: err});
    };
};

const getApproveReq = async (req, res) => {
    try{
        const data = await peminjamanKendaraanModel.getApprovedReq();

        if(!data || data.length === 0 ) {
            return res.status(404).json({message : 'Data Tidak Ditemukan'});
        }

        res.status(200).json({
            message : 'Data Berhasil Ditemukan',
            data
        });

    }catch (err) {
        console.error('error in getApproveIzin', err);
        return res.status(500).json({
            message : 'Database tidak tersambung.. silahkan coba lagi',
            error : err
        });
    };
};

const getPendReq = async (req, res) => {
    try{
        const data = await peminjamanKendaraanModel.getPendingReq();

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

const getRejectReq = async (req, res) => {
    try{
        const data = await peminjamanKendaraanModel.getRejectedReq
        ();

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

const addPeminjamanKendaraan = async (req, res) => {
    try{
        const {user_id, departement, section, kendaraan_id} = req.body;
        const tujuan = req.body.tujuan || req.body['tujuan[]'];

       const tujuanList =  Array.isArray(tujuan) ? tujuan : (tujuan ? [tujuan]: []);
           if(!user_id || !departement || !section || !kendaraan_id || tujuanList.length === 0) {
            return res.status(400).json({message : 'Bad Request'});
        };

       const result = await peminjamanKendaraanModel.addPeminjamanKendaraan(user_id, departement, section, kendaraan_id, tujuanList);
       console.log(result);

        const message = `Peminjaman kendaraan ${kendaraan_id} oleh ${user_id} berhasil dilakukan untuk tujuan ${tujuanList.join(', ')}`;
        
        const io = notificationController.getIo();
        io.emit('notification', { message }); // Mengirimkan notifikasi

       res.status(201).json({message : 'Success', data: result});

    }catch (err) {
        console.log(err);
        res.status(500).json({
            message : 'Database Error',
            error : err
        });
    };
};

const updatePeminjamanKendaraan = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        console.log(req.body);

        if (!id || !status) {
            return res.status(400).json({ message: 'Data tidak bisa diupdate, silahkan coba lagi dengan menginputkan data yang valid' });
        }

        // Make sure the model method name matches your model (updatePeminjamanKendaraan)
        const result = await peminjamanKendaraanModel.updatePeminjam(status, id);

        res.status(200).json({
            message: `Data peminjaman kendaraan  dengan tujuan ${id} berhasil diupdate`,
            data: result
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Database tidak tersambung.. silahkan coba lagi',
            error: err
        });
    }
};

const deletePeminjamanKendaraan = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({message: 'ID tidak dapat ditemukan'});
        }

        const result = await peminjamanKendaraanModel.deletePeminjam(id);

        res.status(200).json({
            message: `Peminjaman kendaraan dengan ID ${id} berhasil dihapus`,
            data: result
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: 'Database tidak tersambung.. silahkan coba lagi',
            error: err
        });
    }
    }

module.exports = {
    getPeminjamanKendaraan,
    getPaginationKendaraan,
    getLogByMonth,
    getApproveReq,
    getPendReq,
    getRejectReq,
    addPeminjamanKendaraan,
    updatePeminjamanKendaraan,
    deletePeminjamanKendaraan
};