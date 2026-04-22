const express  = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const cors     = require('cors');
require('./config/passport');

const app = express();
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());
app.use('/api/auth', require('./routes/auth'));

mongoose.connect(process.env.MONGO_URI).then(() =>
  app.listen(5000, () => console.log('Server on :5000'))
);