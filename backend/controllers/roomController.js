const Room = require('../models/room');
const { generateRoomCode } = require('../utils/roomUtils');

// POST /api/rooms
const createRoom = async (req, res) => {
  try {
    const code = await generateRoomCode();
    const room = await Room.create({
      code,
      players: [{
        userId:      req.user?._id ?? null,
        displayName: req.body.displayName || req.user?.username || 'Guest',
        socketId:    req.body.socketId,
        isHost:      true,
        isReady:     false,
      }],
    });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/rooms/:code
const getRoomByCode = async (req, res) => {
  try {
    const room = await Room.findOne({ code: req.params.code.toUpperCase() });
    if (!room) return res.status(404).json({ message: 'Room not found' });
    res.json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createRoom, getRoomByCode };