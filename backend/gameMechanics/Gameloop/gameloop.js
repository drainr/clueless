// Main turn-flow handlers for the game loop.
// This file connects the turn system, suggestion logic, and client-facing state for each phase of play.
// It is the high-level entry point for rolling, moving, suggesting, refuting, and ending turns.

const { startTurn, applyMove, advanceTurn, getReachableSquares } = require('./TurnSystem');
const { makeSuggestion, refuteOrPass, getCurrentRefuter }        = require('./suggestionEngine');
const { clientView }                                              = require('./gameState');

//step 1: player roll

function onRoll(gameState, playerId) {
  if (gameState.phase !== 'roll') throw new Error('Not time to roll');

  const current = gameState.players[gameState.currentTurn];
  if (current.id !== playerId) throw new Error('Not your turn');

  startTurn(gameState); // rolls dice, sets phase → 'move'

  // send reachable squares to frontend for highlighting (display only)
  const occupied = gameState.players
    .filter(p => p.id !== playerId)
    .map(p => p.position);

  const reachable = getReachableSquares(
    current.position,
    gameState.diceRoll.total,
    gameState.board,
    occupied
  );

  return {
    state:    clientView(gameState, playerId),
    reachable,                  // frontend highlights these squares
    diceRoll: gameState.diceRoll,
  };
}

// ─── step 2: player moves ─────────────────────────────────────────────────────

function onMove(gameState, playerId, targetPos) {
  if (gameState.phase !== 'move') throw new Error('Not time to move');

  applyMove(gameState, playerId, targetPos);
  // applyMove sets phase → 'suggest' if entered a room, 'end' if not

  const player = gameState.players.find(p => p.id === playerId);

  return {
    state:       clientView(gameState, playerId),
    enteredRoom: player.currentRoom,  // null if still in corridor
    canSuggest:  gameState.phase === 'suggest',
  };
}

// ─── step 3 + 4: player makes a suggestion ───────────────────────────────────

function onSuggest(gameState, playerId, { suspect, weapon }) {
  if (gameState.phase !== 'suggest') throw new Error('Not time to suggest');

  const player = gameState.players.find(p => p.id === playerId);
  if (!player.currentRoom) throw new Error('Must be in a room to suggest');

  // room is always the room the player is currently in
  makeSuggestion(gameState, playerId, {
    suspect,
    weapon,
    room: player.currentRoom,
  });
  // phase → 'refute'

  const nextRefuterId = getCurrentRefuter(gameState);

  return {
    state:       clientView(gameState, playerId),
    nextRefuter: nextRefuterId,  // tell frontend whose turn it is to respond
  };
}

// ─── step 5: left player refutes or passes ────────────────────────────────────

function onRefute(gameState, playerId, cardShown = null) {
  if (gameState.phase !== 'refute') throw new Error('Not time to refute');

  refuteOrPass(gameState, playerId, cardShown);
  // if cardShown     → phase → 'end'
  // if passing       → stays 'refute', moves to next refuter
  // if no one can    → phase → 'end'

  const suggestion = gameState.activeSuggestion;
  const nextRefuter = getCurrentRefuter(gameState);

  return {
    state:        clientView(gameState, playerId),
    nextRefuter,                          // null if refutation is done
    refutedBy:    suggestion.refutedBy,   // who showed a card (public)
    noOneRefuted: suggestion.noOneRefuted,
  };
}

// ─── end turn ─────────────────────────────────────────────────────────────────

function onEndTurn(gameState, playerId) {
  if (gameState.phase !== 'end') throw new Error('Turn not finished yet');

  const current = gameState.players[gameState.currentTurn];
  if (current.id !== playerId) throw new Error('Not your turn');

  advanceTurn(gameState); // phase → 'roll', currentTurn → next player

  const next = gameState.players[gameState.currentTurn];

  return {
    state:       clientView(gameState, playerId),
    nextPlayer:  next.id,
  };
}

module.exports = { onRoll, onMove, onSuggest, onRefute, onEndTurn };