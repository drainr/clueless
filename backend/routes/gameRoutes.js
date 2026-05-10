const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const gridLayout = require('../gameMechanics/Deck/grid/boardLayout.json');
const TestCharacter = require('../gameMechanics/PlayerState/testcharacter');

// Store test character in memory for this session
let testCharacter = new TestCharacter('TestPlayer', 7, 7);

router.get('/grid', (req, res) => {
	res.json(gridLayout);
});

// Test movement endpoints
router.post('/test/roll-dice', (req, res) => {
	const result = testCharacter.rollDice();
	res.json({
		diceRoll: result.diceRoll,
		remainingDice: testCharacter.currentDiceRoll,
		currentPosition: testCharacter.getStatus().position,
		reachableTiles: result.reachableTiles,
	});
});

router.post('/test/move', (req, res) => {
	const { row, col } = req.body;
	if (row === undefined || col === undefined) {
		return res.status(400).json({ error: 'row and col are required' });
	}
	const result = testCharacter.moveTo(row, col);
	res.json({
		success: result.success,
		message: result.message,
		status: testCharacter.getStatus(),
		moveHistory: testCharacter.moveHistory,
	});
});

router.get('/test/status', (req, res) => {
	res.json({
		status: testCharacter.getStatus(),
		validMoves: testCharacter.getValidMoves(),
		moveHistory: testCharacter.moveHistory,
	});
});

router.post('/test/reset', (req, res) => {
	const { row, col } = req.body || {};
	const startRow = Number.isInteger(row) ? row : 5; // default to outside/door row
	const startCol = Number.isInteger(col) ? col : 7; // default to door col

	testCharacter = new TestCharacter('TestPlayer', startRow, startCol);
	res.json({
		message: 'Test character reset',
		status: testCharacter.getStatus(),
	});
});

router.get('/:id', protect, (req, res) => {
	res.status(501).json({ error: 'Game lookup not implemented yet' });
});

module.exports = router;