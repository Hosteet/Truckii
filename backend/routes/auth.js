const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

const router = express.Router();
const User = require('../models/User');

const Email = require('smtpjs');
const smtpConfig = {
  host: 'smtp.elasticemail.com',
  port: 2525, //
  secure: false, // or true if it is a secure connection
  auth: {
    user: 'developer@hosteet.com',
    pass: 'A93F415FF66F8E31FDEF2C3DB9CCB2CB1272',
  },
};

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
      const existingUser = await User.findOne().or([{ email }]);
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Create a new user
      const user = new User({ email, password: hashedPassword });
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

// Login route
router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').trim().notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find the user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Compare the password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Generate a JWT token
      const token = jwt.sign({ userId: user._id }, 'your-secret-key');

      // Send the token as a response
      res.json({ token });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);
  

module.exports = router;
