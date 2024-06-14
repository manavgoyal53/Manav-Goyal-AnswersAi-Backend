const {Question} = require('../models/Question');
const { getAIAnswer } = require('../services/aiService');
const {redisClient} = require("../utils")
const Queue = require('bull');
const updateUserQuestionsQueue = new Queue("updateUserQuestionsQueue");

updateUserQuestionsQueue.process(async (job)=>{
  const data = job.data
  let cachedData = await redisClient.get(`user_questions_${data.userId}`)
  if(cachedData){
    cachedData = JSON.parse(cachedData);
    cachedData.push(data)
    await redisClient.set(`user_questions_${data.userId}`,JSON.stringify(cachedData),"EX",900)
  }
  else{
    await redisClient.set(`user_questions_${data.userId}`,JSON.stringify([data]),"EX",900)
  }
})

exports.createQuestion = async (req, res) => {
  const { question } = req.body;
  try {
    const answer = await getAIAnswer(question);
    const newQuestion = new Question({
      userId: req.user.id,
      question,
      answer,
    });
    const savedQuestion = await newQuestion.save();
    const cacheKey = `question_${question._id}`;
    redisClient.set(cacheKey,JSON.stringify(savedQuestion))
    updateUserQuestionsQueue.add(savedQuestion)
    res.json(savedQuestion);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getQuestionById = async (req, res) => {
  try {
    const cacheKey = `question_${req.params.questionId}`;
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData){
      res.json(JSON.parse(cachedData))
    }
    else{
      const question = await Question.findById(req.params.questionId);
      if (!question) return res.status(404).json({ msg: 'Question not found' });
      redisClient.set(question._id,JSON.stringify(question))
      res.json(question);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
