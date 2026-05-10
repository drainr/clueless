// Minimal turn and movement engine for the game loop.
// This file rolls dice, validates movement, advances turns, and finds reachable squares.
// Keep the logic here small so gameloop.js can focus on phase flow and player actions.

function rollDice() {
  const die1 = Math.floor(Math.random() * 6) + 1;
  const die2 = Math.floor(Math.random() * 6) + 1;

  return {
    die1,
    die2,
    total: die1 + die2,
  };
}

function getCell(board, position) {
  return board?.[position.y]?.[position.x] ?? null;
}

function isOccupied(position, occupiedPositions) {
  return occupiedPositions.some((other) => other.x === position.x && other.y === position.y);
}

function isValidSquare(position, board, occupiedPositions) {
  const cell = getCell(board, position);
  if (!cell || cell.type === 'wall') {
    return false;
  }

  return !isOccupied(position, occupiedPositions);
}

function getReachableSquares(start, steps, board, occupiedPositions) {
  const queue = [{ pos: start, remaining: steps, path: [] }];
  const visited = new Set();
  const reachable = [];

  while (queue.length > 0) {
    const { pos, remaining, path } = queue.shift();
    const key = `${pos.x},${pos.y}`;

    if (visited.has(key)) {
      continue;
    }

    visited.add(key);

    const cell = getCell(board, pos);
    if (!cell) {
      continue;
    }

    reachable.push({ pos, path: [...path, pos] });

    if (remaining === 0 || cell.type === 'room') {
      continue;
    }

    const neighbors = [
      { x: pos.x, y: pos.y - 1 },
      { x: pos.x, y: pos.y + 1 },
      { x: pos.x - 1, y: pos.y },
      { x: pos.x + 1, y: pos.y },
    ];

    neighbors.forEach((next) => {
      if (isValidSquare(next, board, occupiedPositions)) {
        queue.push({ pos: next, remaining: remaining - 1, path: [...path, pos] });
      }
    });
  }

  return reachable;
}

function startTurn(gameState) {
  const player = gameState.players[gameState.currentTurn];
  if (!player) {
    throw new Error('Current player not found');
  }

  if (player.active === false || player.isEliminated === true) {
    return advanceTurn(gameState);
  }

  gameState.diceRoll = rollDice();
  gameState.phase = 'move';

  return gameState;
}

function validateMove(gameState, playerId, targetPos) {
  const player = gameState.players.find((entry) => entry.id === playerId);
  if (!player) {
    throw new Error('Player not found');
  }

  if (gameState.phase !== 'move') {
    throw new Error('Not in move phase');
  }

  const occupied = gameState.players
    .filter((entry) => entry.id !== playerId)
    .map((entry) => entry.position);

  const reachable = getReachableSquares(
    player.position,
    gameState.diceRoll.total,
    gameState.board,
    occupied
  );

  const canReach = reachable.some((entry) => entry.pos.x === targetPos.x && entry.pos.y === targetPos.y);
  if (!canReach) {
    throw new Error('Square not reachable with current roll');
  }

  return true;
}

function applyMove(gameState, playerId, targetPos) {
  validateMove(gameState, playerId, targetPos);

  const player = gameState.players.find((entry) => entry.id === playerId);
  const cell = getCell(gameState.board, targetPos);

  player.position = targetPos;
  player.currentRoom = cell?.type === 'room' || cell?.type === 'door' ? cell.room : null;
  gameState.phase = player.currentRoom ? 'suggest' : 'end';

  return gameState;
}

function advanceTurn(gameState) {
  const totalPlayers = gameState.players.length;
  let nextIndex = (gameState.currentTurn + 1) % totalPlayers;
  let checked = 0;

  while (checked < totalPlayers) {
    const nextPlayer = gameState.players[nextIndex];
    if (nextPlayer?.active !== false && nextPlayer?.isEliminated !== true) {
      gameState.currentTurn = nextIndex;
      gameState.phase = 'roll';
      gameState.diceRoll = null;
      gameState.activeSuggestion = null;
      return gameState;
    }

    nextIndex = (nextIndex + 1) % totalPlayers;
    checked += 1;
  }

  throw new Error('No active players remaining');
}

function endTurn(gameState, playerId) {
  const current = gameState.players[gameState.currentTurn];
  if (!current || current.id !== playerId) {
    throw new Error('Not your turn');
  }

  if (gameState.phase !== 'end') {
    throw new Error('Turn not ready to end');
  }

  return advanceTurn(gameState);
}

module.exports = {
  roll: rollDice,
  startTurn,
  validateMove,
  getReachableSquares,
  applyMove,
  advanceTurn,
  endTurn,
};