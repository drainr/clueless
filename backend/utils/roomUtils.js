const Room = require('../models/room');

const CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no O/0/1/I for readability

const randomCode = (len = 6) =>
  Array.from({ length: len }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('');

// Generates a unique 6-character room join code.
const generateRoomCode = async (attempts = 10) => {
  for (let i = 0; i < attempts; i++) {
    const code = randomCode();
    if (!(await Room.exists({ code }))) return code;
  }
  throw new Error('Could not generate a unique room code — try again');
};

module.exports = { generateRoomCode };