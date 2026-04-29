import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  RiEyeLine, RiEyeOffLine, RiMailLine, RiLockPasswordLine,
  RiAlertLine, RiCloseLine, RiInstagramLine, RiHeartFill,
} from 'react-icons/ri';

// ── Validation ────────────────────────────────────────────────────
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/* ─── Instagram nudge toast ─────────────────────────────────────── */
function InstagramNudge({ onDismiss, onGoToProfile }) {
  return (
    <div style={{
      position: 'fixed', bottom: 24, left: '50%',
      transform: 'translateX(-50%)', zIndex: 9999,
      width: 'min(92vw, 420px)',
      background: 'linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%)',
      borderRadius: 16, padding: 2,
      boxShadow: '0 8px 32px rgba(131,58,180,0.35)',
      animation: 'nudge-slide-up 0.45s cubic-bezier(0.34,1.56,0.64,1) both',
    }}>
      <div style={{ background: 'var(--bg-card, #111)', borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: 12, background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RiInstagramLine size={22} color="#fff" />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 2 }}>Add your Instagram handle</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-muted)', lineHeight: 1.4 }}>So your matches can reach you — takes 10 seconds!</div>
          <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
            <button onClick={onGoToProfile} style={{ background: 'linear-gradient(135deg, #833ab4, #fd1d1d, #fcb045)', color: '#fff', border: 'none', borderRadius: 8, padding: '6px 14px', fontSize: 12.5, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Update profile →
            </button>
            <button onClick={onDismiss} style={{ background: 'transparent', color: 'var(--text-muted)', border: '1px solid var(--border)', borderRadius: 8, padding: '6px 12px', fontSize: 12.5, cursor: 'pointer' }}>
              Maybe later
            </button>
          </div>
        </div>
        <button onClick={onDismiss} aria-label="Dismiss" style={{ flexShrink: 0, alignSelf: 'flex-start', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2, display: 'flex' }}>
          <RiCloseLine size={18} />
        </button>
      </div>
      <style>{`
        @keyframes nudge-slide-up {
          from { opacity: 0; transform: translateX(-50%) translateY(24px); }
          to   { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ─── Main SignIn page ───────────────────────────────────────────── */
export default function SignInPage() {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm]           = useState({ email: '', password: '' });
  const [touched, setTouched]     = useState({});
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');
  const [loading, setLoading]     = useState(false);
  const [showNudge, setShowNudge] = useState(false);
  const [pendingRoute, setPendingRoute] = useState('/discover');

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleBlur = (e) => setTouched(prev => ({ ...prev, [e.target.name]: true }));

  const emailError = touched.email && !EMAIL_REGEX.test(form.email.trim()) ? 'Enter a valid email' : null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });

    if (!form.email.trim() || !form.password) { setError('Fill in both fields'); return; }
    if (!EMAIL_REGEX.test(form.email.trim()))  { setError('Enter a valid email address'); return; }

    setLoading(true);
    try {
      const data = await login({ email: form.email.trim().toLowerCase(), password: form.password });
      const destination = !data.user.gettingToKnowComplete ? '/getting-to-know' : '/discover';

      const hasInstagram = !!data.user.socialLinks?.instagram;
      if (!hasInstagram && data.user.gettingToKnowComplete) {
        setPendingRoute(destination);
        setShowNudge(true);
        setTimeout(() => { setShowNudge(false); navigate(destination); }, 8000);
      } else {
        navigate(destination);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid credentials. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-center">
      <div style={{ width: '100%', maxWidth: 420 }} className="animate-fade-up">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: 'var(--green)', marginBottom: 4 }}>
              Kind<span style={{ color: 'var(--text)', fontWeight: 400 }}>Match</span>{' '}
              <RiHeartFill style={{ color: 'var(--green)', verticalAlign: 'middle' }} />
            </div>
          </Link>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>your people are waiting</p>
        </div>

        <div className="card">
          {error && (
            <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiAlertLine size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email */}
            <div className="input-group">
              <label>email address</label>
              <div style={{ position: 'relative' }}>
                <RiMailLine size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }} />
                <input
                  type="email" name="email" value={form.email}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="your@email.com"
                  autoComplete="email" autoFocus
                  style={{ paddingLeft: 40, borderColor: emailError ? 'var(--red)' : undefined }}
                />
              </div>
              {emailError && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>{emailError}</div>}
            </div>

            {/* Password */}
            <div className="input-group">
              <label>password</label>
              <div style={{ position: 'relative' }}>
                <RiLockPasswordLine size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password" value={form.password}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="your password"
                  autoComplete="current-password"
                  style={{ paddingLeft: 40, paddingRight: 48 }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  {showPass ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'signing in...' : 'sign in'}
            </button>
          </form>

          <div className="divider">or</div>

          <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            new here?{' '}
            <Link to="/signup" style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 500 }}>create account</Link>
          </div>
        </div>
      </div>

      {showNudge && (
        <InstagramNudge
          onDismiss={() => { setShowNudge(false); navigate(pendingRoute); }}
          onGoToProfile={() => { setShowNudge(false); navigate('/profile?focus=instagram'); }}
        />
      )}
    </div>
  );
}
