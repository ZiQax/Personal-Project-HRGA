const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {getByUsername, createUser, findByusernameOrNik} = require("../models/userModel");

const register = async (req, res) => {
   try{
     const {nik, username, password, role} = req.body;

     if(!nik || !username || !password || !role) return res.status(400).json({message: "Semua field harus diisi"});

     const hashedPassword = await bcrypt.hash(password, 10);

     const userId = await createUser({nik, username, password: hashedPassword, role});

     res.status(201).json({message: "success", userId});
   }catch(err){
    console.error("REGISTER ERROR:", err); // biar kebaca di terminal
     res.status(500).json({message: "server error", error: err.message});
   }
};


const login = async (req, res) => {
    try{
    const { identifier, password} = req.body;

    const user = await findByusernameOrNik(identifier);

    if(!user) return res.status(404).json({message: "User not found"});
    console.log(user);

    const validPassword = await bcrypt.compare(password, user.password);

    if(!validPassword) return res.status(401).json({message: "Invalid password"});

    const token = jwt.sign({id: user.id, nik: user.nik, username: user.username, role:user.role}, "secret_key", {expiresIn: "1d"});

    res.json({message: "berhasil login", token, user});

    }catch(err){
        console.error("LOGIN ERROR:", err);
        res.status(500).json({message: "server error", error: err});
    }
};


module.exports = {login, register};