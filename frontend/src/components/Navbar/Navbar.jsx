import "./navbar.css";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/Clueless_Favicon.png";

const TABS = [
  { label: "Boards", path: "/dashboard/boards" },
  { label: "Friends", path: "/dashboard/friends" },
  { label: "Leaderboard", path: "/dashboard/leaderboard" },
  { label: "Rules", path: "/dashboard/rules" },
  { label: "Profile", path: "/dashboard/profile" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="clueless-navbar">
      <div className="clueless-brand">
        <img src={logo} alt="Clueless logo" className="clueless-logo" />
        <div className="clueless-brand-text">
          <h1>Clueless</h1>
          <p>Murder Mystery Game</p>
        </div>
      </div>
      <nav className="clueless-nav-links">
        {TABS.map((tab) => {
          if (!tab.path) return <span key="empty" className="nav-spacer" />;
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={location.pathname === tab.path ? "active" : ""}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
