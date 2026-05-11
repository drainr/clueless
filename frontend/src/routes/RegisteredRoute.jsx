import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RegisteredRoute() {
  const { user, loading } = useAuth()

  if (loading) return null

  if (!user) return <Navigate to="/" replace />
  if (user.isGuest) return <Navigate to="/game" replace />

  return <Outlet />
}