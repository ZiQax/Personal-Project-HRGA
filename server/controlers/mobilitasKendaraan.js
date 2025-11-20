const modelMobilitas = require('../models/modelPeminjamanKendaraan');

const getMobilitasKendaraan = async (req, res) => { 
try{
    const data = await modelMobilitas.getAllMobilitas();

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
  ;}
};



const LogDataByCar = async (req, res) => {
  try {
    const { month } = req.params;
    const data = await modelMobilitas.getLogByMonth(month);

    if(!data || data.length === 0) {
      return res.status(404).json({message : 'Not Found'});
    }
    res.status(200).json({
      message : 'success',
      data
    })
  } catch (err) {
    return res.status(500).json({
      message : 'Database Error',
      error : err
    });
  };
};

const addMobilitasKendaraan = async (req, res) => {
  try{
    const {user_id, jenis_kendaraan, tujuan, waktu_berangkat, waktu_pulang, } = req.body;

    if(!user_id || !jenis_kendaraan || !tujuan || !waktu_berangkat || !waktu_pulang || !status) {
      return res.status(400).json({message : 'Bad Request'});
    }

    const result = await modelMobilitas.insertMobilitas(user_id, jenis_kendaraan, tujuan, waktu_berangkat, waktu_pulang, status);

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

module.exports = { getMobilitasKendaraan, LogDataByCar, addMobilitasKendaraan };
