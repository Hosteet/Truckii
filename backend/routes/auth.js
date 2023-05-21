const express = require('express');
const bcrypt = require('bcrypt');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter instance
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

function generateRandomCode() {
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

      res.json({ message: 'Login successful' });
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

      const resetCode = generateRandomCode();
      user.resetCode = resetCode;
      await user.save();

      // Send the password reset email
      await sendPasswordResetEmail(email, resetCode);

      res.json({ message: 'Password reset email sent', resetCode });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

// Confirm password route
// Confirm password route
router.post(
  `/reset-password/:resetToken`,
  [
    body('email').trim().isEmail().withMessage('Invalid email').normalizeEmail(),
    body('password').trim().notEmpty().withMessage('Password is required'),
    body('confirmPassword').trim().notEmpty().withMessage('Confirm password is required'),
    body('resetCode').trim().notEmpty().withMessage('Reset code is required'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password, confirmPassword, resetCode } = req.body;

      if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (user.resetCode !== resetCode) {
        return res.status(400).json({ message: 'Invalid reset code' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      user.resetCode = null;
      await user.save();

      // Send the password change confirmation email
      await sendPasswordChangeEmail(email);

      res.json({ message: 'Password confirmed and updated successfully' });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

module.exports = router;


async function sendPasswordResetEmail(email, resetCode) {
  try {
    // Compose the email message
    const message = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Password Reset',
      text: `
        You are receiving this email because you (or someone else) have requested to reset the password for your account.
        Your reset code is: ${resetCode}
        Please use this code during the password reset process to confirm your account.
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

async function sendPasswordChangeEmail(email) {
  try {
    // Compose the email message
    const message = {
      from: process.env.FROM_EMAIL,
      to: email,
      subject: 'Password Change Confirmation',
      text: `
        Your password has been successfully changed.
        If you did not perform this action, please contact us immediately.
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

module.exports = router;



module.exports = router;
