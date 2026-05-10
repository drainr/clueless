const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { Schema } = mongoose;

/**
 * User Schema
 * Covers registered users only. Guests are handled ephemerally
 * via session (no DB record required for MVP).
 *
 * Roles:
 *  - 'user'  -> standard registered player
 *  - 'admin' -> platform administrator
 *
 * Auth pattern: bcrypt password hashing on pre-save + matchPassword()
 * instance method. Your auth controller should sign a JWT on login
 * using the user's _id as the payload, then verify it via middleware.
 */
const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
      maxlength: 24,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    // Stored as a bcrypt hash — never the plaintext value.
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },

    // Persistent stats (survive across sessions)
    stats: {
      gamesPlayed:    { type: Number, default: 0 },
      gamesWon:       { type: Number, default: 0 },
      gamesLost:      { type: Number, default: 0 },
      totalGuesses:   { type: Number, default: 0 },
      correctGuesses: { type: Number, default: 0 },
    },

    avatarUrl: { type: String, default: null },

    // Soft-delete / ban support for admin use
    isActive: { type: Boolean, default: true },

    // Guest user support
    isGuest: { type: Boolean, default: false },
    expiresAt: { type: Date, default: null }, // When guest session expires
  },
  { timestamps: true }
);

// Hash password before saving.
// Only re-hashes when the password field is actually modified,
// so stat updates don't trigger an unnecessary rehash.
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare a plaintext password against the stored hash.
// Usage in auth controller:
//   const isMatch = await user.matchPassword(req.body.password);
//   if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
//   const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);