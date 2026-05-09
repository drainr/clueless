const Game = require('../models/game');

// GET /api/games/:id
const getGame = async (req, res) => {
  try {
    const game = await Game.findById(req.params.id);
    if (!game) return res.status(404).json({ message: 'Game not found' });
    const safeGame = game.toObject();
    if (game.status === 'active') delete safeGame.solution; // never expose during play
    res.json(safeGame);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getGame };