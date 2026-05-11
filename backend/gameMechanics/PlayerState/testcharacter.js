// Test character to demonstrate player movement on the grid with dice rolls
const PlayerMovement = require('./playerMovement');

class TestCharacter {
  constructor(name = 'TestPlayer', startRow = 7, startCol = 7) {
    this.name = name;
    this.movement = new PlayerMovement({ row: startRow, col: startCol });
    this.moveHistory = [];
    this.currentDiceRoll = 0;
  }

  /**
   * Roll dice and show reachable tiles
   * @returns {Object} Dice roll result and reachable positions
   */
  rollDice() {
    const result = this.movement.rollDiceAndGetReachable();
    this.currentDiceRoll = result.diceRoll;
    console.log(`\n🎲 ${this.name} rolled: ${result.diceRoll}`);
    console.log(`📍 Current position: Row ${this.movement.getPosition().row}, Col ${this.movement.getPosition().col}`);
    console.log(`✨ Reachable tiles (${result.reachableTiles.length}):`);
    result.reachableTiles.forEach((tile, idx) => {
      if (idx < 10) {
        console.log(`   - Row ${tile.row}, Col ${tile.col}`);
      }
    });
    if (result.reachableTiles.length > 10) {
      console.log(`   ... and ${result.reachableTiles.length - 10} more`);
    }
    return result;
  }

  /**
   * Move to a specific position
   * @param {number} newRow - Target row
   * @param {number} newCol - Target column
   * @returns {Object} Movement result
   */
  moveTo(newRow, newCol) {
    // enforce single-tile steps and require a remaining dice move
    const currentPos = this.movement.getPosition();
    const dist = Math.abs(newRow - currentPos.row) + Math.abs(newCol - currentPos.col);
    if (dist !== 1) {
      return { success: false, message: 'Can only move one tile at a time (use multiple steps).' };
    }
    if (this.currentDiceRoll <= 0) {
      return { success: false, message: 'No remaining moves. Roll the dice first.' };
    }

    const result = this.movement.moveToPosition(newRow, newCol);
    if (result.success) {
      this.currentDiceRoll -= 1;
      this.moveHistory.push({
        from: this.moveHistory[this.moveHistory.length - 1]?.to || currentPos,
        to: { row: newRow, col: newCol },
        diceRoll: this.currentDiceRoll + 1, // original roll value for this move
        tileType: result.tileInfo?.type,
      });
      console.log(`✅ Moved to Row ${newRow}, Col ${newCol}`);
      console.log(`   Tile type: ${result.tileInfo?.type}`);
    } else {
      console.log(`❌ ${result.message}`);
    }
    return result;
  }

  /**
   * Get valid adjacent moves from current position
   * @returns {Array} Array of adjacent valid positions
   */
  getValidMoves() {
    return this.movement.getValidMoves();
  }

  /**
   * Get current position info
   * @returns {Object} Current position and tile info
   */
  getStatus() {
    const current = this.movement.getCurrentTile();
    const activeRooms = {};
    if (current.type === 'room' && current.room) {
      activeRooms[current.room] = true;
    }

    return {
      name: this.name,
      position: current.position,
      tileType: current.type,
      roomName: current.room,
      activeRooms,
      moveCount: this.moveHistory.length,
      remainingDice: this.currentDiceRoll,
    };
  }

  /**
   * Print movement history
   */
  printHistory() {
    console.log(`\n📝 ${this.name}'s Movement History:`);
    this.moveHistory.forEach((move, idx) => {
      console.log(
        `${idx + 1}. Rolled ${move.diceRoll} → Moved to (${move.to.row}, ${move.to.col}) [${move.tileType}]`
      );
    });
  }

  /**
   * Test sequence: Roll dice, get reachable tiles, and move to a random reachable tile
   */
  testMove() {
    const diceResult = this.rollDice();
    if (diceResult.reachableTiles.length > 0) {
      const randomTile = diceResult.reachableTiles[Math.floor(Math.random() * diceResult.reachableTiles.length)];
      this.moveTo(randomTile.row, randomTile.col);
    }
  }
}

// Export for use in tests or game logic
module.exports = TestCharacter;

// Demo/Test when run directly
if (require.main === module) {
  console.log('🎮 Clue Board - Player Movement Test\n');

  const player = new TestCharacter('Mrs. White', 5, 7);  // Start at the door of Accusation Room
  console.log(`Starting position: ${player.getStatus().position.row}, ${player.getStatus().position.col} (Door)\n`);

  // Simulate 5 moves
  for (let i = 0; i < 5; i++) {
    console.log(`\n--- Move ${i + 1} ---`);
    player.testMove();
  }

  player.printHistory();
  console.log('\n📊 Final Status:', player.getStatus());
}
