const jwt = require('jsonwebtoken');

function verify (req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split('')[1];

    if (!token) return res.status(403).json({message: 'connot find token'});

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({message: 'Token is not valid'});
        req.user = user;
        next();
    });
};

module.exports = verify;