import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import MainRoute from './routes/MainRoute'
import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <MainRoute />
      </AuthProvider>
    </BrowserRouter>
  )
}