const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createRoom, getRoomByCode } = require('../controllers/roomController');

router.post('/', protect, createRoom);
router.get('/:code', protect, getRoomByCode);

module.exports = router;