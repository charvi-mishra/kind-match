import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function MatchesPage() {
  const { apiCall } = useAuth();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMatches();
  }, []);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const data = await apiCall('GET', '/matches/my-matches');
      setMatches(data.matches || []);
    } catch (err) {
      setError('Could not load matches');
    } finally {
      setLoading(false);
    }
  };

  const woundLabel = (w) => w === 'mom' ? '🌸 mom' : '🏔️ dad';

  if (loading) {
    return (
      <div className="loading-screen" style={{ paddingTop: 64 }}>
        <div className="spinner" />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, background: 'var(--bg)' }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px 80px' }}>
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontFamily: 'Syne', marginBottom: 8 }}>your kind matches 💚</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
            {matches.length > 0
              ? `${matches.length} mutual connection${matches.length > 1 ? 's' : ''} — wounds aligned`
              : 'no matches yet — keep swiping!'}
          </p>
        </div>

        {error && <div className="alert alert-error">{error}</div>}

        {matches.length === 0 && !loading && (
          <div style={{
            textAlign: 'center', padding: '60px 24px',
            background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🌱</div>
            <h2 style={{ fontFamily: 'Syne', fontSize: 22, marginBottom: 12 }}>no matches yet</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
              your kind is out there. keep swiping left on people you vibe with.
            </p>
            <Link to="/discover" className="btn btn-primary">discover people →</Link>
          </div>
        )}

        <div style={{ display: 'grid', gap: 16 }}>
          {matches.filter(Boolean).map(match => (
            <div key={match._id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

              {/* ── Top row: avatar + info + matched badge ── */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>

                {/* Avatar */}
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
                  background: `linear-gradient(135deg,
                    ${match.visibleWound === 'mom' ? 'var(--pink)' : '#64c8ff'} 0%,
                    ${match.hiddenWound === 'mom' ? 'var(--pink)' : '#64c8ff'} 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 24, fontFamily: 'Syne', fontWeight: 700, color: '#000'
                }}>
                  {match.name?.[0]?.toUpperCase()}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
                    {match.name}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                    {match.country}
                    {match.age ? ` · ${match.age}` : ''}
                    {match.isUnemployed ? ' · between jobs' : match.occupation ? ` · ${match.occupation}` : ''}
                  </div>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {match.hiddenWound && (
                      <span className="tag tag-purple" style={{ fontSize: 11 }}>
                        hidden: {woundLabel(match.hiddenWound)}
                      </span>
                    )}
                    {match.visibleWound && (
                      <span className="tag tag-pink" style={{ fontSize: 11 }}>
                        visible: {woundLabel(match.visibleWound)}
                      </span>
                    )}
                    {match.mentalDisorders?.slice(0, 2).map(d => (
                      <span key={d} className="tag tag-green" style={{ fontSize: 11 }}>{d}</span>
                    ))}
                  </div>
                </div>

                {/* Match indicator */}
                <div style={{
                  flexShrink: 0, textAlign: 'center',
                  padding: '8px 12px', background: 'rgba(0,255,135,0.08)',
                  borderRadius: 12, border: '1px solid rgba(0,255,135,0.2)'
                }}>
                  <div style={{ fontSize: 20, marginBottom: 2 }}>💚</div>
                  <div style={{ fontSize: 10, color: 'var(--green)', fontWeight: 600 }}>MATCHED</div>
                </div>
              </div>

              {/* ── Social connect row ── */}
              {(match.socialLinks?.instagram || match.socialLinks?.whatsapp) && (
                <div style={{
                  display: 'flex',
                  gap: 10,
                  paddingTop: 12,
                  borderTop: '1px solid var(--border)',
                  flexWrap: 'wrap',
                }}>

                  {/* Instagram — visible to all matched users */}
                  {match.socialLinks?.instagram && (
                    <a
                      href={`https://instagram.com/${match.socialLinks.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 7,
                        padding: '7px 14px',
                        borderRadius: 10,
                        background: 'linear-gradient(135deg,#833ab422,#fd1d1d22,#fcb04522)',
                        border: '1px solid #833ab444',
                        fontSize: 13,
                        color: '#e0a0ff',
                        textDecoration: 'none',
                        fontWeight: 500,
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      <span style={{ fontSize: 15 }}>📸</span>
                      @{match.socialLinks.instagram}
                    </a>
                  )}

                  {/* WhatsApp — visible only because this IS a mutual match */}
                  {match.socialLinks?.whatsapp && (
                    <a
                      href={`https://wa.me/${match.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 7,
                        padding: '7px 14px',
                        borderRadius: 10,
                        background: 'rgba(37,211,102,0.08)',
                        border: '1px solid rgba(37,211,102,0.25)',
                        fontSize: 13,
                        color: '#25d366',
                        textDecoration: 'none',
                        fontWeight: 500,
                        transition: 'opacity 0.2s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                      onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                    >
                      <span style={{ fontSize: 15 }}>💬</span>
                      {match.socialLinks.whatsapp}
                    </a>
                  )}
                </div>
              )}

              {/* No social links added yet */}
              {!match.socialLinks?.instagram && !match.socialLinks?.whatsapp && (
                <div style={{
                  paddingTop: 12,
                  borderTop: '1px solid var(--border)',
                  fontSize: 12,
                  color: '#333',
                  fontStyle: 'italic',
                }}>
                  {match.name?.split(' ')[0]} hasn't added social links yet
                </div>
              )}

            </div>
          ))}
        </div>

        {matches.length > 0 && (
          <div style={{ marginTop: 40, textAlign: 'center' }}>
            <Link to="/discover" className="btn btn-outline">
              discover more people →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}