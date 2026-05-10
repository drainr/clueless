import { Routes, Route, Navigate } from 'react-router-dom'
// import ProtectedRoute from './ProtectedRoute'
// import RegisteredRoute from './RegisteredRoute'

import Dashboard from '../pages/Dashboard'
import BoardSidebar from '../components/BoardSidebar'
import Rules from '../pages/Rules'
import LandingPage from '../pages/Landing'

export default function MainRoute() {
  return (
    <Routes>
      {/* Public */}
      {/* <Route path="/"         element={<Landing />} /> */}
      <Route path="/dashboard"  element={<Dashboard />} />
      <Route path="/rules" element={<Rules />} />
      <Route path="/game"     element={<BoardSidebar />} />
      {/* <Route path="/login"    element={<Login />} /> */}
      {/* <Route path="/register" element={<Register />} /> */}
      <Route path ="/landing" element={<LandingPage />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}