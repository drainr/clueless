import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSocket } from '../hooks/useSocket'
import { useAuth }   from '../hooks/useAuth'
import { roomAPI }   from '../utils/api'
import BoardSidebar  from '../components/board/BoardSidebar'
import RightSideBar  from '../components/board/RightSideBar'
import ClueBoard     from './Ogboardgame'

export default function Game() {
  const { roomCode } = useParams()
  const socket       = useSocket()
  const navigate     = useNavigate()
  const { user }     = useAuth()

  const [players,          setPlayers]          = useState([])
  const [myHand,           setMyHand]           = useState([])
  const [myCharacter,      setMyCharacter]      = useState(null)
  const [turnPhase,        setTurnPhase]        = useState('roll')
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0)
  const [reachableTiles,   setReachableTiles]   = useState([])
  const [inRoom,           setInRoom]           = useState(null)

  const isMyTurn = players[currentTurnIndex]?.displayName === user?.username

  // Load initial room state on mount
  useEffect(() => {
    if (!roomCode) return
    const load = async () => {
      try {
        const res  = await roomAPI.getByCode(roomCode)
        const room = res.data
        if (room?.players) {
          setPlayers(room.players.map((p) => ({
            displayName:  p.displayName,
            character:    null,
            isHost:       p.isHost,
            isEliminated: false,
            isActive:     p.isActive,
            position:     { row: 7, col: 7 },
          })))
        }
      } catch (err) {
        console.error('Failed to load room:', err)
      }
    }
    load()
  }, [roomCode])

  // Request game state from server on mount
  useEffect(() => {
    if (!socket || !roomCode) return
    socket.emit('get_game_state', { roomCode })
  }, [socket, roomCode])

  // Socket event listeners
  useEffect(() => {
    if (!socket) return

    socket.on('game_state', ({ gameId, players, turnPhase, currentTurnIndex }) => {
      setPlayers(players)
      setTurnPhase(turnPhase)
      setCurrentTurnIndex(currentTurnIndex)
    })

    socket.on('deal_hand', ({ character, hand }) => {
      console.log('deal_hand received:', hand)
      setMyCharacter(character)
      setMyHand(hand)
    })

    socket.on('dice_rolled', ({ reachableTiles }) => {
      console.log('dice_rolled received, reachableTiles:', reachableTiles?.length)
      setReachableTiles(reachableTiles ?? [])
      setTurnPhase('move')
    })

    socket.on('player_moved', ({ displayName, position, inRoom: room }) => {
      setPlayers((prev) =>
        prev.map((p) => p.displayName === displayName ? { ...p, position } : p)
      )
      if (displayName === user?.username) setInRoom(room)
    })

    socket.on('phase_changed', ({ turnPhase, inRoom: room }) => {
      setTurnPhase(turnPhase)
      if (room !== undefined) setInRoom(room)
      if (turnPhase === 'roll') setReachableTiles([])
    })

    socket.on('turn_changed', ({ currentTurnIndex, turnPhase }) => {
      setCurrentTurnIndex(currentTurnIndex)
      setTurnPhase(turnPhase)
      setReachableTiles([])
      setInRoom(null)
    })

    socket.on('player_eliminated', ({ displayName, message }) => {
      alert(message)
      setPlayers((prev) =>
        prev.map((p) => p.displayName === displayName ? { ...p, isEliminated: true } : p)
      )
    })

    socket.on('suggestion_made', ({ byPlayer, suspect, weapon, location }) => {
      console.log(`${byPlayer} suggested: ${suspect}, ${weapon}, in ${location}`)
    })

    socket.on('card_shown', ({ byPlayer, card }) => {
      alert(`${byPlayer} showed you: ${card}`)
    })

    socket.on('suggestion_refuted', ({ byPlayer }) => {
      console.log(`${byPlayer} refuted the suggestion`)
    })

    socket.on('game_over', ({ winner, solution, message }) => {
      const msg = winner
        ? `🎉 ${winner} wins! The solution was: ${solution.suspect}, ${solution.weapon}, in the ${solution.location}`
        : message
      alert(msg)
      navigate('/')
    })

    socket.on('game_abandoned', ({ message }) => {
      alert(message)
      navigate('/')
    })

    socket.on('player_left', ({ displayName }) => {
      setPlayers((prev) =>
        prev.map((p) => p.displayName === displayName ? { ...p, isActive: false } : p)
      )
    })

    socket.on('room_closed', () => navigate('/'))

    return () => {
      socket.off('game_state')
      socket.off('deal_hand')
      socket.off('dice_rolled')
      socket.off('player_moved')
      socket.off('phase_changed')
      socket.off('turn_changed')
      socket.off('player_eliminated')
      socket.off('suggestion_made')
      socket.off('card_shown')
      socket.off('suggestion_refuted')
      socket.off('game_over')
      socket.off('game_abandoned')
      socket.off('player_left')
      socket.off('room_closed')
    }
  }, [socket, user])

  const handleMove = ({ row, col }) => {
    if (!socket) return
    socket.emit('move_player', { roomCode, row, col })
  }

  const handleSuggestion = (suspect, weapon) => {
    if (!socket) return
    socket.emit('make_suggestion', { roomCode, suspect, weapon })
  }

  const handleAccusation = (suspect, weapon, location) => {
    if (!socket) return
    socket.emit('make_accusation', { roomCode, suspect, weapon, location })
  }

  const handleEndTurn = () => {
    if (!socket) return
    socket.emit('end_turn', { roomCode })
  }

  const handleLeaveGame = () => {
    if (socket && roomCode) socket.emit('abandon_game', { roomCode })
    navigate('/')
  }

  return (
    <div className="flex h-screen bg-[#F5E8D3]">
      <BoardSidebar myHand={myHand} />

      <main className="flex-1 overflow-auto flex flex-col">
        <ClueBoard
          players={players}
          myCharacter={myCharacter}
          isMyTurn={isMyTurn}
          turnPhase={turnPhase}
          reachableTiles={reachableTiles}
          onMove={handleMove}
        />
      </main>

      <RightSideBar
        onLeave={handleLeaveGame}
        onEndTurn={handleEndTurn}
        onSuggestion={handleSuggestion}
        onAccusation={handleAccusation}
        players={players}
        myHand={myHand}
        myCharacter={myCharacter}
        isMyTurn={isMyTurn}
        turnPhase={turnPhase}
        inRoom={inRoom}
      />
    </div>
  )
}