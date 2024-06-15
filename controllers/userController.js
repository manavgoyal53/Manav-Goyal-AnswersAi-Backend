const {User} = require('../models/User');
const {Question} = require('../models/Question');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {redisClient} = require("../utils")
dotenv.config();

const createUser = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user1 = await User.findOne({ email });
    let user2 = await User.findOne({ username });
    if (user1 | user2 ) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ username, email, password });
    await user.save();
    await redisClient.set(`user_${user._id}`,JSON.stringify(user),"EX",86400)
    res.json({"message":`User created successfully with id - ${user._id}!`})
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getUserById = async (req, res) => {
  try {
    const cacheKey = `user_${req.params.userId}`
    const cachedData = await redisClient.get(cacheKey);
    if(cachedData){
      res.json(JSON.parse(cachedData))
    }
    else{
      const user = await User.findById(req.params.userId).select('-password');
      if (!user) return res.status(404).json({ msg: 'User not found' });
      await redisClient.set(cacheKey,JSON.stringify(user),"EX",86400);
      res.json(user);
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const getUserQuestions = async (req, res) => {
  try {
    const cacheKey = `user_questions_${req.params.userId}`;
    const cachedData = await redisClient.get(cacheKey);
    if(cachedData){
      console.log(JSON.parse(cachedData))
      res.json(JSON.parse(cachedData))
    }
    else{
      const questions = await Question.find({ userId: req.params.userId });
      if (!questions) return res.status(404).json({ msg: 'No questions found for this user' });
      await redisClient.set(cacheKey,JSON.stringify(questions),"EX",900)
      res.json(questions);
    }
    
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

module.exports = {getUserQuestions,getUserById,createUser}
