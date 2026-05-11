import { useEffect, useState } from 'react'
import api from '../utils/api'

export default function Leaderboard() {
  const [players, setPlayers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await api.get('/user/leaderboard')
        setPlayers(res.data)
      } catch (err) {
        setError('Failed to load leaderboard.')
      } finally {
        setLoading(false)
      }
    }
    fetchLeaderboard()
  }, [])

  const medals = ['🥇', '🥈', '🥉']

  if (loading) return (
    <div style={{ padding: '2rem', color: '#8c6f61' }}>Loading leaderboard...</div>
  )

  if (error) return (
    <div style={{ padding: '2rem', color: '#A44A3F', fontWeight: 600 }}>{error}</div>
  )

  return (
    <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '0 1rem' }}>

      <h1 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '2rem', fontWeight: 900,
        color: '#3D2B1F', margin: '0 0 6px'
      }}>
        Leaderboard
      </h1>
      <p style={{ color: '#8c6f61', fontSize: '13px', margin: '0 0 20px' }}>
        Top detectives ranked by games won
      </p>

      {players.length === 0 ? (
        <div style={{
          background: '#fff', border: '2px solid #7A5C46',
          borderRadius: '12px', padding: '40px',
          textAlign: 'center', color: '#8c6f61',
          boxShadow: '3px 3px 0px #D9B86A'
        }}>
          No games played yet — be the first to win!
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {players.map((player, index) => (
            <div
              key={player._id}
              style={{
                background: index < 3 ? '#fff' : '#fffdf8',
                border: `2px solid ${index === 0 ? '#D9B86A' : index === 1 ? '#A8A8A8' : index === 2 ? '#CD7F32' : '#d8c6b4'}`,
                borderRadius: '12px',
                padding: '16px 20px',
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                boxShadow: index < 3 ? '3px 3px 0px #D9B86A' : '2px 2px 0px #e8d9c8',
              }}
            >
              {/* Rank */}
              <div style={{
                width: '36px', textAlign: 'center',
                fontSize: index < 3 ? '1.5rem' : '1rem',
                fontWeight: 900,
                color: index < 3 ? 'inherit' : '#8c6f61',
                flexShrink: 0
              }}>
                {index < 3 ? medals[index] : `#${index + 1}`}
              </div>

              {/* Avatar */}
              <div style={{
                width: '40px', height: '40px', borderRadius: '50%',
                background: '#F5E8D3', border: '2px solid #7A5C46',
                display: 'flex', alignItems: 'center',
                justifyContent: 'center', fontSize: '18px', flexShrink: 0
              }}>
                👤
              </div>

              {/* Username */}
              <span style={{
                flex: 1, fontWeight: 700,
                fontSize: '15px', color: '#3D2B1F'
              }}>
                {player.username}
              </span>

              {/* Wins */}
              <div style={{ textAlign: 'right' }}>
                <p style={{
                  margin: 0, fontSize: '1.4rem',
                  fontWeight: 900, color: '#A44A3F'
                }}>
                  {player.stats.gamesWon}
                </p>
                <p style={{
                  margin: 0, fontSize: '11px',
                  color: '#8c6f61', fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.05em'
                }}>
                  wins
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}