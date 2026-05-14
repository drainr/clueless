// src/pages/Unauthorized.jsx
import { useNavigate } from 'react-router-dom'
import logo from '../assets/Clueless_Favicon.png'

export default function Unauthorized() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #3D2B1F 0%, #7A5C46 100%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      gap: '20px', textAlign: 'center', padding: '2rem',
    }}>
      <img src={logo} alt="ClueLess" style={{ height: '80px', width: '80px', objectFit: 'contain' }} />

      <h1 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '8rem', fontWeight: 900,
        color: '#D9B86A', margin: 0, lineHeight: 1,
      }}>
        401
      </h1>

      <h2 style={{
        fontFamily: 'Cormorant Garamond, serif',
        fontSize: '2rem', fontWeight: 700,
        color: '#F5E8D3', margin: 0,
      }}>
        Unauthorized
      </h2>

      <p style={{
        color: '#F5E8D3', opacity: 0.8,
        fontSize: '15px', maxWidth: '360px',
        lineHeight: 1.6, margin: 0,
      }}>
        You don't have permission to enter this room.
        Only registered detectives may access this area.
      </p>

      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '14px 40px',
            background: '#A44A3F',
            color: '#F5E8D3',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: '3px 3px 0px #D9B86A',
            transition: 'opacity 0.15s ease',
          }}
          onMouseOver={(e) => e.target.style.opacity = '0.85'}
          onMouseOut={(e)  => e.target.style.opacity = '1'}
        >
          Back to Home
        </button>

        <button
          onClick={() => navigate('/', { state: { openLogin: true } })}
          style={{
            padding: '14px 40px',
            background: 'none',
            color: '#F5E8D3',
            border: '2px solid #F5E8D3',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '15px',
            cursor: 'pointer',
            transition: 'opacity 0.15s ease',
          }}
          onMouseOver={(e) => e.target.style.opacity = '0.7'}
          onMouseOut={(e)  => e.target.style.opacity = '1'}
        >
          Log In
        </button>
      </div>
    </div>
  )
}