import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../components/LandingPage/Landing.css';
import Login from './Login';
import Register from './Register';
import logo from '../assets/Clueless_Favicon.png'
import TextType from "../components/TextType/TextType";

const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('login');
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestCodePrompt, setGuestCodePrompt] = useState(false);
  const [roomCode, setRoomCode] = useState('');
  const [codeError, setCodeError] = useState(null);
  const { loginAsGuest, setError } = useAuth();
  const navigate = useNavigate();

  const handlePlayNow = () => {
    setShowModal(true);
    setModalType('login');
    setError(null);
  };

  const handleSwitch = (type) => {
    setModalType(type);
    setError(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setGuestCodePrompt(false);
    setRoomCode('');
    setCodeError(null);
    setError(null);
  };

  // Guest clicks "Continue as Guest" → show room code prompt
  const handleContinueAsGuest = async () => {
    setGuestLoading(true);
    try {
      await loginAsGuest();
      setShowModal(false);
      setGuestCodePrompt(true);
    } catch (err) {
      // error set in context
    } finally {
      setGuestLoading(false);
    }
  };

  // Guest submits room code
  const handleGuestJoin = () => {
    if (!roomCode.trim()) return
    setCodeError(null)
    navigate(`/lobby/${roomCode.trim().toUpperCase()}`)
  }

    return (
        <div className="landing_container">
            <div className="landing_content">
                <img src={logo} alt="Clueless" className="landing_logo" />
                <h1 className="landing_title">Clueless</h1>
                <p className="landing_description">
                    <TextType
                        text={[
                            "Solve the mystery before your opponents do. Find the suspect, weapon, and room. Enter the mansion and follow the clues."
                        ]}
                        typingSpeed={55}
                        showCursor={true}
                        cursorCharacter="|"
                    />
                </p>
                <button className="landing_btn" onClick={handlePlayNow}>
                    PLAY NOW
                </button>
            </div>

            <div className="h-[1200px] bg-[#ffff]">

            </div>

      {/* Login/Register modal */}
      {showModal && (
        <div className="modal_overlay" onClick={handleCloseModal}>
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <button className="modal_close" onClick={handleCloseModal}>×</button>
            {modalType === 'login' && (
              <Login
                onSwitch={() => handleSwitch('register')}
                onGuestClick={handleContinueAsGuest}
                guestLoading={guestLoading}
              />
            )}
            {modalType === 'register' && (
              <Register
                onSwitch={() => handleSwitch('login')}
                onGuestClick={handleContinueAsGuest}
                guestLoading={guestLoading}
              />
            )}
          </div>
        </div>
      )}

      {/* Guest room code prompt */}
      {guestCodePrompt && (
        <div className="modal_overlay" onClick={handleCloseModal}>
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <button className="modal_close" onClick={handleCloseModal}>×</button>
            <div className="form_area" style={{ padding: '30px 40px', gap: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <h2 className="title">Enter Room Code</h2>
              <p style={{ color: '#8c6f61', fontSize: '13px', margin: 0, textAlign: 'center' }}>
                Ask the host for the 6-character room code
              </p>
              <input
                type="text"
                className="form_style"
                placeholder="e.g. AB12CD"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
                style={{ letterSpacing: '0.15em', textAlign: 'center', fontWeight: 700, fontSize: '18px' }}
              />
              {codeError && <p style={{ color: '#A44A3F', fontWeight: 600, margin: 0 }}>{codeError}</p>}
              <button
                className="btn"
                onClick={handleGuestJoin}
                disabled={roomCode.trim().length !== 6}
              >
                Join Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;