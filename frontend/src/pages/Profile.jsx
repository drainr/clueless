import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authAPI } from '../utils/api'
import api from '../utils/api'

export default function Profile() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get(`/user/${user.id}/stats`)
        setStats(res.data.stats)
      } catch (err) {
        console.error('Failed to fetch stats', err)
      } finally {
        setLoading(false)
      }
    }

    if (user?.id) fetchStats()
  }, [user])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const statCards = [
    { label: 'Games Played', value: stats?.gamesPlayed ?? 0 },
    { label: 'Games Won',    value: stats?.gamesWon    ?? 0 },
    { label: 'Games Lost',   value: stats?.gamesLost   ?? 0 },
    { label: 'Correct Accusations', value: stats?.correctGuesses ?? 0 },
  ]

  return (
    <div style={{
      maxWidth: '600px', margin: '2rem auto', padding: '0 1rem',
      fontFamily: 'Inter, sans-serif'
    }}>

      {/* Header card */}
      <div style={{
        background: '#fff', border: '2px solid #7A5C46',
        borderRadius: '16px', padding: '32px',
        boxShadow: '3px 4px 0px #D9B86A', marginBottom: '20px',
        display: 'flex', alignItems: 'center', gap: '20px'
      }}>
        {/* Avatar placeholder */}
        <div style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: '#F5E8D3', border: '2px solid #7A5C46',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '28px', flexShrink: 0
        }}>
          👤
        </div>

        <div style={{ flex: 1 }}>
          <h1 style={{
            margin: '0 0 4px', fontSize: '1.6rem', fontWeight: 800,
            color: '#3D2B1F', fontFamily: 'Cormorant Garamond, serif'
          }}>
            {user?.username}
          </h1>
          <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#8c6f61' }}>
            {user?.email}
          </p>
          <span style={{
            display: 'inline-block', padding: '2px 10px',
            background: '#F5E8D3', border: '1px solid #D9B86A',
            borderRadius: '20px', fontSize: '11px',
            fontWeight: 700, color: '#7A5C46', textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            {user?.role === 'admin' ? '🛡️ Admin' : '🎲 Player'}
          </span>
        </div>
      </div>

      {/* Stats grid */}
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '12px', marginBottom: '20px'
      }}>
        {loading ? (
          <p style={{ color: '#8c6f61', gridColumn: 'span 2' }}>Loading stats...</p>
        ) : (
          statCards.map((s) => (
            <div key={s.label} style={{
              background: '#fff', border: '2px solid #7A5C46',
              borderRadius: '12px', padding: '20px',
              boxShadow: '2px 3px 0px #D9B86A', textAlign: 'center'
            }}>
              <p style={{
                margin: '0 0 6px', fontSize: '2rem', fontWeight: 900,
                color: '#A44A3F'
              }}>
                {s.value}
              </p>
              <p style={{
                margin: 0, fontSize: '11px', fontWeight: 700,
                color: '#7A5C46', textTransform: 'uppercase',
                letterSpacing: '0.06em'
              }}>
                {s.label}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Win rate bar */}
      {!loading && stats && stats.gamesPlayed > 0 && (
        <div style={{
          background: '#fff', border: '2px solid #7A5C46',
          borderRadius: '12px', padding: '20px',
          boxShadow: '2px 3px 0px #D9B86A', marginBottom: '20px'
        }}>
          <p style={{
            margin: '0 0 10px', fontSize: '11px', fontWeight: 700,
            color: '#7A5C46', textTransform: 'uppercase', letterSpacing: '0.06em'
          }}>
            Win Rate
          </p>
          <div style={{
            background: '#F5E8D3', borderRadius: '6px',
            height: '12px', overflow: 'hidden', marginBottom: '6px'
          }}>
            <div style={{
              height: '100%', borderRadius: '6px',
              background: '#9CAF88',
              width: `${Math.round((stats.gamesWon / stats.gamesPlayed) * 100)}%`,
              transition: 'width 0.4s ease'
            }} />
          </div>
          <p style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#3D2B1F' }}>
            {Math.round((stats.gamesWon / stats.gamesPlayed) * 100)}%
          </p>
        </div>
      )}

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          width: '100%', padding: '14px',
          background: '#A44A3F', color: '#F5E8D3',
          border: 'none', borderRadius: '10px',
          fontWeight: 800, fontSize: '15px',
          cursor: 'pointer', boxShadow: '3px 3px 0px #D9B86A',
          transition: 'opacity 0.15s ease'
        }}
        onMouseOver={(e) => e.target.style.opacity = '0.85'}
        onMouseOut={(e)  => e.target.style.opacity = '1'}
      >
        Log Out
      </button>
    </div>
  )
}