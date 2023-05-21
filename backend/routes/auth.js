const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');

const nodemailer = require('nodemailer');
require('dotenv').config();

const crypto = require('crypto');

// Create a transporter instance
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});



function generateResetToken() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let token = '';
  for (let i = 0; i < 5; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    token += characters[randomIndex];
  }
  return token;
}
function generateUniqueToken(email) {
  const timestamp = Date.now().toString();
  const hashedEmail = bcrypt.hashSync(email, 10); // Hash the email for added uniqueness
  const uniqueString = timestamp + hashedEmail;
  const token = bcrypt.hashSync(uniqueString, 10);
  return token;
}

async function sendPasswordResetEmail(email, resetUrl) {
  try {
    // Compose the email message
    const message = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Password Reset',
      text: `
        You are receiving this email because you (or someone else) have requested to reset the password for your account.
        Please click on the following link or paste it into your browser to complete the process:
        ${resetUrl}
        If you did not request this, please ignore this email and your password will remain unchanged.
      `,
    };

    // Send the email
    const info = await transporter.sendMail(message);
    console.log('Email sent:', info.messageId);
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}
// Signup route
router.post(
  '/signup',
  [
    body('email').trim().isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').trim().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already taken' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = new User({ email, password: hashedPassword });

      const token = generateUniqueToken(email);
      user.token = token;

      await user.save();

      res.status(201).json({ token });
    } catch (error) {
      console.log('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Login route
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email address'),
    body('password').trim().notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const isPasswordMatch = await bcrypt.compare(password, user.password);
      if (!isPasswordMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      res.json({ token: user.token, userId: user._id });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Reset password route
router.post(
  '/reset-password',
  [
    body('email').trim().isEmail().withMessage('Invalid email').normalizeEmail(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const resetToken = generateResetToken();
      user.resetToken = resetToken;
      await user.save();

      const resetUrl = `http://localhost:5173/reset-password?token=${resetToken}`;

        // Send the password reset email
        await sendPasswordResetEmail(email, resetUrl);

        res.json({ message: 'Password reset email sent' });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
  }
);

module.exports = router;
