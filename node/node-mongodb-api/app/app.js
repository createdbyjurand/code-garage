const express = require('express');
const app = express();

const morgan = require('morgan');
app.use(morgan('dev'));

// Routes

const dht22Routes = require('./routes/dht22');
app.use('/dht22', dht22Routes);

const orderRoutes = require('./routes/orders');
app.use('/orders', orderRoutes);

const jwtRoutes = require('./routes/jwt');
app.use('/jwt', jwtRoutes);

const loginRoutes = require('./routes/login');
app.use('/login', loginRoutes);

// Errors

app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

// https://www.youtube.com/watch?v=zoSJ3bNGPp0

// app.use((req, res, next) => {
//   res.status(200).json({
//     message: 'It works!'
//   });
// });

module.exports = app;
