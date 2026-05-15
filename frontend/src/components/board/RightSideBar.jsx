import { useState } from 'react';
import DiceRoller from "./DiceRoller.jsx";

const CHARACTERS = ["Miss Scarlett", "Colonel Mustard", "Mrs. White", "Reverend Green", "Mrs. Peacock", "Professor Plum"];
const WEAPONS = ["Candlestick", "Knife", "Lead Pipe", "Revolver", "Rope", "Wrench"];

export default function RightSideBar({
  onLeave, onEndTurn, onSuggestion, onAccusation,
  players = [], myHand = [], myCharacter,
  isMyTurn, turnPhase, inRoom,
}) {
  const [showSuggest, setShowSuggest] = useState(false);
  const [showAccuse, setShowAccuse] = useState(false);
  const [suspect, setSuspect] = useState('');
  const [weapon, setWeapon] = useState('');
  const [accuseRoom, setAccuseRoom] = useState('');

  const canInterrogate = isMyTurn && turnPhase === 'action' && inRoom && inRoom !== 'Accusation Room';
  const canAccuse = isMyTurn && inRoom === 'Accusation Room';
  const canEndTurn = isMyTurn && (turnPhase === 'action' || turnPhase === 'end_turn');

  const submitSuggestion = () => {
    if (!suspect || !weapon) return;
    onSuggestion(suspect, weapon);
    setShowSuggest(false);
    setSuspect('');
    setWeapon('');
  };

  const submitAccusation = () => {
    if (!suspect || !weapon || !accuseRoom) return;
    onAccusation(suspect, weapon, accuseRoom);
    setShowAccuse(false);
    setSuspect('');
    setWeapon('');
    setAccuseRoom('');
  };

  const selectStyle = {
    width: '100%', padding: '8px', borderRadius: '6px',
    border: '1px solid #d8c6b4', background: '#fffdf8',
    color: '#3D2B1F', fontWeight: 600, fontSize: '13px', marginTop: '6px',
  };

  return (
    <>
      <div className="h-full">
        <aside className="w-[260px] h-full bg-[#F5E8D3] border-l-2 border-[#7A5C46] p-4 overflow-auto flex flex-col">

          <h2 className="text-4xl text-[#7A5C46] mb-1 font-cormorant font-extrabold">
            Game Actions
          </h2>

          {/* Turn indicator */}
          <div className="mb-3 px-3 py-1 rounded-lg text-sm font-bold text-center"
            style={{
              background: isMyTurn ? '#9CAF88' : '#d8c6b4',
              color: isMyTurn ? '#fff' : '#7A5C46',
            }}>
            {isMyTurn
              ? turnPhase === 'roll' ? '🎲 Roll your dice!'
                : turnPhase === 'move' ? '👣 Choose a tile'
                  : turnPhase === 'action' ? '🔎 Interrogate or end turn'
                    : turnPhase === 'end_turn' ? '✅ End your turn'
                      : 'Your turn'
              : `Waiting for ${players[0]?.displayName ?? '...'}`}
          </div>

          <div className="space-y-3">
            <DiceRoller isMyTurn={isMyTurn} turnPhase={turnPhase} />

            <button
              onClick={() => setShowSuggest(true)}
              disabled={!canInterrogate}
              className="w-full rounded-xl px-4 py-3 font-bold text-white shadow-lg transition cursor-pointer"
              style={{ background: canInterrogate ? '#9CAF88' : '#b0bec5', opacity: canInterrogate ? 1 : 0.5 }}
            >
              Interrogate
            </button>

            <button
              onClick={() => setShowAccuse(true)}
              disabled={!canAccuse}
              className="w-full rounded-xl px-4 py-3 font-bold text-white shadow-lg transition cursor-pointer"
              style={{ background: canAccuse ? '#D9B86A' : '#b0bec5', opacity: canAccuse ? 1 : 0.5 }}
            >
              Accuse
            </button>

            {canEndTurn && (
              <button
                onClick={onEndTurn}
                className="w-full rounded-xl px-4 py-3 font-bold text-white shadow-lg transition cursor-pointer"
                style={{ background: '#7A5C46' }}
              >
                End Turn
              </button>
            )}
          </div>

          {/* Current room */}
          {inRoom && (
            <div className="mt-3 px-3 py-2 rounded-lg text-sm font-semibold text-center"
              style={{ background: '#fff', border: '1px solid #d8c6b4', color: '#7A5C46' }}>
              📍 {inRoom}
            </div>
          )}

          {/* My character */}
          {myCharacter && (
            <div className="mt-4">
              <h3 className="text-base font-extrabold font-cormorant text-[#7A5C46] mb-1">You are</h3>
              <div className="px-3 py-2 rounded-lg text-sm font-semibold"
                style={{ background: '#fff', border: '1px solid #d8c6b4', color: '#3D2B1F' }}>
                {myCharacter}
              </div>
            </div>
          )}

          {/* My hand */}
          {myHand.length > 0 && (
            <div className="mt-4">
              <h3 className="text-base font-extrabold font-cormorant text-[#7A5C46] mb-2">Your Cards</h3>
              <div className="space-y-1">
                {myHand.map((card, i) => (
                  <div key={i} className="px-3 py-2 rounded-lg text-sm font-semibold"
                    style={{ background: '#fff', border: '1px solid #d8c6b4', color: '#3D2B1F' }}>
                    {card}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Players */}
          <div className="mt-4">
            <h3 className="text-base font-extrabold font-cormorant text-[#7A5C46] mb-2">Players</h3>
            <div className="space-y-2">
              {players.length === 0 ? (
                <p className="text-sm text-[#8c6f61]">No players</p>
              ) : (
                players.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 rounded-lg"
                    style={{
                      background: i === players.indexOf(players.find(pl => pl.displayName === p.displayName)) && turnPhase !== 'roll'
                        ? '#fdf6ec' : '#fff',
                      border: `1px solid ${p.isEliminated ? '#A44A3F' : '#d8c6b4'}`,
                      opacity: p.isActive === false ? 0.5 : 1,
                    }}>
                    <span className="text-sm font-semibold text-[#3D2B1F] flex-1">{p.displayName}</span>
                    {p.isHost && <span className="text-xs">👑</span>}
                    {p.isEliminated && <span className="text-xs text-[#A44A3F] font-bold">Out</span>}
                    {p.isActive === false && !p.isEliminated && <span className="text-xs text-[#8c6f61]">Away</span>}
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

      {/* Suggestion modal */}
      {showSuggest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setShowSuggest(false)}>
          <div className="bg-[#F5E8D3] rounded-2xl p-6 w-80 shadow-2xl border-2 border-[#7A5C46]"
            onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-extrabold font-cormorant text-[#7A5C46] mb-1">Interrogate</h2>
            <p className="text-xs text-[#8c6f61] mb-4">Room: <strong>{inRoom}</strong></p>

            <label className="text-xs font-bold text-[#7A5C46]">Suspect</label>
            <select value={suspect} onChange={(e) => setSuspect(e.target.value)} style={selectStyle}>
              <option value="">Select suspect...</option>
              {CHARACTERS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <label className="text-xs font-bold text-[#7A5C46] mt-3 block">Weapon</label>
            <select value={weapon} onChange={(e) => setWeapon(e.target.value)} style={selectStyle}>
              <option value="">Select weapon...</option>
              {WEAPONS.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowSuggest(false)}
                className="flex-1 py-2 rounded-lg font-bold text-[#7A5C46] cursor-pointer"
                style={{ background: '#d8c6b4' }}>
                Cancel
              </button>
              <button onClick={submitSuggestion}
                disabled={!suspect || !weapon}
                className="flex-1 py-2 rounded-lg font-bold text-white cursor-pointer"
                style={{ background: '#9CAF88', opacity: suspect && weapon ? 1 : 0.5 }}>
                Interrogate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Accusation modal */}
      {showAccuse && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          onClick={() => setShowAccuse(false)}>
          <div className="bg-[#F5E8D3] rounded-2xl p-6 w-80 shadow-2xl border-2 border-[#A44A3F]"
            onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-extrabold font-cormorant text-[#A44A3F] mb-1">Make Accusation</h2>
            <p className="text-xs text-[#8c6f61] mb-4">This is your final accusation. Choose carefully!</p>

            <label className="text-xs font-bold text-[#7A5C46]">Suspect</label>
            <select value={suspect} onChange={(e) => setSuspect(e.target.value)} style={selectStyle}>
              <option value="">Select suspect...</option>
              {CHARACTERS.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>

            <label className="text-xs font-bold text-[#7A5C46] mt-3 block">Weapon</label>
            <select value={weapon} onChange={(e) => setWeapon(e.target.value)} style={selectStyle}>
              <option value="">Select weapon...</option>
              {WEAPONS.map((w) => <option key={w} value={w}>{w}</option>)}
            </select>

            <label className="text-xs font-bold text-[#7A5C46] mt-3 block">Room</label>
            <select value={accuseRoom} onChange={(e) => setAccuseRoom(e.target.value)} style={selectStyle}>
              <option value="">Select room...</option>
              {["Study", "Hall", "Lounge", "Library", "Dining Room", "Conservatory", "Ballroom", "Kitchen"].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>

            <div className="flex gap-2 mt-5">
              <button onClick={() => setShowAccuse(false)}
                className="flex-1 py-2 rounded-lg font-bold text-[#7A5C46] cursor-pointer"
                style={{ background: '#d8c6b4' }}>
                Cancel
              </button>
              <button onClick={submitAccusation}
                disabled={!suspect || !weapon || !accuseRoom}
                className="flex-1 py-2 rounded-lg font-bold text-white cursor-pointer"
                style={{ background: '#A44A3F', opacity: suspect && weapon && accuseRoom ? 1 : 0.5 }}>
                Accuse
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}