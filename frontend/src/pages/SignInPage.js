import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SignInPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError('Fill in both fields please');
      return;
    }
    setLoading(true);
    try {
      const data = await login(form);
      if (!data.user.gettingToKnowComplete) {
        navigate('/getting-to-know');
      } else {
        navigate('/discover');
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
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: 'var(--green)', marginBottom: 4 }}>
              Kind<span style={{ color: 'var(--text)', fontWeight: 400 }}>Match</span> 💚
            </div>
          </Link>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>welcome back</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>your people are waiting</p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <label>email address</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="your@email.com"
                autoComplete="email" autoFocus
              />
            </div>

            <div className="input-group">
              <label>password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password" value={form.password}
                  onChange={handleChange} placeholder="your password"
                  autoComplete="current-password"
                  style={{ paddingRight: 48 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 18, color: 'var(--text-muted)'
                  }}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}
              style={{ marginTop: 8 }}>
              {loading ? 'signing in...' : 'sign in 💚'}
            </button>
          </form>

          <div className="divider">or</div>

          <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            new here?{' '}
            <Link to="/signup" style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 500 }}>
              create account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
