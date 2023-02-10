const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// 1xx - Informational responses
// 2xx - Success
// 3xx - Redirection
// 4xx - Client errors
// 5xx - Server errors

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Welcome to the API'
  });
});

// FORMAT TOKEN
// Authorization: Bearer <access_token>
// https://www.youtube.com/watch?v=7nafaH9SddU

// Verify Token
const verifyToken = (req, res, next) => {
  // Get auth header value
  const bearerHeader = req.headers['authorization'];
  //Check if bearer is undefined
  if (typeof bearerHeader !== 'undefined') {

  } else {
    // Forbidden
    res.status(403);
  }
};

router.post('/', verifyToken, (req, res, next) => {
  res.status(200).json({
    message: 'Post created...'
  });
});

module.exports = router;