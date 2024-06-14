const express = require('express');
const router = express.Router();
const {auth} = require('../middleware');
const { createQuestion, getQuestionById } = require('../controllers/questionController');

router.post('/', auth, createQuestion);
router.get('/:questionId', auth, getQuestionById);

module.exports = {router};
