import React from 'react';
import DiceRoller from "./DiceRoller.jsx";

const RightSideBar = () => {
    return (
        <div>
            {/* RIGHT FIXED SIDEBAR */}
            <aside className="w-[260px] h-full bg-[#ffffff] border-l border-[#583927] p-4 overflow-auto">
                <h2 className="text-4xl text-[#583927] mb-4 font-cormorant font-extrabold">
                    Game Actions
                </h2>

                <div className="space-y-4">
                    <div className="p-2 rounded-xl bg-white text-center">
                        <DiceRoller />
                    </div>

                    <button className="w-full p-3 rounded-xl bg-[#BB616D] text-white font-semibold">
                        Interrogate
                    </button>

                    <button className="w-full p-3 rounded-xl bg-[#583927] text-white font-semibold">
                        Accuse
                    </button>

                </div>
            </aside>

        </div>
    );
};

export default RightSideBar;