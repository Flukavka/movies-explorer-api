require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { errorMiddleware } = require('./middlewares/errorMiddleware');
const { requestLogger } = require('./middlewares/logger');
const routes = require('./routes/index');

const { PORT, DB_URL } = process.env;

mongoose.connect(DB_URL);

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3001',
  ],
}));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(helmet());

app.use(requestLogger);

app.use(limiter);

app.use('/', routes);

routes.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`App listening ${PORT}`);
});
