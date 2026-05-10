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
        setError(null);
    };

    const handleContinueAsGuest = async () => {
        setGuestLoading(true);
        try {
            await loginAsGuest();
            handleCloseModal();
            navigate('/dashboard');
        } catch (err) {
            // Error is already set in context
        } finally {
            setGuestLoading(false);
        }
    };

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

            {showModal && (
                <div className="modal_overlay" onClick={handleCloseModal}>
                    <div className="modal_content" onClick={(e) => e.stopPropagation()}>
                        <button className="modal_close" onClick={handleCloseModal}>×</button>
                        {modalType === 'login' && (
                            <Login 
                                onSwitch={() => handleSwitch('register')}
                                onGuestClick={handleContinueAsGuest}
                            />
                        )}
                        {modalType === 'register' && (
                            <Register 
                                onSwitch={() => handleSwitch('login')}
                                onGuestClick={handleContinueAsGuest}
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    )
};

export default LandingPage;