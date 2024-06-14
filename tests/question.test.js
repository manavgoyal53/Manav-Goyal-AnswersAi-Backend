const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');
const Question = require('../models/Question');

describe('Question Endpoints', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    const user = new User({ username: 'testuser', email: 'testuser@example.com', password: 'password123' });
    await user.save();
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new question', async () => {
    const user = await User.findOne({ email: 'testuser@example.com' });
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
      .post('/api/questions')
      .set('x-auth-token', token)
      .send({
        question: 'What is Node.js?'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('answer');
  });
});
