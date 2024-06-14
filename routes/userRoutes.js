const express = require('express');
const router = express.Router();
const {auth} = require('../middleware');
const { createUser, getUserById, getUserQuestions } = require('../controllers/userController');

router.post('/', createUser);
router.get('/:userId', auth, getUserById);
router.get('/:userId/questions', auth, getUserQuestions);

module.exports = {router};
