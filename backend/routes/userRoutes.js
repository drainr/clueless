const express = require('express');
const router = express.Router();
const { getUserStats, updateUser, getLeaderboard } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.get('/leaderboard', getLeaderboard);
router.get('/:id/stats', protect, getUserStats);
router.patch('/:id',     protect, updateUser);

module.exports = router;