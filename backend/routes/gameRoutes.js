const express = require('express');
const router = express.Router();
const { getGame } = require('../controllers/gameController');
const { protect } = require('../middleware/authMiddleware');

router.get('/:id', protect, getGame);

module.exports = router;