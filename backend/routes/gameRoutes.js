const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const gridLayout = require('../gameMechanics/Deck/grid/boardLayout.json');

router.get('/grid', (req, res) => {
	res.json(gridLayout);
});

router.get('/:id', protect, (req, res) => {
	res.status(501).json({ error: 'Game lookup not implemented yet' });
});

module.exports = router;