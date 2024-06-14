const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const {createClient} = require('redis');

const redisClient = createClient({
  "host":process.env.REDIS_HOST,
  "port":process.env.REDIS_PORT
});

redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});
redisClient.connect();



const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = {connectDB,redisClient}
