const express = require('express');
const {connectDB} = require('./utils');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
connectDB();

app.use(express.json({ extended: false }));

app.use('/api/auth', require('./routes/authRoutes').router);
app.use('/api/questions', require('./routes/questionRoutes').router);
app.use('/api/users', require('./routes/userRoutes').router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
