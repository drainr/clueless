import { Routes, Route, Navigate } from 'react-router-dom'
// import ProtectedRoute from './ProtectedRoute'
// import RegisteredRoute from './RegisteredRoute'

import Dashboard from '../pages/Dashboard'
import BoardSidebar from '../components/BoardSidebar'
import Boards from '../pages/Boards'
import FriendsList from '../pages/FriendsList'
import Leaderboard from '../pages/Leaderboard'
import Profile from '../pages/Profile'
import Rules from '../pages/Rules'

export default function MainRoute() {
  return (
    <Routes>
      {/* Public */}
      {/* <Route path="/"         element={<Landing />} /> */}
      <Route path="/dashboard" element={<Dashboard />}>
        <Route index element={<Navigate to="boards" replace />} />
        <Route path="boards"      element={<Boards />} />
        <Route path="friends"     element={<FriendsList />} />
        <Route path="leaderboard" element={<Leaderboard />} />
        <Route path="rules"       element={<Rules />} />
        <Route path="profile"     element={<Profile />} />
        </Route>
      <Route path="/game"     element={<BoardSidebar />} />
      {/* <Route path="/login"    element={<Login />} /> */}
      {/* <Route path="/register" element={<Register />} /> */}

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}