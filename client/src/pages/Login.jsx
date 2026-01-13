import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity } from 'lucide-react';
import './Login.css';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="login-container">
            <div className="auth-header">
                <div className="auth-logo">
                    <Activity size={48} />
                </div>
                <h2 className="auth-title">Sign in to your account</h2>
                <p className="auth-subtitle">
                    Or <Link to="/register">create a new account</Link>
                </p>
            </div>

            <div className="auth-card">
                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="auth-error">
                            {error}
                        </div>
                    )}
                    <div className="form-group">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="input-field"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input
                            id="password"
                            type="password"
                            required
                            className="input-field"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-full">
                        Sign in
                    </button>
                </form>
            </div>
        </div>
    );
}
