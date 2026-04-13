const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');
require('dotenv').config();  

// Sets up the email transport used to send OTP messages.
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});

// Generates a numeric OTP without letters or symbols.
// Creates a six-digit numeric OTP.
const generateOtp = () => otpGenerator.generate(6, { upperCase: false, specialChars: false, alphabets: false });

// Creates a new user and sends them an OTP for verification.
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    // Generate OTP
    const otp = generateOtp();
    const otpExpires = Date.now() + 300000; // OTP valid for 5 minutes

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already registered' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      // Keep mobileNumber populated to avoid unique index issues in existing schema.
      mobileNumber: email,
      password: hashedPassword,
      otp,
      otpExpires
    });
    await user.save();

    // Send OTP email
    const mailOptions = {
      from: `RailSeva <${process.env.GMAIL_USER}>`,
      to: email,
      subject: 'RailSeva OTP Verification Code',
      text: `Your RailSeva OTP code is ${otp}. It will expire in 5 minutes.`
    };
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Sign-up successful. Please verify your OTP.' });
  } catch (error) {
    const duplicate = error?.code === 11000;
    if (duplicate) {
      return res.status(400).json({ message: 'User already exists with this email.' });
    }

    const details = error?.message || 'Unknown server error';
    res.status(500).json({ message: `Error during sign-up: ${details}` });
  }
});

// Validates credentials and returns a JWT if the password is correct.
router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Sign-in successful. Please verify your OTP.', success:true,token });
  } catch (error) {
    res.status(500).json({ message: 'Error during sign-in', error });
  }
});

// Confirms the OTP and marks the account as verified.
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    if (user.otpExpires < Date.now()) return res.status(400).json({ message: 'OTP expired' });

    // Validate OTP
    if (user.otp !== otp) return res.status(400).json({ message: 'Invalid OTP' });

    user.isVerified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.status(200).json({ message: 'OTP verified!', success:true,token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' }) });
  } catch (error) {
    res.status(500).json({ message: 'Error during OTP verification', error });
  }
});

module.exports = router;
