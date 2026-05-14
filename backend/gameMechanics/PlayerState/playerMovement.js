// Player movement system for grid-based movement with dice rolls
const grid = require('../Deck/grid/grid');

class PlayerMovement {
  constructor(playerPosition = { row: 7, col: 7 }) {
    this.position = playerPosition;
    this.board = grid.createBoard();
    this.BOARD_SIZE = grid.BOARD_SIZE;
  }

  /**
   * Get valid adjacent tiles from current position
   * Respects door requirement: must step on door to enter/exit rooms
   * @returns {Array} Array of valid adjacent positions
   */
  getValidMoves() {
    const { row, col } = this.position;
    const currentTile = this.board[row][col];
    const validMoves = [];
    const directions = [
      { row: -1, col: 0 }, // up
      { row: 1, col: 0 },  // down
      { row: 0, col: -1 }, // left
      { row: 0, col: 1 },  // right
    ];

    for (const dir of directions) {
      const newRow = row + dir.row;
      const newCol = col + dir.col;

      if (newRow >= 0 && newRow < this.BOARD_SIZE && newCol >= 0 && newCol < this.BOARD_SIZE) {
        const tile = this.board[newRow][newCol];

        // Check if this move respects door transition rules
        const validation = this.validateRoomTransition(currentTile, tile);
        if (validation.valid) {
          validMoves.push({ row: newRow, col: newCol });
        }
      }
    }

    return validMoves;
  }

  /**
   * Calculate reachable tiles within diceRoll distance using BFS
   * @param {number} diceRoll - Number of spaces the player can move
   * @returns {Array} Array of reachable positions
   */
  getReachableTiles(diceRoll) {
    const visited = new Set();
    const queue = [];
    const reachable = [];

    // If starting inside a room, seed the search from the room's door(s)
    const startTile = this.board[this.position.row][this.position.col];
    if (startTile.type === 'room') {
      // mark all tiles inside the same room as visited and reachable
      for (let r = 0; r < this.BOARD_SIZE; r++) {
        for (let c = 0; c < this.BOARD_SIZE; c++) {
          const t = this.board[r][c];
          if (t.type === 'room' && t.room === startTile.room) {
            visited.add(`${r},${c}`)
          }
        }
      }
      for (let r = 0; r < this.BOARD_SIZE; r++) {
        for (let c = 0; c < this.BOARD_SIZE; c++) {
          const t = this.board[r][c];
          if (t.type === 'door' && t.room === startTile.room) {
            const key = `${r},${c}`;
            if (!visited.has(key)) {
              visited.add(key);
              reachable.push({ row: r, col: c });
              queue.push({ row: r, col: c, distance: 1 });
            }
          }
        }
      }
      // Note: doors will be discovered by BFS starting from room tiles
    } else {
      queue.push({ ...this.position, distance: 0 });
      visited.add(`${this.position.row},${this.position.col}`);
    }

    while (queue.length > 0) {
      const current = queue.shift();

      if (current.distance >= diceRoll) continue;

      const directions = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
      ];

      for (const dir of directions) {
        const newRow = current.row + dir.row;
        const newCol = current.col + dir.col;
        const key = `${newRow},${newCol}`;

        if (
          newRow < 0 || newRow >= this.BOARD_SIZE ||
          newCol < 0 || newCol >= this.BOARD_SIZE ||
          visited.has(key)
        ) continue;

        const tile = this.board[newRow][newCol];
        // Allow moving into hallways, doors, and room tiles (walkable)
        if (tile.type === 'hallway') {
          visited.add(key);
          reachable.push({ row: newRow, col: newCol });
          queue.push({ row: newRow, col: newCol, distance: current.distance + 1 });
        } else if (tile.type === 'door') {
          visited.add(key);
          reachable.push({ row: newRow, col: newCol });
          queue.push({ row: newRow, col: newCol, distance: current.distance + 1 });
        } else if (tile.type === 'room') {
          visited.add(key);
          }
        }
    }
    return reachable;
  }

/**
 * Validate if a move from current position to target is allowed
 * Players must step on door tiles to enter/exit rooms
 * @param {Object} currentTile - Current tile object
 * @param {Object} targetTile - Target tile object
 * @returns {Object} { valid: boolean, message: string }
 */
validateRoomTransition(currentTile, targetTile) {
  // Moving from hallway to room interior: not allowed directly (must go through door)
  if (currentTile.type === 'hallway' && targetTile.type === 'room') {
    return { valid: false, message: 'Must step on door tile first to enter room' };
  }

  // Moving from room interior to hallway: not allowed directly (must go through door)
  if (currentTile.type === 'room' && targetTile.type === 'hallway') {
    return { valid: false, message: 'Must step on door tile first to exit room' };
  }

  // Moving from one room to a different room: not allowed (must go through door)
  if (currentTile.type === 'room' && targetTile.type === 'room' && currentTile.room !== targetTile.room) {
    return { valid: false, message: 'Cannot move between rooms directly; must exit through door' };
  }

  // All other moves are allowed:
  // - Hallway to hallway (normal movement)
  // - Hallway to door (entering from hallway)
  // - Door to hallway (exiting to hallway)
  // - Door to room (entering room through door)
  // - Room to door (exiting room through door)
  // - Room to room within same room (interior movement)
  return { valid: true };
}

/**
 * Move player to a new position (validated)
 * @param {number} newRow - Target row
 * @param {number} newCol - Target column
 * @returns {Object} { success: boolean, message: string, position: Object }
 */
moveToPosition(newRow, newCol) {
  if (newRow < 0 || newRow >= this.BOARD_SIZE || newCol < 0 || newCol >= this.BOARD_SIZE) {
    return { success: false, message: 'Position out of bounds' };
  }

  const currentTile = this.board[this.position.row][this.position.col];
  const targetTile = this.board[newRow][newCol];

  // Validate room transition rules
  const validation = this.validateRoomTransition(currentTile, targetTile);
  if (!validation.valid) {
    return { success: false, message: validation.message };
  }

  // Move is valid, update position
  this.position = { row: newRow, col: newCol };
  return {
    success: true,
    message: 'Moved successfully',
    position: this.position,
    tileInfo: targetTile,
  };
}

/**
 * Get current tile information
 * @returns {Object} Information about current tile
 */
getCurrentTile() {
  const tile = this.board[this.position.row][this.position.col];
  return {
    position: this.position,
    ...tile,
  };
}

/**
 * Get current position
 * @returns {Object} Current row and col
 */
getPosition() {
  return { ...this.position };
}

/**
 * Roll dice and get reachable tiles (1-6)
 * @returns {Object} { diceRoll: number, reachableTiles: Array }
 */
rollDiceAndGetReachable() {
  const diceRoll = Math.floor(Math.random() * 6) + 1;
  const reachableTiles = this.getReachableTiles(diceRoll);
  return { diceRoll, reachableTiles };
}
}

module.exports = PlayerMovement;
