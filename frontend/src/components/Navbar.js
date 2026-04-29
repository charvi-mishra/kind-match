import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiSparkles } from 'react-icons/hi2';
import { RiHeartFill, RiUserLine, RiLogoutBoxLine, RiMenuLine, RiCloseLine } from 'react-icons/ri';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (location.pathname === '/getting-to-know') return null;

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <Link to="/discover" className="navbar-brand">
        Kind<span>Match</span> <RiHeartFill style={{ color: 'var(--green)', verticalAlign: 'middle', fontSize: 16 }} />
      </Link>

      {/* Desktop nav */}
      <div className="navbar-actions" style={{ display: 'flex' }}>
        <Link to="/discover" className={`nav-btn ${isActive('/discover') ? 'active' : ''}`}>
          <HiSparkles size={15} /> Discover
        </Link>
        <Link to="/matches" className={`nav-btn ${isActive('/matches') ? 'active' : ''}`}>
          <RiHeartFill size={15} /> Matches
        </Link>
        <Link to="/profile" className={`nav-btn ${isActive('/profile') ? 'active' : ''}`}>
          <RiUserLine size={15} /> Profile
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            hey, {user?.name?.split(' ')[0]}
          </span>
          <button onClick={handleLogout} className="nav-btn" style={{ color: 'var(--red)' }}>
            <RiLogoutBoxLine size={15} /> Sign out
          </button>
        </div>
      </div>

      {/* Mobile hamburger */}
      <button
        className="nav-btn"
        onClick={() => setMenuOpen(o => !o)}
        style={{ display: 'none' }}
        aria-label="Toggle menu"
        id="nav-hamburger"
      >
        {menuOpen ? <RiCloseLine size={20} /> : <RiMenuLine size={20} />}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div style={{
          position: 'absolute', top: 64, left: 0, right: 0,
          background: 'rgba(10,10,10,0.97)', backdropFilter: 'blur(20px)',
          borderBottom: '1px solid var(--border)',
          padding: '12px 16px', display: 'flex', flexDirection: 'column', gap: 4,
          zIndex: 99,
        }}>
          <Link to="/discover" className={`nav-btn ${isActive('/discover') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            <HiSparkles size={15} /> Discover
          </Link>
          <Link to="/matches" className={`nav-btn ${isActive('/matches') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            <RiHeartFill size={15} /> Matches
          </Link>
          <Link to="/profile" className={`nav-btn ${isActive('/profile') ? 'active' : ''}`} onClick={() => setMenuOpen(false)}>
            <RiUserLine size={15} /> Profile
          </Link>
          <button onClick={handleLogout} className="nav-btn" style={{ color: 'var(--red)', justifyContent: 'flex-start' }}>
            <RiLogoutBoxLine size={15} /> Sign out
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 640px) {
          #nav-hamburger { display: flex !important; }
          .navbar-actions { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
