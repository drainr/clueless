import { useEffect, useState } from 'react'
import { friendAPI } from '../utils/api'

export default function FriendsList() {
  const [friends,       setFriends]       = useState([])
  const [requests,      setRequests]      = useState([])
  const [searchQuery,   setSearchQuery]   = useState('')
  const [searchError,   setSearchError]   = useState(null)
  const [searchSuccess, setSearchSuccess] = useState(null)
  const [loading,       setLoading]       = useState(true)

  const load = async () => {
    try {
      const [fRes, rRes] = await Promise.all([
        friendAPI.getFriends(),
        friendAPI.getRequests(),
      ])
      setFriends(fRes.data)
      setRequests(rRes.data)
    } catch (err) {
      console.error('Failed to load friends', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    const interval = setInterval(() => {
      friendAPI.getRequests().then((r) => setRequests(r.data)).catch(() => {})
    }, 30000)
    return () => clearInterval(interval)
  }, [])

  const handleSendRequest = async () => {
    if (!searchQuery.trim()) return
    setSearchError(null)
    setSearchSuccess(null)
    try {
      await friendAPI.sendRequest(searchQuery.trim())
      setSearchSuccess(`Friend request sent to ${searchQuery}!`)
      setSearchQuery('')
    } catch (err) {
      setSearchError(err.response?.data?.message ?? 'Failed to send request')
    }
  }

  const handleAccept = async (userId) => {
    try {
      await friendAPI.acceptRequest(userId)
      await load()
    } catch (err) {
      console.error(err)
    }
  }

  const handleDecline = async (userId) => {
    try {
      await friendAPI.declineRequest(userId)
      setRequests((prev) => prev.filter((r) => r.from !== userId))
    } catch (err) {
      console.error(err)
    }
  }

  const handleRemove = async (userId) => {
    if (!confirm('Remove this friend?')) return
    try {
      await friendAPI.removeFriend(userId)
      setFriends((prev) => prev.filter((f) => f._id !== userId))
    } catch (err) {
      console.error(err)
    }
  }

  const cardStyle = {
    background: '#fff', border: '2px solid #7A5C46',
    borderRadius: '12px', padding: '20px',
    boxShadow: '3px 3px 0px #D9B86A', marginBottom: '20px',
  }

  const inputStyle = {
    padding: '10px 14px', border: '2px solid #7A5C46',
    borderRadius: '8px', fontSize: '14px', fontWeight: 600,
    background: '#fffdf8', color: '#3D2B1F', outline: 'none',
  }

  const btnStyle = (color, textColor = '#F5E8D3') => ({
    padding: '8px 16px', background: color, color: textColor,
    border: 'none', borderRadius: '8px', fontWeight: 700,
    fontSize: '13px', cursor: 'pointer',
  })

  if (loading) return <div style={{ padding: '2rem', color: '#8c6f61' }}>Loading...</div>

  return (
    <div style={{ maxWidth: '640px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: '#3D2B1F', margin: '0 0 6px' }}>
        Friends
      </h1>
      <p style={{ color: '#8c6f61', fontSize: '13px', margin: '0 0 24px' }}>
        Add friends by username. Invite them to games from the lobby.
      </p>

      {/* Add friend */}
      <div style={cardStyle}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#7A5C46', margin: '0 0 12px' }}>
          Add a Friend
        </h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            style={{ ...inputStyle, flex: 1 }}
            placeholder="Search by username..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendRequest()}
          />
          <button style={btnStyle('#7A5C46')} onClick={handleSendRequest}>
            Send Request
          </button>
        </div>
        {searchError   && <p style={{ color: '#A44A3F', fontWeight: 600, marginTop: '8px', fontSize: '13px' }}>{searchError}</p>}
        {searchSuccess && <p style={{ color: '#9CAF88', fontWeight: 600, marginTop: '8px', fontSize: '13px' }}>{searchSuccess}</p>}
      </div>

      {/* Pending requests */}
      {requests.length > 0 && (
        <div style={cardStyle}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#7A5C46', margin: '0 0 12px' }}>
            Pending Requests ({requests.length})
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {requests.map((r, i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '10px 14px', background: '#fffdf8',
                border: '1px solid #d8c6b4', borderRadius: '8px',
              }}>
                <span style={{ fontWeight: 700, color: '#3D2B1F', fontSize: '14px' }}>
                  👤 {r.username}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={btnStyle('#9CAF88')} onClick={() => handleAccept(r.from)}>Accept</button>
                  <button style={btnStyle('#A44A3F')} onClick={() => handleDecline(r.from)}>Decline</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Friends list */}
      <div style={cardStyle}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: '#7A5C46', margin: '0 0 12px' }}>
          My Friends ({friends.length})
        </h2>
        {friends.length === 0 ? (
          <p style={{ color: '#8c6f61', fontSize: '13px' }}>
            No friends yet — send a request above!
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {friends.map((f) => (
              <div key={f._id} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '12px 14px', background: '#fffdf8',
                border: '1px solid #d8c6b4', borderRadius: '8px',
              }}>
                <div>
                  <p style={{ margin: 0, fontWeight: 700, color: '#3D2B1F', fontSize: '14px' }}>
                    👤 {f.username}
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#8c6f61' }}>
                    {f.stats?.gamesWon ?? 0} wins
                  </p>
                </div>
                <button
                  style={{ ...btnStyle('#d8c6b4'), color: '#7A5C46' }}
                  onClick={() => handleRemove(f._id)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}