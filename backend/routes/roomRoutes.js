const express = require('express');
const router = express.Router();
const { createRoom, getRoomByCode } = require('../controllers/roomController');

router.post('/',     createRoom);
router.get('/:code', getRoomByCode);

module.exports = router;