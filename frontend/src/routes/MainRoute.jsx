import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import RegisteredRoute from './RegisteredRoute'

import LandingPage from '../pages/Landing'
import Dashboard from '../pages/Dashboard'
import Boards from '../pages/Boards'
import FriendsList from '../pages/FriendsList'
import Leaderboard from '../pages/Leaderboard'
import Rules from '../pages/Rules'
import Profile from '../pages/Profile'
import Lobby from '../pages/Lobby'
import Game from '../pages/Game'

export default function MainRoute() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<LandingPage />} />

      {/* Registered users only */}
      <Route element={<RegisteredRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Navigate to="boards" replace />} />
          <Route path="boards"      element={<Boards />} />
          <Route path="friends"     element={<FriendsList />} />
          <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="rules"       element={<Rules />} />
        <Route path="profile"     element={<Profile />} />
        </Route>
      </Route>

      {/* Protected routes (registered + guests) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/lobby/:roomCode" element={<Lobby />} />
        <Route path="/game/:roomCode"  element={<Game />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}