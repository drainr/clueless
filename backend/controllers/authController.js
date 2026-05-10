const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const generateToken = (id) => {
    return jwt.sign({ id }, 
    process.env.JWT_SECRET, 
    { expiresIn: "1h" });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const exists = await User.findOne({ $or: [{ email }, { username }] });
    if (exists) return res.status(400).json({ message: 'Username or email already taken' });
    const user = await User.create({ username, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    if (!user.isActive) return res.status(403).json({ message: 'Account disabled' });
    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, username: user.username, role: user.role } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
 
// GET /api/auth/me  (protected)
const getMe = async (req, res) => {
  res.json(req.user);
};

// POST /api/auth/guest
const guest = async (req, res) => {
  try {
    // Generate unique guest username
    const guestId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const username = `Guest_${guestId}`;

    // Guest expires in 24 hours
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const user = await User.create({
      username,
      email: `guest_${guestId}@guest.local`,
      password: guestId, // Temporary, won't be used
      isGuest: true,
      expiresAt,
      isActive: true,
    });

    const token = generateToken(user._id);
    res.status(201).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
        isGuest: true,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getMe, guest };