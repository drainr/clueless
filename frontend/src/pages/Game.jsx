import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket'
import { useAuth } from '../hooks/useAuth'
import { roomAPI } from '../utils/api'
import BoardSidebar from '../components/board/BoardSidebar'
import RightSideBar from '../components/board/RightSideBar'
import ClueBoard    from './Ogboardgame'

export default function Game() {
  const { roomCode } = useParams()
  const socket = useSocket()
  const navigate = useNavigate()
  const { user } = useAuth()

  const [players, setPlayers]     = useState([])
  const [myHand, setMyHand]       = useState([])
  const [myCharacter, setMyCharacter] = useState(null)
  const [gameId, setGameId]       = useState(null)
  const [turnPhase, setTurnPhase] = useState('roll')
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0)

// Add this useEffect
useEffect(() => {
  if (!roomCode) return

  const loadGameState = async () => {
    try {
      const res = await roomAPI.getByCode(roomCode)
      const room = res.data

      // Build player list from room until game_state socket fires
      if (room?.players) {
        setPlayers(room.players.map((p) => ({
          displayName: p.displayName,
          isHost:      p.isHost,
          isEliminated: false,
          isActive:    p.isActive,
        })))
      }
    } catch (err) {
      console.error('Failed to load game state', err)
    }
  }

  loadGameState()
}, [roomCode])

  useEffect(() => {
    if (!socket) return

    // Full public game state — sent to all players on game start
    socket.on('game_state', ({ gameId, players, turnPhase, currentTurnIndex }) => {
      setGameId(gameId)
      setPlayers(players)
      setTurnPhase(turnPhase)
      setCurrentTurnIndex(currentTurnIndex)
    })

    // Private hand — sent only to this player
    socket.on('deal_hand', ({ character, hand }) => {
      console.log('deal_hand received:', hand)
      setMyCharacter(character)
      setMyHand(hand)
    })

    socket.on('game_abandoned', ({ message }) => {
      alert(message)
      navigate('/')
    })

    socket.on('player_left', ({ displayName }) => {
      setPlayers((prev) =>
        prev.map((p) =>
          p.displayName === displayName ? { ...p, isActive: false } : p
        )
      )
    })

    return () => {
      socket.off('game_state')
      socket.off('deal_hand')
      socket.off('game_abandoned')
      socket.off('player_left')
    }
  }, [socket])

  const handleLeaveGame = () => {
    if (socket && roomCode) {
      socket.emit('abandon_game', { roomCode })
    }
    navigate('/')
  }

  const isMyTurn = players[currentTurnIndex]?.displayName === user?.username

  return (
    <div className="flex h-screen bg-[#F5E8D3]">
      <BoardSidebar />

      <main className="flex-1 overflow-auto">
        <ClueBoard />
      </main>

      <RightSideBar
        onLeave={handleLeaveGame}
        players={players}
        myHand={myHand}
        myCharacter={myCharacter}
        isMyTurn={isMyTurn}
        turnPhase={turnPhase}
      />
    </div>
  )
}