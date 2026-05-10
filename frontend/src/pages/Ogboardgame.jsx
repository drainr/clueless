import { useState, useEffect, useRef } from 'react';
import boardData from '../../shared/boardLayout.json';

const { BOARD_SIZE, ROOMS: rooms } = boardData;

function getRoomAt(row, col) {
    return rooms.find(
        (room) =>
            row >= room.row &&
            row < room.row + room.height &&
            col >= room.col &&
            col < room.col + room.width
    );
}

function isDoor(row, col) {
    return rooms.some((room) => room.door.row === row && room.door.col === col);
}

export default function ClueBoard({ tileSize = 38 }) {
    const [playerPosition, setPlayerPosition] = useState({ row: 5, col: 7 });
    const [remainingMoves, setRemainingMoves] = useState(0);
    const [reachableSet, setReachableSet] = useState(new Set());
    const remainingMovesRef = useRef(0);
    const reachableSetRef = useRef(new Set());

    // Fetch player position from backend
    useEffect(() => {
        const fetchPlayerStatus = async () => {
            try {
                const response = await fetch('/api/game/test/status');
                const data = await response.json();
                setPlayerPosition(data.status.position);
            } catch (error) {
                console.error('Failed to fetch player status:', error);
            }
        };

        fetchPlayerStatus();
        // Poll for position updates every 500ms
        const interval = setInterval(fetchPlayerStatus, 500);
        return () => clearInterval(interval);
    }, []);

    // keyboard movement handler uses refs so it sees latest dice data
    useEffect(() => {
        const handleKeyDown = async (e) => {
            const key = e.key.toLowerCase();
            let newRow = playerPosition.row;
            let newCol = playerPosition.col;
            let moved = false;

            if (key === 'w' || key === 'arrowup') {
                newRow -= 1; moved = true; e.preventDefault();
            } else if (key === 's' || key === 'arrowdown') {
                newRow += 1; moved = true; e.preventDefault();
            } else if (key === 'a' || key === 'arrowleft') {
                newCol -= 1; moved = true; e.preventDefault();
            } else if (key === 'd' || key === 'arrowright') {
                newCol += 1; moved = true; e.preventDefault();
            } else {
                return;
            }

            const k = `${newRow},${newCol}`;
            if (
                moved &&
                newRow >= 0 && newRow < BOARD_SIZE &&
                newCol >= 0 && newCol < BOARD_SIZE &&
                remainingMovesRef.current > 0 &&
                reachableSetRef.current.has(k)
            ) {
                try {
                    const resp = await fetch('/api/game/test/move', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ row: newRow, col: newCol }),
                    });
                    const data = await resp.json();
                    if (data.success) {
                        setPlayerPosition(data.status.position);
                        // authoritative remaining moves from server
                        if (data.status && typeof data.status.remainingDice === 'number') {
                            setRemainingMoves(data.status.remainingDice);
                        } else {
                            setRemainingMoves((r) => Math.max(0, r - 1));
                        }
                    }
                } catch (err) {
                    console.error('Move failed:', err);
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [playerPosition]);

    // click-to-move handler for tiles
    const handleTileClick = async (row, col) => {
        if (playerPosition.row === row && playerPosition.col === col) return;
        const key = `${row},${col}`;
        if (!reachableSetRef.current.has(key) || remainingMovesRef.current <= 0) return;

        try {
            const resp = await fetch('/api/game/test/move', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ row, col }),
            });
            const data = await resp.json();
            if (data.success) {
                setPlayerPosition(data.status.position);
                if (data.status && typeof data.status.remainingDice === 'number') {
                    setRemainingMoves(data.status.remainingDice);
                } else {
                    setRemainingMoves((r) => Math.max(0, r - 1));
                }
            }
        } catch (err) {
            console.error('Tile move failed:', err);
        }
    };

    // listen for dice roll events
    useEffect(() => {
        const onDice = (e) => {
            const { diceRoll, reachableTiles, remainingDice } = e.detail || {};
            // prefer server-provided remainingDice when available
            setRemainingMoves(typeof remainingDice === 'number' ? remainingDice : (diceRoll || 0));
            const s = new Set((reachableTiles || []).map(t => `${t.row},${t.col}`));
            setReachableSet(s);
        };
        window.addEventListener('diceRolled', onDice);
        return () => window.removeEventListener('diceRolled', onDice);
    }, []);

    // keep refs in sync
    useEffect(() => { remainingMovesRef.current = remainingMoves; }, [remainingMoves]);
    useEffect(() => { reachableSetRef.current = reachableSet; }, [reachableSet]);

    function renderTile(row, col) {
        const room = getRoomAt(row, col);
        const door = isDoor(row, col);
        const isPlayerHere = playerPosition.row === row && playerPosition.col === col;
        const isReachable = reachableSet.has(`${row},${col}`) && remainingMoves > 0;

        if (room) {
            const isRoomLabel =
                row === room.row + Math.floor(room.height / 2) &&
                col === room.col + Math.floor(room.width / 2);

            return (
                <div
                    key={`${row}-${col}`}
                    onClick={() => isReachable ? handleTileClick(row, col) : undefined}
                    role={isReachable ? 'button' : undefined}
                    tabIndex={isReachable ? 0 : -1}
                    className={`relative border border-white/80 ${room.color} ${isReachable && !isPlayerHere ? 'cursor-pointer' : ''} ${isPlayerHere ? 'ring-4 ring-blue-500' : ''}`}
                    style={{ height: tileSize, width: tileSize }}
                >
                    {isRoomLabel && (
                        <span className="flex items-center justify-center text-[9px] font-black uppercase text-[#6B4F3F]">
              {room.name}
            </span>
                    )}
                    {isPlayerHere && (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-6 h-6 bg-green-500 rounded border-2 border-green-700"></div>
                        </div>
                    )}
                    {isReachable && !isPlayerHere && (
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-3 h-3 bg-green-300 rounded opacity-90"></div>
                        </div>
                    )}
                </div>
            );
        }

        return (
            <div
                key={`${row}-${col}`}
                onClick={() => isReachable ? handleTileClick(row, col) : undefined}
                role={isReachable ? 'button' : undefined}
                tabIndex={isReachable ? 0 : -1}
                className={`relative border border-[#D6CCC2] ${
                    door ? "bg-[#EAD7BB]" : "bg-[#FFF8EF]"
                } ${isReachable && !isPlayerHere ? 'cursor-pointer' : ''}`}
                style={{ height: tileSize, width: tileSize }}
            >
                {door && (
                    <span className="flex h-full w-full items-center justify-center text-xs text-[#A98467]">
            ◆
          </span>
                )}
                {isPlayerHere && (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 bg-green-500 rounded border-2 border-green-700"></div>
                    </div>
                )}
                {isReachable && !isPlayerHere && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-3 h-3 bg-green-300 rounded opacity-90"></div>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div
            className="mx-auto grid w-max overflow-hidden border-8 border-[#DDBEA9] bg-[#DDBEA9] shadow-xl"
            style={{
                gridTemplateColumns: `repeat(${BOARD_SIZE}, ${tileSize}px)`,
                gridTemplateRows: `repeat(${BOARD_SIZE}, ${tileSize}px)`,
            }}
            tabIndex={0}
        >
            {remainingMoves > 0 && (
                <div className="absolute left-8 top-8 z-50 bg-green-600 text-white text-sm font-bold px-2 py-1 rounded">
                    Moves: {remainingMoves}
                </div>
            )}
            {Array.from({ length: BOARD_SIZE }).map((_, row) =>
                Array.from({ length: BOARD_SIZE }).map((_, col) => renderTile(row, col))
            )}
        </div>
    );
}