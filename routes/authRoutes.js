const express = require('express');
const router = express.Router();
const { login, logout, refreshToken } = require('../controllers/authController');

router.post('/login', login);
router.post('/logout', logout);
router.post('/refresh', refreshToken);

module.exports = {router};
