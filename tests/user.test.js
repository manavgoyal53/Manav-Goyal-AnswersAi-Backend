const request = require('supertest');
const app = require('../server');
const mongoose = require('mongoose');
const User = require('../models/User');

describe('User Endpoints', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DATABASE_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it('should create a new user', async () => {
    const res = await request(app)
      .post('/api/users')
      .send({
        username: 'testuser2',
        email: 'testuser2@example.com',
        password: 'password123'
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });

  it('should get a user by ID', async () => {
    const user = await User.findOne({ email: 'testuser2@example.com' });
    const token = jwt.sign({ user: { id: user.id } }, process.env.JWT_SECRET, { expiresIn: '1h' });

    const res = await request(app)
      .get(`/api/users/${user.id}`)
      .set('x-auth-token', token);

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('username', 'testuser2');
  });
});
