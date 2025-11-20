const modelUpdateKaryawan = require("../models/updateKaryawan");

const updateKaryawan = async (req, res) => {
    try{
        const {NIK, nama, postion, departement, section} = req.body;

        if (!NIK || !nama || !postion || !departement || !section) {
            return res.status(400).json({message : 'Bad Request'});
        }

        const result = await modelUpdateKaryawan.updateKaryawan(NIK, nama, postion, departement, section);

        res.status(201).json({
            message : 'Success',
            data : result
        });
    }catch(err){
        return res.status(500).json({
            message : 'Database Error',
            error : err
        });
    };
};

module.exports = {updateKaryawan};