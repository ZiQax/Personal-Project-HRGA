const usermodel = require("../models/userModel");

const getUser = async (req, res) => {
    try {
        const result = await usermodel.getAllUser();
        res.status(200).json({
            message: "Success",
            data: result
        });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

const getPaginatedUser = async (req, res) => {
    try {
     const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;

        if (page < 1 || limit < 1) {
            return res.status(400).json({ success: false, message: 'Invalid page or limit parameter' });
        }

        const result = await usermodel.getPaginationUser(page, limit);

        res.status(200).json(
            res.paginatedResults
        )
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

const resetPasswordUsers = async (req, res) => {
    try {
        const {id, newPassword} = req.body;

        if(!id || !newPassword) return res.status(400).json({message: "Bad Request"});
       
        await usermodel.resetPassword(id, newPassword);

        res.status(200).json({message: "Success"});
    }catch(err) {
        console.log(err);
        res.status(500).json(err);
    };
};

module.exports = { getUser, getPaginatedUser, resetPasswordUsers };