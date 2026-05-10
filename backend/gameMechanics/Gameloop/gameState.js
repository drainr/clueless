// Builds the player-specific game state sent to the frontend.
// It hides private information like other players' hands while keeping the shared board and turn data visible.
// Use this when the client needs a safe snapshot of the current game.

function clientView(gameState, playerId) {
  return {
	phase: gameState.phase,
	currentTurn: gameState.currentTurn,
	diceRoll: gameState.diceRoll,
	board: gameState.board,
	activeSuggestion: gameState.activeSuggestion,
	players: gameState.players.map((player) => ({
		...player,
		hand: player.id === playerId ? player.hand : undefined,
	})),
  };
}

module.exports = {
	clientView,
};