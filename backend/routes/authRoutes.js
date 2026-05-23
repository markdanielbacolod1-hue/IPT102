const express = require('express');
const router = express.Router();
const { login, logout, getMe } = require('../controllers/authController');
const { loginRules } = require('../middleware/validators'); // Adjust path as needed
const { validationResult } = require('express-validator');

// Validation runner middleware
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg });
  }
  next();
};

// Route declaration using the rules
router.post('/login', loginRules, validate, login);

module.exports = router;