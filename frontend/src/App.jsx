import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import MainRoute from './routes/MainRoute'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SocketProvider>
          <MainRoute />
        </SocketProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}