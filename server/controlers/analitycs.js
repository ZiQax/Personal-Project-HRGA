const { get } = require('mongoose');
const modelAnalitycs = require('../models/analitycs');


const analitycsKendaraan = async (req, res) => {
    try{
        const rows = await modelAnalitycs.getPeminjamanMonthly();
        const labels = rows.map(r => r.month);
        const data = rows.map(r => r.total);

        res.json({labels, data});

    }catch(err){
        return res.status(500).json({
            message : 'Database Error',
            error : err
        })
    }
}

const anlyticsIzin = async (req, res) => {
    try{
        const rows = await modelAnalitycs.getAllIzin();
        const labels = rows.map(r => r.month);
        const data = rows.map(r => r.total);

        res.json({labels, data});

    }catch(err){
        return res.status(500).json({
            message : 'Database Error',
            error : err
        });
    };
};

const getTopRecentPeminjaman = async (req, res) => {
    try{
        const rows = await modelAnalitycs.getTopPemijaman();
            res.json({data: rows});
    }catch(err){
        return res.status(500).json({
            message : 'Database Error',
            error : err
        });
    };

}

const getTopRecentIzin = async (req, res) => {
    try{
        const rows = await modelAnalitycs.getTopIzin();
            res.json({data: rows});
    }catch(err){
        return res.status(500).json({
            message : 'Database Error',
            error : err
        });
    };
}

const accumStatusIzin = async (req, res) => {
     try{
        const rows = await modelAnalitycs.getStatus();
        
        const data = rows[0];

        res.json({
            labels: ['Pending', 'Approved', 'Rejected'],
            data: [data.pending, data.approved, data.rejected]
        });
   

     }catch(err){
        console.log(err);
        return res.status(500).json({
            message : 'Database Error',
            error : err
        });
     }
}

module.exports = {
    analitycsKendaraan,
    anlyticsIzin,
    getTopRecentPeminjaman,
    getTopRecentIzin,
    accumStatusIzin
};