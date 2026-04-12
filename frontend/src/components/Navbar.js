import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (location.pathname === '/getting-to-know') return null;

  return (
    <nav className="navbar">
      <Link to="/discover" className="navbar-brand">
        Kind<span>Match</span> 💚
      </Link>

      <div className="navbar-actions">
        <Link
          to="/discover"
          className={`nav-btn ${location.pathname === '/discover' ? 'active' : ''}`}
        >
          ✨ Discover
        </Link>
        <Link
          to="/matches"
          className={`nav-btn ${location.pathname === '/matches' ? 'active' : ''}`}
        >
          💚 Matches
        </Link>
        <Link
          to="/profile"
          className={`nav-btn ${location.pathname === '/profile' ? 'active' : ''}`}
        >
          👤 Profile
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            hey, {user?.name?.split(' ')[0]}
          </span>
          <button onClick={handleLogout} className="nav-btn" style={{ color: 'var(--red)' }}>
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
