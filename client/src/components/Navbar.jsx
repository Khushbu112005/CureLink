import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, Activity } from 'lucide-react';
import './Navbar.css';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };


    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="nav-left">
                    <Link to="/" className="nav-brand">
                        <Activity className="nav-brand-icon" size={32} />
                        <span>CureLink</span>
                    </Link>
                </div>
                <div className="nav-actions">
                    {user ? (
                        <>
                            <div className="user-info">
                                <User size={20} />
                                <span className="font-medium">{user.name}</span>
                                <span className="user-badge">
                                    {user.role}
                                </span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="logout-btn"
                            >
                                <LogOut size={20} />
                                <span>Logout</span>
                            </button>
                        </>
                    ) : (
                        <div className="auth-links">
                            <Link to="/login" className="login-link">Login</Link>
                            <Link to="/register" className="btn btn-primary">Get Started</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );

}
