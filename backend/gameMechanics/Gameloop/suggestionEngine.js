// Handles suggestion and refutation turns for the game loop.
// It tracks who suggested, who should refute next, and whether a card was shown.
// This keeps the refutation logic separate from movement and turn-rolling code.

function getCurrentRefuter(gameState) {
	if (!gameState.activeSuggestion) {
		return null;
	}

	const totalPlayers = gameState.players.length;
	const startIndex = typeof gameState.activeSuggestion.refuterIndex === 'number'
		? gameState.activeSuggestion.refuterIndex
		: (gameState.currentTurn + 1) % totalPlayers;

	for (let offset = 0; offset < totalPlayers; offset += 1) {
		const index = (startIndex + offset) % totalPlayers;
		if (index === gameState.currentTurn) {
			continue;
		}

		const player = gameState.players[index];
		if (player?.active === false || player?.isEliminated === true) {
			continue;
		}

		return player.id;
	}

	return null;
}

function makeSuggestion(gameState, playerId, suggestion) {
	gameState.activeSuggestion = {
		...suggestion,
		playerId,
		refutedBy: null,
		cardShown: null,
		noOneRefuted: false,
		refuterIndex: (gameState.currentTurn + 1) % gameState.players.length,
	};

	gameState.phase = 'refute';
	return gameState;
}

function refuteOrPass(gameState, playerId, cardShown = null) {
	if (!gameState.activeSuggestion) {
		throw new Error('No active suggestion');
	}

	const currentRefuterId = getCurrentRefuter(gameState);
	if (currentRefuterId && currentRefuterId !== playerId) {
		throw new Error('Not this player\'s turn to refute');
	}

	if (cardShown) {
		gameState.activeSuggestion.refutedBy = playerId;
		gameState.activeSuggestion.cardShown = cardShown;
		gameState.activeSuggestion.refuterIndex = null;
		gameState.phase = 'end';
		return gameState;
	}

	const nextRefuterId = getCurrentRefuter(gameState);
	if (nextRefuterId) {
		const nextIndex = gameState.players.findIndex((player) => player.id === nextRefuterId);
		gameState.activeSuggestion.refuterIndex = nextIndex;
	} else {
		gameState.activeSuggestion.noOneRefuted = true;
		gameState.phase = 'end';
		gameState.activeSuggestion.refuterIndex = null;
	}

	return gameState;
}

module.exports = {
	makeSuggestion,
	refuteOrPass,
	getCurrentRefuter,
};