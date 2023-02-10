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

router.post('/', (req, res, next) => {
  // Mock user
  const user = {
    id: 1,
    username: 'brad',
    email: 'brad@gmail.com'
  }

  jwt.sign({user}, 'secretkey', (err, token) => {
    res.json({
      token
    });
  });
});

module.exports = router;