const express = require('express');
const {login, register} = require('../controlers/authController');
const verify = require('../middleware/authMiddleware');
const { paginattedUser } = require('../middleware/pagination');
const {getUser, resetPasswordUsers, getPaginatedUser} = require('../controlers/userController');

const router = express.Router();

router.post('/login', login);
router.post('/register', register);
router.get('/profile', verify, (req, res) => {
    res.json({message: `Welcome ${req.user.username}`});
});

router.get('/all-user', getUser);
router.get('/all-user/pagination', paginattedUser, getPaginatedUser);
router.put('/reset-password/:id', resetPasswordUsers);

module.exports = router;