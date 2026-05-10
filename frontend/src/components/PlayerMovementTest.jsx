import { useState, useEffect } from 'react';

export default function PlayerMovementTest() {
  const [playerPosition, setPlayerPosition] = useState({ row: 5, col: 7 });
  const [diceRoll, setDiceRoll] = useState(0);
  const [reachableTiles, setReachableTiles] = useState([]);
  const [moveHistory, setMoveHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Roll dice and get reachable tiles
  const handleRollDice = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/game/test/roll-dice', { method: 'POST' });
      const data = await response.json();
      setDiceRoll(data.diceRoll);
      setReachableTiles(data.reachableTiles);
    } catch (error) {
      console.error('Roll dice error:', error);
    }
    setLoading(false);
  };

  // Move to a specific tile
  const handleMove = async (row, col) => {
    try {
      const response = await fetch('/api/game/test/move', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ row, col }),
      });
      const data = await response.json();
      if (data.success) {
        setPlayerPosition(data.status.position);
        setMoveHistory(data.moveHistory);
        setReachableTiles([]);
        setDiceRoll(0);
      }
    } catch (error) {
      console.error('Move error:', error);
    }
  };

  // Reset player
  const handleReset = async () => {
    try {
      await fetch('/api/game/test/reset', { method: 'POST' });
      setPlayerPosition({ row: 5, col: 7 });
      setDiceRoll(0);
      setReachableTiles([]);
      setMoveHistory([]);
    } catch (error) {
      console.error('Reset error:', error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg max-w-md">
      <h3 className="text-lg font-bold text-[#583927] mb-4">🎮 Player Movement Test</h3>

      {/* Player Status */}
      <div className="bg-gray-100 p-3 rounded mb-4 text-sm">
        <p>
          <strong>Position:</strong> Row {playerPosition.row}, Col {playerPosition.col}
        </p>
        <p>
          <strong>Dice Roll:</strong> {diceRoll > 0 ? diceRoll : 'Not rolled'}
        </p>
        <p>
          <strong>Reachable Tiles:</strong> {reachableTiles.length}
        </p>
      </div>

      {/* Buttons */}
      <div className="space-y-2 mb-4">
        <button
          onClick={handleRollDice}
          disabled={loading}
          className="w-full py-2 bg-[#583927] text-white rounded font-semibold hover:bg-[#3d2819] disabled:opacity-50"
        >
          🎲 Roll Dice
        </button>

        <button
          onClick={handleReset}
          className="w-full py-2 bg-gray-400 text-white rounded font-semibold hover:bg-gray-500"
        >
          🔄 Reset
        </button>
      </div>

      {/* Reachable Tiles */}
      {reachableTiles.length > 0 && (
        <div className="mb-4">
          <p className="font-semibold text-sm text-[#583927] mb-2">
            Click a tile to move (max {diceRoll} spaces):
          </p>
          <div className="grid grid-cols-3 gap-2 max-h-40 overflow-y-auto">
            {reachableTiles.map((tile, idx) => (
              <button
                key={idx}
                onClick={() => handleMove(tile.row, tile.col)}
                className="p-2 bg-green-300 text-xs rounded hover:bg-green-400 font-semibold"
              >
                ({tile.row}, {tile.col})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Move History */}
      {moveHistory.length > 0 && (
        <div className="bg-blue-50 p-3 rounded text-xs max-h-32 overflow-y-auto">
          <p className="font-semibold text-[#583927] mb-2">📝 Move History:</p>
          {moveHistory.map((move, idx) => (
            <div key={idx} className="text-gray-700 mb-1">
              {idx + 1}. Rolled {move.diceRoll} → ({move.to.row}, {move.to.col}) [{move.tileType}]
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
