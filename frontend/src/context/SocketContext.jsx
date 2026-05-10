import { createContext, useEffect, useRef, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from '../hooks/useAuth'

export const SocketContext = createContext()

export function SocketProvider({ children }) {
  const { user } = useAuth()
  const socketRef = useRef(null)
  const [socket, setSocket] = useState(null)

  useEffect(() => {
    if (!user) return

    const s = io('http://localhost:3005', {
      auth: { token: localStorage.getItem('authToken') }
    })

    socketRef.current = s
    setSocket(s)

    return () => {
      s.disconnect()
      setSocket(null)
    }
  }, [user])

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  )
}