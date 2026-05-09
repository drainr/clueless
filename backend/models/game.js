const mongoose = require('mongoose');
const { Schema } = mongoose;

/**
 * Game Schema
 * Holds the full live state of a single Clue match.
 * This is the document your game loop reads/writes on every turn.
 *
 * Solution is stored server-side only and never sent to clients
 * until the game ends or a correct accusation is made.
 */

// ── Sub-schemas ────────────────────────────────────────────────────────────

/** One player's current in-game state */
const GamePlayerSchema = new Schema(
  {
    userId:      { type: Schema.Types.ObjectId, ref: 'User', default: null },
    displayName: { type: String, required: true },
    character:   { type: String, required: true },
    socketId:    { type: String, required: true },

    // Cards dealt to this player
    hand: [{ type: String }],     // card IDs/names, e.g. ["Scarlett","Knife","Kitchen"]

    // Position on the board grid
    position: {
      row: { type: Number, default: 0 },
      col: { type: Number, default: 0 },
    },

    // Tracking
    isEliminated: { type: Boolean, default: false },  // made a wrong accusation
    isActive:     { type: Boolean, default: true },   // still connected
  },
  { _id: false }
);

/** One dice roll event */
const DiceRollSchema = new Schema(
  {
    playerId:  { type: String, required: true },   // displayName or userId string
    roll:      { type: Number, required: true },   // combined value
    die1:      { type: Number, required: true },
    die2:      { type: Number, required: true },
    timestamp: { type: Date,   default: Date.now },
  },
  { _id: false }
);

/** One suggestion or accusation made during the game */
const GuessSchema = new Schema(
  {
    playerId:   { type: String, required: true },
    type:       { type: String, enum: ['suggestion', 'accusation'], required: true },
    suspect:    { type: String, required: true },
    weapon:     { type: String, required: true },
    location:   { type: String, required: true },
    refutedBy:  { type: String, default: null },   // displayName of player who showed a card
    cardShown:  { type: String, default: null },   // card shown (server only — not broadcast)
    isCorrect:  { type: Boolean, default: null },  // null for suggestions; true/false for accusations
    timestamp:  { type: Date, default: Date.now },
  },
  { _id: false }
);

// ── Main Game Schema ───────────────────────────────────────────────────────

const GameSchema = new Schema(
  {
    roomId: {
      type: Schema.Types.ObjectId,
      ref: 'Room',
      required: true,
      unique: true,
    },

    // ── Players ────────────────────────────────────────────────────────
    players: [GamePlayerSchema],

    // ── Turn tracking ──────────────────────────────────────────────────
    currentTurnIndex: { type: Number, default: 0 },   // index into players[]
    turnNumber:       { type: Number, default: 1 },
    turnPhase: {
      type: String,
      // roll → move → suggest/accuse → refute → end_turn
      enum: ['roll', 'move', 'action', 'refute', 'end_turn'],
      default: 'roll',
    },

    // ── The secret solution (never sent to clients during play) ────────
    solution: {
      suspect:  { type: String, required: true },
      weapon:   { type: String, required: true },
      location: { type: String, required: true },
    },

    // ── Event log ─────────────────────────────────────────────────────
    diceRolls: [DiceRollSchema],
    guesses:   [GuessSchema],

    // ── Board state ────────────────────────────────────────────────────
    // Map grid layout — for MVP a single fixed map is fine.
    // Stored here if you later want to support multiple maps.
    mapId: { type: String, default: 'classic' },

    // ── Outcome ────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ['active', 'finished'],
      default: 'active',
    },
    winnerId:    { type: String, default: null },   // displayName of winner
    finishedAt:  { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Game', GameSchema);