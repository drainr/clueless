import { useState } from "react";
import { GiInvertedDice1 } from "react-icons/gi";
import { GiInvertedDice2 } from "react-icons/gi";
import { GiInvertedDice3 } from "react-icons/gi";
import { GiInvertedDice4 } from "react-icons/gi";
import { GiInvertedDice5 } from "react-icons/gi";
import { GiInvertedDice6 } from "react-icons/gi";

export default function DiceRoller() {
    const [rolling, setRolling] = useState(false);
    const [result, setResult] = useState(null);
    const [showOverlay, setShowOverlay] = useState(false);

    function rollDice() {
        setShowOverlay(true);
        setRolling(true);
        setResult(null);

        setTimeout(() => {
            const randomNumber = Math.floor(Math.random() * 6) + 1;
            setResult(randomNumber);
            setRolling(false);
        }, 1200);

        // after the animation, call backend to get reachable tiles and dispatch global event
        setTimeout(async () => {
            try {
                const resp = await fetch('/api/game/test/roll-dice', { method: 'POST' });
                const data = await resp.json();
                // dispatch event for board to pick up
                window.dispatchEvent(new CustomEvent('diceRolled', { detail: data }));
            } catch (err) {
                console.error('Failed to roll dice on backend:', err);
            } finally {
                setShowOverlay(false);
            }
        }, 2200);
    }

    const diceFaces = {
        1: <GiInvertedDice1 />,
        2: <GiInvertedDice2 />,
        3: <GiInvertedDice3 />,
        4: <GiInvertedDice4 />,
        5: <GiInvertedDice5 />,
        6: <GiInvertedDice6 />,
    };

    return (
        <>
            <button
                onClick={rollDice}
                className="w-full rounded-xl bg-[#FAF3E8] px-4 py-3 font-bold text-black shadow-lg transition hover:bg-[#FFFFFF]"
            >
                Roll Dice
            </button>

            {showOverlay && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
                    <div className="text-center">
                        <div
                            className={`text-8xl text-white ${
                                rolling ? "animate-diceRoll" : "animate-diceStop"
                            }`}
                        >
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