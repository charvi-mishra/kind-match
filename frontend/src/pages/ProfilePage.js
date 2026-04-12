// src/pages/ProfilePage.js
// Full own-profile view for KindMatch.
// • Reads user from AuthContext (same pattern as other pages)
// • Shows all profile fields: name, bio, age, country, occupation,
//   parental wound, mental disorders, social links
// • SocialLinksSection is already wired — edit/save works out of the box
// • Add this page to App.js:  <Route path="/profile" element={<ProfilePage />} />
// • Add a "Profile" link in Navbar.js pointing to /profile

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import SocialLinksSection from '../components/SocialLinksSection';
import { useSocialLinks } from '../hooks/useSocialLinks';

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */
function getWoundLabel(wound) {
  if (!wound) return '—';
  return wound === 'mom' ? '🌸 Mom wound' : '🪨 Dad wound';
}

function getIdentityLabel(identity) {
  if (!identity) return '—';
  return identity === 'mom' ? 'Tends to Mom energy' : 'Tends to Dad energy';
}

function getScalePosition(score) {
  // score 0–100; 0 = full mom, 100 = full dad
  if (score == null) return null;
  return Math.max(0, Math.min(100, score));
}

/* ─────────────────────────────────────────────
   Styles — mirrors KindMatch CSS variables
   (#00ff87 accent, #0a0a0a bg, Syne + DM Sans)
───────────────────────────────────────────── */
const S = {
  page: {
    minHeight: '100vh',
    background: '#0a0a0a',
    padding: '0 0 80px',
    fontFamily: 'DM Sans, sans-serif',
    color: '#fff',
  },

  /* hero banner */
  hero: {
    background: 'linear-gradient(160deg, #0d1f0d 0%, #0a0a0a 60%)',
    borderBottom: '1px solid #111',
    padding: '48px 24px 36px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '16px',
    position: 'relative',
  },
  avatar: {
    width: '96px',
    height: '96px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #00ff87, #00b85c)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '2.4rem',
    fontWeight: 800,
    color: '#0a0a0a',
    fontFamily: 'Syne, sans-serif',
    flexShrink: 0,
    boxShadow: '0 0 0 4px #0a0a0a, 0 0 0 6px #00ff8733',
  },
  heroName: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: '1.8rem',
    color: '#fff',
    margin: 0,
    textAlign: 'center',
  },
  heroBadge: {
    background: '#111',
    border: '1px solid #1e1e1e',
    borderRadius: '20px',
    padding: '4px 14px',
    fontSize: '0.8rem',
    color: '#888',
    fontFamily: 'DM Sans, sans-serif',
  },
  heroBio: {
    fontSize: '0.95rem',
    color: '#aaa',
    textAlign: 'center',
    maxWidth: '420px',
    lineHeight: 1.6,
    fontStyle: 'italic',
  },

  editBtn: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    background: 'transparent',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    padding: '8px 16px',
    color: '#666',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '0.82rem',
    cursor: 'pointer',
    transition: 'border-color 0.2s, color 0.2s',
  },

  /* content area */
  content: {
    maxWidth: '520px',
    margin: '0 auto',
    padding: '0 20px',
  },

  /* section card */
  card: {
    background: '#111',
    border: '1px solid #1a1a1a',
    borderRadius: '16px',
    padding: '22px',
    marginTop: '20px',
  },
  cardTitle: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: '0.85rem',
    color: '#444',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    marginBottom: '16px',
  },

  /* info rows */
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 0',
    borderBottom: '1px solid #161616',
  },
  infoLabel: {
    fontSize: '0.88rem',
    color: '#555',
  },
  infoValue: {
    fontSize: '0.92rem',
    color: '#ddd',
    fontWeight: 500,
    textAlign: 'right',
    maxWidth: '240px',
  },

  /* parental scale bar */
  scaleWrap: {
    marginTop: '6px',
  },
  scaleBar: {
    height: '8px',
    background: '#1a1a1a',
    borderRadius: '99px',
    overflow: 'hidden',
    position: 'relative',
    margin: '12px 0 8px',
  },
  scaleFill: (pct) => ({
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    width: `${pct}%`,
    background: 'linear-gradient(90deg, #00b85c, #00ff87)',
    borderRadius: '99px',
    transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
  }),
  scaleLabels: {
    display: 'flex',
    justifyContent: 'space-between',
    fontSize: '0.75rem',
    color: '#444',
  },

  /* wounds */
  woundRow: {
    display: 'flex',
    gap: '12px',
    marginTop: '4px',
  },
  woundChip: (visible) => ({
    flex: 1,
    background: visible ? '#0d1a0d' : '#1a1a0d',
    border: `1px solid ${visible ? '#1a3a1a' : '#2a2a0a'}`,
    borderRadius: '12px',
    padding: '12px',
    textAlign: 'center',
  }),
  woundChipLabel: {
    fontSize: '0.7rem',
    color: '#555',
    letterSpacing: '0.1em',
    textTransform: 'uppercase',
    display: 'block',
    marginBottom: '4px',
  },
  woundChipValue: {
    fontSize: '0.9rem',
    fontWeight: 700,
    color: '#ccc',
    fontFamily: 'Syne, sans-serif',
  },

  /* disorders */
  tagGrid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '4px',
  },
  tag: {
    background: '#0a0a0a',
    border: '1px solid #222',
    borderRadius: '8px',
    padding: '5px 12px',
    fontSize: '0.82rem',
    color: '#aaa',
  },
  emptyTag: {
    fontSize: '0.88rem',
    color: '#333',
    fontStyle: 'italic',
  },

  /* bottom action */
  signOutBtn: {
    display: 'block',
    width: '100%',
    marginTop: '24px',
    padding: '14px',
    background: 'transparent',
    border: '1px solid #1e1e1e',
    borderRadius: '12px',
    color: '#333',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'border-color 0.2s, color 0.2s',
    textAlign: 'center',
  },

  /* loading / error */
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
    flexDirection: 'column',
    gap: '16px',
    color: '#333',
    fontFamily: 'Syne, sans-serif',
  },
  dot: {
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: '#00ff87',
    animation: 'pulse 1.2s ease-in-out infinite',
  },
};

