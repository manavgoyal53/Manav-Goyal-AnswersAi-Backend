const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {redisClient} = require("./utils");
dotenv.config();

const auth = async (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });
  const isBlacklisted = await redisClient.get(token) == "blacklisted";
  if (isBlacklisted) {
    return res.status(401).json({ msg: 'Token is blacklisted, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = {auth};
