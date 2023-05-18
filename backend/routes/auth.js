const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');

const router = express.Router();

const User = require('../models/User');

// Signup route
router.post(
  '/signup',
  [
    body('email').trim().isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Check if the email is already taken
      const existingUser = await User.findOne().or([{ email } ]);
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const user = new User({  email, password: hashedPassword });
      await user.save();

      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, 'your-secret-key');

      // Send the token as a response
      res.status(201).json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

module.exports = router;
