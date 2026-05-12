import React from 'react';
import DiceRoller from "./DiceRoller.jsx";

const RightSideBar = ({ onLeave, players = [], myHand = [], myCharacter, isMyTurn, turnPhase }) => {
  return (
    <div className="h-full">
      <aside className="w-[260px] h-full bg-[#F5E8D3] border-l-2 border-[#7A5C46] p-4 overflow-auto flex flex-col">

        <h2 className="text-4xl text-[#7A5C46] mb-1 font-cormorant font-extrabold">
          Game Actions
        </h2>

        {/* Turn indicator */}
        {isMyTurn !== undefined && (
          <div
            className="mb-3 px-3 py-1 rounded-lg text-sm font-bold text-center"
            style={{
              background: isMyTurn ? "#9CAF88" : "#d8c6b4",
              color: isMyTurn ? "#fff" : "#7A5C46",
            }}
          >
            {isMyTurn ? "Your Turn!" : "Waiting..."}
          </div>
        )}

        <div className="space-y-3">
          <DiceRoller />

          <button
            className="w-full rounded-xl bg-[#9CAF88] px-4 py-3 font-bold text-white shadow-lg transition hover:opacity-70 cursor-pointer"
            disabled={!isMyTurn || turnPhase !== 'action'}
            style={{ opacity: isMyTurn && turnPhase === 'action' ? 1 : 0.5 }}
          >
            Interrogate
          </button>

          <button
            className="w-full rounded-xl bg-[#D9B86A] px-4 py-3 font-bold text-white shadow-lg transition hover:opacity-70 cursor-pointer"
            disabled={!isMyTurn}
            style={{ opacity: isMyTurn ? 1 : 0.5 }}
          >
            Accuse
          </button>
        </div>

        {/* My character */}
        {myCharacter && (
          <div className="mt-4">
            <h3 className="text-lg font-extrabold font-cormorant text-[#7A5C46] mb-1">
              You are
            </h3>
            <div
              className="px-3 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "#fff", border: "1px solid #d8c6b4", color: "#3D2B1F" }}
            >
              {myCharacter}
            </div>
          </div>
        )}

        {/* My hand */}
        {myHand.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-extrabold font-cormorant text-[#7A5C46] mb-2">
              Your Cards
            </h3>
            <div className="space-y-1">
              {myHand.map((card, i) => (
                <div
                  key={i}
                  className="px-3 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: "#fff", border: "1px solid #d8c6b4", color: "#3D2B1F" }}
                >
                  {card}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Players */}
        <div className="mt-4">
          <h3 className="text-lg font-extrabold font-cormorant text-[#7A5C46] mb-2">
            Players
          </h3>
          <div className="space-y-2">
            {players.length === 0 ? (
              <p className="text-sm text-[#8c6f61]">No players</p>
            ) : (
              players.map((p, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2 rounded-lg"
                  style={{
                    background: "#fff",
                    border: "1px solid #d8c6b4",
                    opacity: p.isActive === false ? 0.5 : 1,
                  }}
                >
                  <span className="text-sm font-semibold text-[#3D2B1F] flex-1">
                    {p.displayName}
                  </span>
                  {p.isHost && <span className="text-xs">👑</span>}
                  {p.isEliminated && (
                    <span className="text-xs text-[#A44A3F] font-bold">Out</span>
                  )}
                  {p.isActive === false && !p.isEliminated && (
                    <span className="text-xs text-[#8c6f61]">Away</span>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Leave button */}
        <div className="mt-auto pt-4 border-t border-[#d8c6b4]">
          <button
            onClick={onLeave}
            className="w-full rounded-xl bg-[#A44A3F] px-4 py-3 font-bold text-white shadow-lg transition hover:opacity-70 cursor-pointer"
          >
            Leave Game
          </button>
        </div>
      </aside>
    </div>
  );
};

export default RightSideBar;