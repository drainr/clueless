const User = require('../models/user');

// GET /api/users/leaderboard
const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({ isGuest: false, isActive: true })
      .select('username stats.gamesWon avatarUrl')
      .sort({ 'stats.gamesWon': -1 })
      .limit(20);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/users/:id/stats
const getUserStats = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('username stats avatarUrl');
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PATCH /api/users/:id  (own account or admin)
const updateUser = async (req, res) => {
  try {
    const isOwn = req.user._id.toString() === req.params.id;
    if (!isOwn && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const allowed = ['username', 'avatarUrl'];
    const updates = {};
    allowed.forEach((f) => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUserStats, updateUser, getLeaderboard };