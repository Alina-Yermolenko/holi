const express = require('express');
const morgan = require('morgan')
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { filesRouter } = require('./filesRouter.js');
const cors = require('cors');
const { authMiddleware } = require('./middleware/authMiddleware.js');

dotenv.config({ path: './.env' });
const PORT = process.env.PORT || 8080;

app.use(express.static('src/public'));

app.use(express.json());
app.use(morgan('tiny'));
app.use(authMiddleware)

app.use(cors());

app.use(express.static('public'));

app.use('/api', filesRouter);

const start = async () => {
  try {
    app.listen(PORT);
  } catch (err) {
    console.error(`Error on server startup: ${err.message}`);
  }
}

start();

//ERROR HANDLER
app.use(errorHandler)

function errorHandler(err, req, res, next) {
  console.error(err)
  res.status(500).send({ 'message': 'Server error' });
}

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });
