const nodemailer = require('nodemailer');
require('dotenv').config();

// Create a transporter for SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Set to true if using a secure connection (e.g., with SSL/TLS)
  auth: {
    user: process.env.SMTP_USERNAME,
    pass: process.env.SMTP_PASSWORD,
  },
});

module.exports = transporter;
