const { getPaginatedIzin } = require("../models/modelIzin");
const { getPaginatedPeminjamanKendaraan } = require("../models/modelPeminjamanKendaraan");
const {getPaginationUser} = require('../models/userModel');

  

   const paginattedUser = async (req, res, next) => {
    try{
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;


      const results = await getPaginationUser(page, limit);

      
     const pagination = {
        total_data: results.totalData,
        total_pages: results.totalPages,
        current_page: results.currentPage,
        limit
      }

      if (page < results.totalPages) {
        pagination.next = {
          page: page + 1,
          limit
        }
      }

      if (page > 1) {
        pagination.prev = {
          page: page - 1,
          limit
        }
      }

     res.paginatedResults = {
        status: true,
        message : 'Data Berhasil Ditemukan',
        data: results.data,
        pagination
     }

      next();

      }
      catch(e){
        console.log("pagination error", e);
        return res.status(500).json({
            message : 'Database Error',
            error : e
        })
      }
  }


  const paginatted = async (req, res, next) => {
    try{
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;


      const results = await getPaginatedIzin(page, limit);

      
     const pagination = {
        total_data: results.totalData,
        total_pages: results.totalPages,
        current_page: results.currentPage,
        limit
      }

      if (page < results.totalPages) {
        pagination.next = {
          page: page + 1,
          limit
        }
      }

      if (page > 1) {
        pagination.prev = {
          page: page - 1,
          limit
        }
      }

     res.paginatedResults = {
        status: true,
        message : 'Data Berhasil Ditemukan',
        data: results.data,
        pagination
     }

      next();

      }
      catch(e){
        console.log("pagination error", e);
        return res.status(500).json({
            message : 'Database Error',
            error : e
        })
      }
  }

const paginatedKendaraan = async (req, res, next) => {
   try{
     const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 10;

     const result = await getPaginatedPeminjamanKendaraan(page, limit);

     const pagination = {
        totalData: result.totalData,
        total_pages: result.totalPages,
        current_page: result.currentPage,
        limit
      }

      if (page < result.totalPages) {
        pagination.next = {
          page: page + 1,
          limit
        }
      }

      if (page > 1){
        pagination.prev = {
          page: page - 1,
          limit
        }
      }

      res.paginatedResults = {
        status : true,
        message : 'Data Berhasil Ditemukan',
        data : result.data,
        pagination
      }

      next();
      }
      catch(e){
        console.log('data tidak dapat ditemukan', e);
        return res.status(500).json({
            message : 'Database Error',
            error : e
        })
      }
  }



module.exports = {
   paginattedUser,
   paginatted,
   paginatedKendaraan
}