import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const COUNTRIES = [
  'Afghanistan','Albania','Algeria','Argentina','Australia','Austria','Bangladesh',
  'Belgium','Brazil','Canada','Chile','China','Colombia','Czech Republic','Denmark',
  'Egypt','Ethiopia','Finland','France','Germany','Ghana','Greece','Hungary','India',
  'Indonesia','Iran','Iraq','Ireland','Israel','Italy','Japan','Jordan','Kenya',
  'Malaysia','Mexico','Morocco','Myanmar','Nepal','Netherlands','New Zealand',
  'Nigeria','Norway','Pakistan','Peru','Philippines','Poland','Portugal','Romania',
  'Russia','Saudi Arabia','Serbia','Singapore','South Africa','South Korea','Spain',
  'Sri Lanka','Sweden','Switzerland','Tanzania','Thailand','Turkey','Uganda',
  'Ukraine','United Arab Emirates','United Kingdom','United States','Venezuela',
  'Vietnam','Zimbabwe'
];

export default function SignUpPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', country: '', occupation: '',
    isUnemployed: false, password: '', confirmPassword: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    setError('');
  };

  const validate = () => {
    if (!form.name.trim()) return 'Name is required';
    if (!form.email.trim()) return 'Email is required';
    if (!/\S+@\S+\.\S+/.test(form.email)) return 'Enter a valid email';
    if (!form.country) return 'Select your country';
    if (!form.isUnemployed && !form.occupation.trim()) return 'Enter your occupation or check "currently unemployed"';
    if (!form.password) return 'Password is required';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) return "Passwords don't match — double check!";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        country: form.country,
        occupation: form.isUnemployed ? null : form.occupation,
        isUnemployed: form.isUnemployed,
        password: form.password
      });
      navigate('/getting-to-know');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const passMatch = form.confirmPassword && form.password === form.confirmPassword;
  const passMismatch = form.confirmPassword && form.password !== form.confirmPassword;

  return (
    <div className="page-center">
      <div style={{ width: '100%', maxWidth: 480 }} className="animate-fade-up">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: 'var(--green)', marginBottom: 4 }}>
              Kind<span style={{ color: 'var(--text)', fontWeight: 400 }}>Match</span> 💚
            </div>
          </Link>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>create your account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>let's get you set up, no bs</p>
        </div>

        <div className="card">
          {error && <div className="alert alert-error">⚠️ {error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="input-group">
              <label>your name</label>
              <input
                type="text" name="name" value={form.name}
                onChange={handleChange} placeholder="what people call you"
                autoComplete="name"
              />
            </div>

            {/* Email */}
            <div className="input-group">
              <label>email address *</label>
              <input
                type="email" name="email" value={form.email}
                onChange={handleChange} placeholder="your@email.com"
                autoComplete="email"
              />
            </div>

            {/* Country */}
            <div className="input-group">
              <label>country</label>
              <select name="country" value={form.country} onChange={handleChange}>
                <option value="">— select your country —</option>
                {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Occupation */}
            <div className="input-group">
              <label>occupation **</label>
              <input
                type="text" name="occupation" value={form.occupation}
                onChange={handleChange}
                placeholder={form.isUnemployed ? 'skipped — unemployed selected' : 'what you do for a living'}
                disabled={form.isUnemployed}
                style={{ opacity: form.isUnemployed ? 0.4 : 1 }}
              />
              <label style={{
                display: 'flex', alignItems: 'center', gap: 8,
                marginTop: 10, cursor: 'pointer', fontSize: 13,
                color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 0
              }}>
                <input
                  type="checkbox" name="isUnemployed"
                  checked={form.isUnemployed} onChange={handleChange}
                  style={{ display: 'block', width: 16, height: 16, cursor: 'pointer', accentColor: 'var(--green)' }}
                />
                currently unemployed (no judgement fr)
              </label>
            </div>

            {/* Password */}
            <div className="input-group">
              <label>password ***</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password" value={form.password}
                  onChange={handleChange} placeholder="at least 6 characters"
                  autoComplete="new-password"
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

            {/* Confirm Password */}
            <div className="input-group">
              <label>re-enter password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword" value={form.confirmPassword}
                  onChange={handleChange} placeholder="same as above"
                  autoComplete="new-password"
                  style={{
                    paddingRight: 48,
                    borderColor: passMismatch ? 'var(--red)' : passMatch ? 'var(--green)' : undefined
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: 'absolute', right: 14, top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none', border: 'none', cursor: 'pointer',
                    fontSize: 18, color: 'var(--text-muted)'
                  }}
                >
                  {showConfirm ? '🙈' : '👁️'}
                </button>
              </div>
              {passMatch && (
                <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 6 }}>✓ passwords match</div>
              )}
              {passMismatch && (
                <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 6 }}>✗ passwords don't match</div>
              )}
            </div>

            {/* Legend */}
            <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 20, lineHeight: 1.8 }}>
              * required field &nbsp;·&nbsp; ** nullable if unemployed &nbsp;·&nbsp; *** obscured text
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'creating account...' : 'create my account 🚀'}
            </button>
          </form>

          <div className="divider">or</div>

          <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            already have an account?{' '}
            <Link to="/signin" style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 500 }}>
              sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
