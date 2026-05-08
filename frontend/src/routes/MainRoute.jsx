import { Routes, Route, Navigate } from 'react-router-dom'
// import ProtectedRoute from './ProtectedRoute'
// import RegisteredRoute from './RegisteredRoute'

import Dashboard from '../pages/Dashboard'

export default function MainRoute() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"         element={<Landing />} />
      <Route path="/login"    element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  )
}