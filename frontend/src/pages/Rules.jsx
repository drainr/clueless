import React from "react";
import Navbar from "../components/Navbar";

const Rules = () => {
    return (
        <div className="min-h-screen bg-[#fffaf3] text-[#4b2e24]">
            <Navbar />

            <main className="max-w-5xl mx-auto px-6 py-12">
                <section className="bg-white/70 rounded-3xl shadow-lg p-8 border border-[#d6c1a8]">
                    <h1 className="text-5xl font-bold mb-4 text-center">
                        How to Play Clue
                    </h1>

                    <p className="text-lg text-center mb-10">
                        Welcome to our Clue-inspired mystery game! Your goal is to figure
                        out who committed the crime, which weapon was used, and where it
                        happened.
                    </p>

                    <div className="grid md:grid-cols-2 gap-6">
                        <RuleCard
                            title="Objective"
                            text="Be the first player to correctly solve the mystery by identifying the suspect, weapon, and room."
                        />

                        <RuleCard
                            title="Players"
                            text="The game is designed for 3–5 players. Each player chooses a character and moves around the board."
                        />

                        <RuleCard
                            title="The Secret Envelope"
                            text="At the start of the game, one suspect, one weapon, and one room are secretly chosen as the solution."
                        />

                        <RuleCard
                            title="Player Cards"
                            text="The remaining cards are dealt to the players. These cards help prove what is not part of the solution."
                        />

                        <RuleCard
                            title="Moving Around"
                            text="Players roll the dice and move across the board. To make a suggestion, you must enter a room."
                        />

                        <RuleCard
                            title="Interrogation"
                            text="When inside a room, you can suggest a suspect, weapon, and that room. Other players try to disprove your suggestion."
                        />

                        <RuleCard
                            title="Taking Notes"
                            text="Use your notes to track which cards you have seen and narrow down the possible solution."
                        />

                        <RuleCard
                            title="Accusation"
                            text="When you think you know the answer, make an accusation. If correct, you win. If wrong, you are out."
                        />
                    </div>

                    <div className="mt-10 bg-[#ead7bd] rounded-2xl p-6">
                        <h2 className="text-2xl font-bold mb-3">Winning the Game</h2>
                        <p className="text-lg">
                            The winner is the first player to correctly accuse the right
                            suspect, weapon, and location. Think carefully before accusing,
                            because one wrong accusation can cost you the game!
                        </p>
                    </div>
                </section>
            </main>
        </div>
    );
};

const RuleCard = ({ title, text }) => {
    return (
        <div className="bg-[#fff8ef] rounded-2xl p-6 shadow-md border border-[#dbc5aa] hover:scale-[1.02] transition-transform">
            <h2 className="text-2xl font-bold mb-3">{title}</h2>
            <p className="text-base leading-relaxed">{text}</p>
        </div>
    );
};

export default Rules;