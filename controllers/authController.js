const {User} = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const {redisClient} = require("../utils");
dotenv.config();

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ "email":email });
    if (!user) return res.status(400).json({ msg: "User doesn't exists" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid password' });

    const payload = { user: { id: user.id } };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    const refreshToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({"accessToken":accessToken,"refreshToken":refreshToken});
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

const logout = async (req, res) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(400).json({ msg: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const expiration = decoded.exp - Math.floor(Date.now() / 1000);

    await redisClient.set(token, 'blacklisted', 'EX', expiration);
    res.json({ msg: 'Logged out successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};


const refreshToken = (req, res) => {
  const refreshToken = req.header('x-refresh-token');
  if (!refreshToken) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const payload = { user: { id: decoded.user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

module.exports = {login,logout,refreshToken}