/* inject keyframe once */
if (typeof document !== 'undefined' && !document.getElementById('kp-pulse')) {
  const style = document.createElement('style');
  style.id = 'kp-pulse';
  style.textContent = `
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50%       { opacity: 0.3; transform: scale(0.7); }
    }
    .kp-edit-btn:hover { border-color: #00ff87 !important; color: #00ff87 !important; }
    .kp-signout:hover  { border-color: #ff4d4d33 !important; color: #ff4d4d !important; }
  `;
  document.head.appendChild(style);
}

/* ─────────────────────────────────────────────
   Component
───────────────────────────────────────────── */
export default function ProfilePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { saveSocialLinks } = useSocialLinks();

  // local copy so social links update instantly in UI without needing setUser
  const [localUser, setLocalUser] = useState(user);
  const [error, setError]         = useState(null);

  // keep localUser in sync if parent AuthContext user changes
  useEffect(() => { setLocalUser(user); }, [user]);

  /* Save social links — update only localUser state, no setUser needed */
  const handleSaveSocial = async (payload) => {
    const result = await saveSocialLinks(payload);
    if (result.ok && result.user) {
      setLocalUser(result.user);
    }
    return result;
  };

  const handleLogout = () => {
    logout();          // clears token + AuthContext — same as your Navbar logout
    navigate('/');
  };

  /* ── error ── */
  if (error || !localUser) {
    return (
      <div style={S.page}>
        <div style={S.center}>
          <span style={{ color: '#ff4d4d' }}>⚠ {error || 'Could not load profile'}</span>
          <button
            onClick={() => navigate('/signin')}
            style={{ ...S.signOutBtn, color: '#00ff87', borderColor: '#00ff87' }}
          >
            Sign in again
          </button>
        </div>
      </div>
    );
  }

  const scalePct   = getScalePosition(localUser.parentalScaleResult);
  const hasProfile = localUser.parentalScaleResult != null;

  return (
    <div style={S.page}>

      {/* ── Hero ── */}
      <div style={S.hero}>
        <button
          className="kp-edit-btn"
          style={S.editBtn}
          onClick={() => navigate('/getting-to-know')}
          title="Edit profile"
        >
          ✏ Edit
        </button>

        <div style={S.avatar}>
          {localUser.name ? localUser.name.charAt(0).toUpperCase() : '?'}
        </div>

        <h1 style={S.heroName}>{localUser.name}</h1>

        <span style={S.heroBadge}>
          {localUser.country || 'Earth'}{localUser.age ? ` · ${localUser.age} yrs` : ''}
        </span>

        {localUser.bio && <p style={S.heroBio}>"{localUser.bio}"</p>}
      </div>

      {/* ── Content ── */}
      <div style={S.content}>

        {/* ── Basic info ── */}
        <div style={S.card}>
          <div style={S.cardTitle}>About</div>

          <div style={S.infoRow}>
            <span style={S.infoLabel}>Email</span>
            <span style={S.infoValue}>{localUser.email}</span>
          </div>

          <div style={S.infoRow}>
            <span style={S.infoLabel}>Occupation</span>
            <span style={S.infoValue}>
              {localUser.isUnemployed ? '🛋 Unemployed' : (localUser.occupation || '—')}
            </span>
          </div>

          <div style={{ ...S.infoRow, borderBottom: 'none' }}>
            <span style={S.infoLabel}>Country</span>
            <span style={S.infoValue}>{localUser.country || '—'}</span>
          </div>
        </div>

        {/* ── Parental scale ── */}
        {hasProfile ? (
          <div style={S.card}>
            <div style={S.cardTitle}>Parental Scale</div>

            <div style={{ fontSize: '0.9rem', color: '#888', marginBottom: '4px' }}>
              {getIdentityLabel(localUser.identifiesMoreAs)}
            </div>

            <div style={S.scaleBar}>
              <div style={S.scaleFill(scalePct)} />
            </div>
            <div style={S.scaleLabels}>
              <span>🌸 Mom (0)</span>
              <span style={{ color: '#00ff87', fontWeight: 600 }}>{scalePct}</span>
              <span>🪨 Dad (100)</span>
            </div>

            <div style={{ ...S.woundRow, marginTop: '20px' }}>
              <div style={S.woundChip(true)}>
                <span style={S.woundChipLabel}>Visible wound</span>
                <span style={S.woundChipValue}>{getWoundLabel(localUser.visibleWound)}</span>
              </div>
              <div style={S.woundChip(false)}>
                <span style={S.woundChipLabel}>Hidden wound</span>
                <span style={S.woundChipValue}>{getWoundLabel(localUser.hiddenWound)}</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ ...S.card, textAlign: 'center', padding: '32px' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>🧠</div>
            <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, color: '#fff', marginBottom: '8px' }}>
              Profile incomplete
            </div>
            <div style={{ fontSize: '0.88rem', color: '#555', marginBottom: '20px' }}>
              Complete the getting-to-know quiz to unlock matching.
            </div>
            <button
              onClick={() => navigate('/getting-to-know')}
              style={{
                background: '#00ff87', color: '#0a0a0a', border: 'none',
                borderRadius: '10px', padding: '12px 24px',
                fontFamily: 'Syne, sans-serif', fontWeight: 800,
                fontSize: '0.9rem', cursor: 'pointer',
              }}
            >
              Complete profile →
            </button>
          </div>
        )}

        {/* ── Mental disorders ── */}
        <div style={S.card}>
          <div style={S.cardTitle}>Mental Health</div>
          {localUser.mentalDisorders && localUser.mentalDisorders.length > 0 ? (
            <div style={S.tagGrid}>
              {localUser.mentalDisorders.map(d => (
                <span key={d} style={S.tag}>{d}</span>
              ))}
            </div>
          ) : (
            <span style={S.emptyTag}>Nothing selected yet</span>
          )}
        </div>

        {/* ── Social links — already wired, edit works out of the box ── */}
        <SocialLinksSection
          instagram={localUser?.socialLinks?.instagram}
          whatsapp={localUser?.socialLinks?.whatsapp}
          isOwner={true}
          onSave={handleSaveSocial}
        />

        {/* ── Sign out ── */}
        <button
          className="kp-signout"
          style={S.signOutBtn}
          onClick={handleLogout}
        >
          Sign out
        </button>

      </div>
    </div>
  );
}