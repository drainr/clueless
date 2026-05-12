import { useState, useEffect, useRef } from 'react';
import boardData from '../../shared/boardLayout.json';

import scarlett from '../assets/classic/characters/miss-scarlett.png';
import mustard  from '../assets/classic/characters/colonel-mustard.png';
import white    from '../assets/classic/characters/mrs-white.png';
import green    from '../assets/classic/characters/reverend-green.png';
import peacock  from '../assets/classic/characters/mrs-peacock.png';
import plum     from '../assets/classic/characters/professor-plum.png';

const CHARACTER_IMAGES = {
  'Miss Scarlett':    scarlett,
  'Colonel Mustard':  mustard,
  'Mrs. White':       white,
  'Reverend Green':   green,
  'Mrs. Peacock':     peacock,
  'Professor Plum':   plum,
};

const { BOARD_SIZE, ROOMS: rooms } = boardData;

function getRoomAt(row, col) {
  return rooms.find(
    (r) => row >= r.row && row < r.row + r.height && col >= r.col && col < r.col + r.width
  );
}

function isDoor(row, col) {
  return rooms.some((r) => r.door.row === row && r.door.col === col);
}

export default function ClueBoard({ tileSize = 38, players = [], myCharacter, isMyTurn, turnPhase, onMove, reachableTiles = [] }) {
  const reachableSet    = new Set(reachableTiles.map((t) => `${t.row},${t.col}`));
  const canMove         = isMyTurn && turnPhase === "move";

  // Find my position from players array
  const myPlayer     = players.find((p) => p.character === myCharacter);
  const myPosition   = myPlayer?.position ?? { row: 7, col: 7 };

  const handleTileClick = (row, col) => {
    if (!canMove) return;
    const key = `${row},${col}`;
    if (!reachableSet.has(key)) return;
    if (onMove) onMove({ row, col });
  };

  function renderTile(row, col) {
    const room        = getRoomAt(row, col);
    const door        = isDoor(row, col);
    const isReachable = reachableSet.has(`${row},${col}`) && canMove;

    // Find all players on this tile
    const playersHere = players.filter(
      (p) => p.position?.row === row && p.position?.col === col
    );

    const tileContent = (
      <>
        {room && (
          (() => {
            const isRoomLabel =
              row === room.row + Math.floor(room.height / 2) &&
              col === room.col + Math.floor(room.width / 2);
            return isRoomLabel ? (
              <span className="flex items-center justify-center text-[9px] font-black uppercase text-[#6B4F3F]">
                {room.name}
              </span>
            ) : null;
          })()
        )}

        {/* Player tokens */}
        {playersHere.map((p, i) => (
          <div
            key={p.character}
            className="absolute"
            style={{
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transform: `translate(${i * 6}px, ${i * 6}px)`,
              zIndex: 10 + i,
            }}
          >
            <img
              src={CHARACTER_IMAGES[p.character] ?? white}
              alt={p.character}
              className="w-7 h-7 rounded-full border-2"
              style={{ borderColor: p.character === myCharacter ? '#D9B86A' : '#7A5C46' }}
              title={p.displayName}
            />
          </div>
        ))}

        {/* Reachable highlight */}
        {isReachable && playersHere.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-3 h-3 bg-green-300 rounded opacity-90" />
          </div>
        )}
      </>
    );

    if (room) {
      return (
        <div
          key={`${row}-${col}`}
          onClick={() => handleTileClick(row, col)}
          className={`relative border border-white/80 ${room.color} ${isReachable ? 'cursor-pointer ring-1 ring-green-400' : ''}`}
          style={{ height: tileSize, width: tileSize }}
        >
          {tileContent}
        </div>
      );
    }

    return (
      <div
        key={`${row}-${col}`}
        onClick={() => handleTileClick(row, col)}
        className={`relative border border-[#D6CCC2] ${door ? 'bg-[#EAD7BB]' : 'bg-[#FFF8EF]'} ${isReachable ? 'cursor-pointer ring-1 ring-green-400' : ''}`}
        style={{ height: tileSize, width: tileSize }}
      >
        {door && (
          <span className="flex h-full w-full items-center justify-center text-xs text-[#A98467]">◆</span>
        )}
        {tileContent}
      </div>
    );
  }

  return (
    <div
      className="mx-auto grid w-max overflow-hidden border-8 border-[#DDBEA9] bg-[#DDBEA9] shadow-xl relative"
      style={{
        gridTemplateColumns: `repeat(${BOARD_SIZE}, ${tileSize}px)`,
        gridTemplateRows:    `repeat(${BOARD_SIZE}, ${tileSize}px)`,
      }}
    >
      {Array.from({ length: BOARD_SIZE }).map((_, row) =>
        Array.from({ length: BOARD_SIZE }).map((_, col) => renderTile(row, col))
      )}
    </div>
  );
}