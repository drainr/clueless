import { useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { useParams } from "react-router-dom";
import { GiInvertedDice1, GiInvertedDice2, GiInvertedDice3,
         GiInvertedDice4, GiInvertedDice5, GiInvertedDice6 } from "react-icons/gi";

const diceFaces = {
  1: <GiInvertedDice1 />,
  2: <GiInvertedDice2 />,
  3: <GiInvertedDice3 />,
  4: <GiInvertedDice4 />,
  5: <GiInvertedDice5 />,
  6: <GiInvertedDice6 />,
};

export default function DiceRoller({ isMyTurn, turnPhase, onRolled }) {
  const socket       = useSocket();
  const { roomCode } = useParams();
  const [rolling, setRolling]       = useState(false);
  const [result, setResult]         = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);

  const canRoll = isMyTurn && turnPhase === "roll" && !rolling;

  function handleRoll() {
    if (!canRoll || !socket) return;

    setShowOverlay(true);
    setRolling(true);
    setResult(null);

    // Listen for the server's response
    socket.once("dice_rolled", ({ die1, die2, roll, reachableTiles }) => {
      console.log('DiceRoller got dice_rolled:', roll, 'tiles:', reachableTiles?.length)
      setTimeout(() => {
        setResult(die1 + die2);
        setRolling(false);
        if (onRolled) onRolled({ die1, die2, roll, reachableTiles });
        setTimeout(() => setShowOverlay(false), 800);
      }, 1200);
    });

    socket.emit("roll_dice", { roomCode });
  }

  return (
    <>
      <button
        onClick={handleRoll}
        disabled={!canRoll}
        className="w-full rounded-xl px-4 py-3 font-bold text-white shadow-lg transition cursor-pointer"
        style={{
          background: canRoll ? "#6C8AA6" : "#b0bec5",
          opacity: canRoll ? 1 : 0.6,
        }}
      >
        Roll Dice
      </button>

      {showOverlay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
          <div className="text-center">
            <div className={`text-8xl text-white ${rolling ? "animate-bounce" : ""}`}>
              {rolling ? "🎲" : diceFaces[result]}
            </div>
            <p className="mt-6 text-2xl font-bold text-white">
              {rolling ? "Rolling..." : `You rolled a ${result}!`}
            </p>
          </div>
        </div>
      )}
    </>
  );
}