import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function RegisteredRoute() {
  const { user, isGuest } = useAuth()
  if (!user) return <Navigate to="/login" />
  if (isGuest) return <Navigate to="/lobby" />
  return <Outlet />
}