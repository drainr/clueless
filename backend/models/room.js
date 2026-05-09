const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Room Schema
 * Represents a single game lobby / active session.
 * Created when a registered user or guest starts a game.
 * Destroyed (or archived) once the game ends.
 *
 * Players array supports both registered users (userId present)
 * and guests (userId null, identified by a session/socket ID).
 */

const PlayerSlotSchema = new Schema(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'User', default: null }, // null → guest
    displayName: { type: String, required: true },   // username or "Guest_XXXX"
    socketId:    { type: String, required: true },   // socket.io id for real-time events
    character:   { type: String, default: null },    // chosen Clue character name
    isHost:      { type: Boolean, default: false },
    isReady:     { type: Boolean, default: false },
    isActive:    { type: Boolean, default: true },   // false = disconnected mid-game
  },
  { _id: false }
);

const RoomSchema = new Schema(
  {
    // ── Identification ──────────────────────────────────────────────────
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      length: 6,             // e.g. "AB12CD" — used for join-by-code
    },

    // ── Lifecycle ───────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['waiting', 'in_progress', 'finished'],
      default: 'waiting',
    },

    // ── Players ─────────────────────────────────────────────────────────
    players: {
      type: [PlayerSlotSchema],
      default: [],
    },
    maxPlayers: {
      type: Number,
      default: 6,
      min: 2,
      max: 6,
    },

    // ── Game reference ──────────────────────────────────────────────────
    // Populated once the host starts the game.
    gameId: { type: Schema.Types.ObjectId, ref: 'Game', default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Room', RoomSchema);