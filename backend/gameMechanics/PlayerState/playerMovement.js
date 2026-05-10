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
   * @returns {Array} Array of valid adjacent positions
   */
  getValidMoves() {
    const { row, col } = this.position;
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
        // Can move to hallway or door tiles
        if (tile.type === 'hallway' || tile.type === 'door') {
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
            const key = `${r},${c}`;
            visited.add(key);
            // room interior counts as reachable (for UI/highlighting)
            reachable.push({ row: r, col: c });
            // allow exploring from any room tile at distance 0
            queue.push({ row: r, col: c, distance: 0 });
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

      if (current.distance < diceRoll) {
        const { row, col } = current;
        const directions = [
          { row: -1, col: 0 },
          { row: 1, col: 0 },
          { row: 0, col: -1 },
          { row: 0, col: 1 },
        ];

        for (const dir of directions) {
          const newRow = row + dir.row;
          const newCol = col + dir.col;
          const key = `${newRow},${newCol}`;

          if (
            newRow >= 0 &&
            newRow < this.BOARD_SIZE &&
            newCol >= 0 &&
            newCol < this.BOARD_SIZE &&
            !visited.has(key)
          ) {
            const tile = this.board[newRow][newCol];
            // Allow moving into hallways, doors, and room tiles (walkable)
            if (tile.type === 'hallway' || tile.type === 'door' || tile.type === 'room') {
              visited.add(key);
              queue.push({ row: newRow, col: newCol, distance: current.distance + 1 });
              reachable.push({ row: newRow, col: newCol });
            }
          }
        }
      }
    }

    return reachable;
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

    const tile = this.board[newRow][newCol];
    // Allow entering rooms, doors, and hallways — all tiles are walkable
    this.position = { row: newRow, col: newCol };
    return {
      success: true,
      message: 'Moved successfully',
      position: this.position,
      tileInfo: tile,
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
