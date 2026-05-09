import "./navbar.css";
import { useNavigate, useLocation } from 'react-router-dom'

const TABS = [
  { label: 'Boards',      path: '/dashboard' },
  { label: 'Friends',     path: '/friends' },
  { label: '',            path: null },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Rules',       path: '/rules' },
]

export default function Navbar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <header className="clueless-navbar">
      <div className="clueless-brand">
        <h1>Clueless</h1>
        <p>Murder Mystery Game</p>
      </div>
      <nav className="clueless-nav-links">
        {TABS.map((tab) => {
          if (!tab.path) return <span key="empty" className="nav-spacer" />
          return (
            <button
              key={tab.label}
              onClick={() => navigate(tab.path)}
              className={location.pathname === tab.path ? 'active' : ''}
            >
              {tab.label}
            </button>
          )
        })}
      </nav>
    </header>
  )
}