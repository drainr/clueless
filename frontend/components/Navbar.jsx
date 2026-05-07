import { useState } from "react";
import "./navbar.css";

const TABS = ["Boards", "Friends", "empty space", "Leaderboard", "Rules"];

export default function Navbar() {
    const [active, setActive] = useState("Boards");

    return (
        <header className="clueless-navbar">
            <div className="clueless-brand">
                <h1>Clueless</h1>
                <p>Murder Mystery Game</p>
            </div>

            <nav className="clueless-nav-links">
                {TABS.map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActive(tab)}
                        className={active === tab ? "active" : ""}
                    >
                        {tab}
                    </button>
                ))}
            </nav>
        </header>
    );
}