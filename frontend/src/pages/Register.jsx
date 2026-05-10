import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import './Login_Register.css';

const Register = ({ onSwitch, onGuestClick }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { register, error, setError } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            await register(username, email, password);
            navigate('/dashboard');
        } catch (err) {
            // Error is already set in context
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="form_area">
                <p className="title">SIGN UP</p>
                {error && <p className="error_message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form_group">
                        <label className="sub_title" htmlFor="username">Username</label>
                        <input
                            id="username"
                            placeholder="Enter your username"
                            className="form_style"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form_group">
                        <label className="sub_title" htmlFor="email">Email</label>
                        <input
                            id="email"
                            placeholder="Enter your email"
                            className="form_style"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form_group">
                        <label className="sub_title" htmlFor="password">Password</label>
                        <input
                            id="password"
                            placeholder="Enter your password"
                            className="form_style"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <button
                            className="btn"
                            type="submit"
                            disabled={isLoading}
                        >
                            {isLoading ? 'SIGNING UP...' : 'SIGN UP'}
                        </button>
                        <p>
                            Have an Account?{' '}
                            <button
                                type="button"
                                className="link"
                                onClick={onSwitch}
                            >
                                Login Here!
                            </button>
                        </p>
                    </div>
                </form>
                <button
                    className="guest_button"
                    onClick={onGuestClick}
                    disabled={isLoading}
                >
                    CONTINUE AS GUEST
                </button>
            </div>
        </div>
    );
};

export default Register;