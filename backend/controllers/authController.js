const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const guestNames = {
  adjectives: [
    'Silly', 'Sneaky', 'Clumsy', 'Grumpy', 'Witty', 'Jolly', 'Crafty',
    'Daring', 'Fuzzy', 'Lucky', 'Quirky', 'Spooky', 'Dizzy', 'Fancy',
    'Clever', 'Bouncy', 'Sleepy', 'Wobbly', 'Cheeky', 'Jumpy', 'Misty',
    'Brave', 'Shady', 'Hasty', 'Zippy', 'Nosy', 'Rusty', 'Grouchy'
  ],
  animals: [
    'Armadillo', 'Mongoose', 'Platypus', 'Wombat', 'Narwhal', 'Capybara',
    'Axolotl', 'Quokka', 'Pangolin', 'Fennec', 'Tapir', 'Binturong',
    'Meerkat', 'Caracal', 'Okapi', 'Numbat', 'Kinkajou', 'Fossa',
    'Parakeet', 'Wolverine', 'Porcupine', 'Salamander', 'Chameleon',
    'Albatross', 'Flamingo', 'Weasel', 'Hedgehog', 'Badger'
  ]
}

const generateGuestName = () => {
  const adj    = guestNames.adjectives[Math.floor(Math.random() * guestNames.adjectives.length)]
  const animal = guestNames.animals[Math.floor(Math.random() * guestNames.animals.length)]
  return `${adj} ${animal}`
}

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
    const username  = generateGuestName()
    const guestId   = Math.random().toString(36).substr(2, 9).toUpperCase()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000)

    const user = await User.create({
      username,
      email:    `guest_${guestId}@guest.local`,
      password: guestId,
      isGuest:  true,
      expiresAt,
      isActive: true,
    })

    const token = generateToken(user._id)
    res.status(201).json({
      token,
      user: {
        id:       user._id,
        username: user.username,
        role:     user.role,
        isGuest:  true,
      },
    })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

module.exports = { register, login, getMe, guest };