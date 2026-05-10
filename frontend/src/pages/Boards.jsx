import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { roomAPI } from '../utils/api'
import { useSocket } from '../hooks/useSocket'
import Cards from '../components/Cards'

export default function Boards() {
  const { user } = useAuth()
  const socket = useSocket()
  const navigate = useNavigate()
  const [joinCode, setJoinCode] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleCreateGame = async () => {
    setError(null)
    setLoading(true)
    try {
      const res = await roomAPI.create(user.username, socket?.id)
      navigate(`/lobby/${res.data.code}`)
    } catch (err) {
      setError('Failed to create game. Try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinGame = async () => {
    if (!joinCode.trim()) return
    setError(null)
    setLoading(true)
    try {
      await roomAPI.getByCode(joinCode.trim().toUpperCase())
      navigate(`/lobby/${joinCode.trim().toUpperCase()}`)
    } catch (err) {
      setError('Room not found. Check the code and try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="m-5">
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button
          onClick={handleCreateGame}
          disabled={loading}
          style={{
            padding: '10px 24px', background: '#A44A3F', color: '#F5E8D3',
            border: 'none', borderRadius: '8px', fontWeight: 700,
            cursor: 'pointer', fontSize: '14px',
            boxShadow: '2px 2px 0px #D9B86A'
          }}
        >
          + Create Game
        </button>

        <input
          type="text"
          placeholder="Enter room code"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
          maxLength={6}
          style={{
            padding: '10px 14px', border: '2px solid #7A5C46',
            borderRadius: '8px', fontSize: '14px', width: '160px',
            fontWeight: 600, letterSpacing: '0.1em',
            background: '#fffdf8', color: '#3D2B1F'
          }}
        />
        <button
          onClick={handleJoinGame}
          disabled={loading || !joinCode.trim()}
          style={{
            padding: '10px 24px', background: '#7A5C46', color: '#F5E8D3',
            border: 'none', borderRadius: '8px', fontWeight: 700,
            cursor: 'pointer', fontSize: '14px',
            boxShadow: '2px 2px 0px #D9B86A'
          }}
        >
          Join Game
        </button>
      </div>

      {error && (
        <p style={{ color: '#A44A3F', fontWeight: 600, marginBottom: '16px' }}>
          {error}
        </p>
      )}

      <Cards />
    </div>
  )
}