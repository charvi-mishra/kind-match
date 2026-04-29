import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { RiInstagramLine, RiHeartFill, RiCloseLine } from 'react-icons/ri';

export default function DiscoverPage() {
  const { user, apiCall } = useAuth();
  const navigate = useNavigate();

  const [recommendations, setRecommendations] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [matchPopup, setMatchPopup] = useState(null);
  const [swipeDir, setSwipeDir] = useState(null); // 'left' | 'right'
  const [animating, setAnimating] = useState(false);

  // Touch/drag support
  const startX = useRef(null);
  const cardRef = useRef(null);
  const [dragX, setDragX] = useState(0);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiCall('GET', '/matches/recommendations');
      setRecommendations(data.recommendations || []);
      setCurrentIndex(0);
    } catch (err) {
      if (err.response?.data?.needsProfile) {
        navigate('/getting-to-know');
      } else {
        setError(err.response?.data?.message || 'Could not load recommendations');
      }
    } finally {
      setLoading(false);
    }
  }, [apiCall, navigate]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const currentPerson = recommendations[currentIndex];

  const swipe = async (action) => {
    if (animating || !currentPerson) return;
    setAnimating(true);
    // 'like' animates card left, 'dislike' animates card right
    setSwipeDir(action === 'like' ? 'left' : 'right');

    await new Promise(r => setTimeout(r, 400));

    try {
      if (action === 'like') {
        const res = await apiCall('POST', '/swipe/like', { targetUserId: currentPerson._id });
        if (res.isMatch) {
          setMatchPopup(res.matchedUser);
        }
      } else {
        await apiCall('POST', '/swipe/dislike', { targetUserId: currentPerson._id });
      }
    } catch (e) {
      console.error(e);
    }

    setSwipeDir(null);
    setDragX(0);
    setCurrentIndex(prev => prev + 1);
    setAnimating(false);
  };

  // Touch handlers — drag left = like, drag right = dislike
  const onTouchStart = (e) => { startX.current = e.touches[0].clientX; };
  const onTouchMove = (e) => {
    if (startX.current === null) return;
    setDragX(e.touches[0].clientX - startX.current);
  };
  const onTouchEnd = () => {
    if (Math.abs(dragX) > 80) {
      swipe(dragX < 0 ? 'like' : 'dislike');
    } else {
      setDragX(0);
    }
    startX.current = null;
  };

  // Mouse drag handlers
  const onMouseDown = (e) => { startX.current = e.clientX; };
  const onMouseMove = (e) => {
    if (startX.current === null) return;
    setDragX(e.clientX - startX.current);
  };
  const onMouseUp = () => {
    if (startX.current !== null && Math.abs(dragX) > 80) {
      swipe(dragX < 0 ? 'like' : 'dislike');
    } else {
      setDragX(0);
    }
    startX.current = null;
  };

  const woundLabel = (w) => w === 'mom' ? '🌸 Mom wound' : '🏔️ Dad wound';

  if (loading) {
    return (
      <div className="loading-screen" style={{ paddingTop: 64 }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>finding your kind...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', paddingTop: 80, background: 'var(--bg)' }}>
      {/* Match popup */}
      {matchPopup && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 200,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(12px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: 24, animation: 'fadeIn 0.3s ease'
        }}>
          <div className="card" style={{ maxWidth: 360, textAlign: 'center', position: 'relative' }}>
            <div style={{ fontSize: 64, marginBottom: 16, animation: 'pulse 1.5s infinite' }}>💚</div>
            <h2 style={{ fontSize: 28, marginBottom: 8 }}>it's a KindMatch!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24, lineHeight: 1.7 }}>
              you and <strong style={{ color: 'var(--green)' }}>{matchPopup.name}</strong> liked each other. your wounds aligned.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setMatchPopup(null)}>
                keep swiping
              </button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => { setMatchPopup(null); navigate('/matches'); }}>
                see matches 💚
              </button>
            </div>
          </div>
        </div>
      )}

      <div style={{ maxWidth: 480, margin: '0 auto', padding: '0 16px 80px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <h1 style={{ fontSize: 22, fontFamily: 'Syne' }}>discover your kind</h1>
          <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            ← swipe left to match · swipe right to pass →
          </p>
        </div>

        {/* Your wound info bar */}
        {user && user.hiddenWound && user.visibleWound && (
          <div style={{
            display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap',
            marginBottom: 20
          }}>
            <span className="tag tag-purple">hidden: {user.hiddenWound === 'mom' ? '🌸' : '🏔️'} {user.hiddenWound}</span>
            <span className="tag tag-pink">visible: {user.visibleWound === 'mom' ? '🌸' : '🏔️'} {user.visibleWound}</span>
          </div>
        )}

        {error && <div className="alert alert-error" style={{ textAlign: 'center' }}>{error}</div>}

        {/* No more cards */}
        {!currentPerson && !loading && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: 64, marginBottom: 20 }}>🌿</div>
            <h2 style={{ fontFamily: 'Syne', fontSize: 24, marginBottom: 12 }}>you've seen everyone!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 24 }}>
              new people join every day. check back soon — or check your matches!
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={fetchRecommendations}>refresh</button>
              <button className="btn btn-primary" onClick={() => navigate('/matches')}>see matches 💚</button>
            </div>
          </div>
        )}

        {/* Card stack */}
        {currentPerson && (
          <div className="swipe-card-stack">
            {/* Next card (peek) */}
            {recommendations[currentIndex + 1] && (
              <div style={{
                position: 'absolute', inset: 0, top: 12,
                transform: 'scale(0.96)', transformOrigin: 'top center',
                borderRadius: 24, background: 'var(--bg-card)',
                border: '1px solid var(--border)', zIndex: 1,
              }} />
            )}

            {/* Current card */}
            <div
              ref={cardRef}
              onTouchStart={onTouchStart}
              onTouchMove={onTouchMove}
              onTouchEnd={onTouchEnd}
              onMouseDown={onMouseDown}
              onMouseMove={onMouseMove}
              onMouseUp={onMouseUp}
              onMouseLeave={onMouseUp}
              style={{
                position: 'absolute', inset: 0, zIndex: 2,
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 24, overflow: 'hidden',
                cursor: 'grab', userSelect: 'none',
                transform: swipeDir === 'left'
                  ? 'translateX(-120%) rotate(-20deg)'
                  : swipeDir === 'right'
                    ? 'translateX(120%) rotate(20deg)'
                    : `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`,
                transition: swipeDir ? 'transform 0.4s ease' : dragX !== 0 ? 'none' : 'transform 0.3s ease',
                boxShadow: dragX < -60
                  ? '0 0 40px rgba(0,255,135,0.2)'
                  : dragX > 60
                    ? '0 0 40px rgba(255,71,87,0.2)'
                    : 'var(--shadow)',
              }}
            >
              {/* Avatar area */}
              <div className="swipe-card-avatar" style={{
                background: `linear-gradient(135deg,
                  ${currentPerson.visibleWound === 'mom' ? 'rgba(253,121,168,0.2)' : 'rgba(100,200,255,0.2)'} 0%,
                  var(--bg-elevated) 100%)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{
                  width: 100, height: 100, borderRadius: '50%',
                  background: `linear-gradient(135deg,
                    ${currentPerson.visibleWound === 'mom' ? 'var(--pink)' : '#64c8ff'} 0%,
                    ${currentPerson.hiddenWound === 'mom' ? 'var(--pink)' : '#64c8ff'} 100%)`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 42, boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}>
                  {currentPerson.name?.[0]?.toUpperCase() || '?'}
                </div>

                {dragX < -30 && (
                  <div style={{ position: 'absolute', top: 16, left: 16, background: 'var(--green)', color: '#000', fontFamily: 'Syne', fontWeight: 800, fontSize: 16, padding: '6px 14px', borderRadius: 8, opacity: Math.min(-dragX / 80, 1), transform: 'rotate(-12deg)' }}>
                    MATCH 💚
                  </div>
                )}
                {dragX > 30 && (
                  <div style={{ position: 'absolute', top: 16, right: 16, background: 'var(--red)', color: 'white', fontFamily: 'Syne', fontWeight: 800, fontSize: 16, padding: '6px 14px', borderRadius: 8, opacity: Math.min(dragX / 80, 1), transform: 'rotate(12deg)' }}>
                    PASS ✗
                  </div>
                )}

                {currentPerson.compatibilityScore !== undefined && (
                  <div style={{ position: 'absolute', bottom: 10, right: 10, background: 'rgba(0,0,0,0.7)', borderRadius: 20, padding: '3px 10px', fontSize: 11, color: 'var(--green)', fontWeight: 600 }}>
                    {Math.round(Math.min((currentPerson.compatibilityScore / 90) * 100, 99))}% kind match
                  </div>
                )}
              </div>

              {/* Card info */}
              <div style={{ padding: '16px 20px', overflowY: 'auto', flex: 1 }}>
                <div style={{ marginBottom: 10 }}>
                  <h2 style={{ fontSize: 20, fontFamily: 'Syne', marginBottom: 2 }}>{currentPerson.name}</h2>
                  <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
                    {currentPerson.country}
                    {currentPerson.age ? ` · ${currentPerson.age}` : ''}
                    {currentPerson.isUnemployed ? ' · between jobs' : currentPerson.occupation ? ` · ${currentPerson.occupation}` : ''}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                  <span className="tag tag-purple" style={{ fontSize: 11 }}>hidden: {woundLabel(currentPerson.hiddenWound)}</span>
                  <span className="tag tag-pink"   style={{ fontSize: 11 }}>visible: {woundLabel(currentPerson.visibleWound)}</span>
                </div>

                {currentPerson.mentalDisorders?.length > 0 && (
                  <div style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 5, letterSpacing: 1 }}>LIVING WITH</div>
                    <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                      {currentPerson.mentalDisorders.slice(0, 3).map(d => (
                        <span key={d} className="tag tag-green" style={{ fontSize: 10 }}>{d}</span>
                      ))}
                      {currentPerson.mentalDisorders.length > 3 && (
                        <span className="tag" style={{ fontSize: 10, color: 'var(--text-muted)', border: '1px solid var(--border)' }}>
                          +{currentPerson.mentalDisorders.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                )}

                {currentPerson.socialLinks?.instagram && (
                  <div style={{ marginTop: 4 }}>
                    <div style={{ fontSize: 10, color: 'var(--text-dim)', marginBottom: 5, letterSpacing: 1 }}>CONNECT</div>
                    <a
                      href={`https://instagram.com/${currentPerson.socialLinks.instagram}`}
                      target="_blank" rel="noopener noreferrer"
                      onClick={e => e.stopPropagation()}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 8, background: 'linear-gradient(135deg,#833ab422,#fd1d1d22,#fcb04522)', border: '1px solid #833ab444', fontSize: 12, color: '#e0a0ff', textDecoration: 'none', fontWeight: 500 }}
                    >
                      <RiInstagramLine size={13} />
                      @{currentPerson.socialLinks.instagram}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Action buttons */}
        {currentPerson && (
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 20 }}>
            <button
              onClick={() => swipe('dislike')}
              disabled={animating}
              className="swipe-btn-pass"
              style={{ width: 60, height: 60, borderRadius: '50%', background: 'rgba(255,71,87,0.1)', border: '2px solid var(--red)', fontSize: 22, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Pass"
            >✗</button>

            <button
              onClick={() => swipe('like')}
              disabled={animating}
              className="swipe-btn-match"
              style={{ width: 68, height: 68, borderRadius: '50%', background: 'rgba(0,255,135,0.12)', border: '2px solid var(--green)', fontSize: 26, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 20px rgba(0,255,135,0.2)' }}
              title="Match"
            >💚</button>
          </div>
        )}

        {/* Counter */}
        {recommendations.length > 0 && currentIndex < recommendations.length && (
          <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--text-dim)' }}>
            {currentIndex + 1} of {recommendations.length} · {recommendations.length - currentIndex - 1} left
          </div>
        )}
      </div>
    </div>
  );
}