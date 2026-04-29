import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  RiEyeLine, RiEyeOffLine, RiUserLine, RiMailLine,
  RiGlobalLine, RiBriefcaseLine, RiLockPasswordLine,
  RiCheckLine, RiCloseLine, RiAlertLine, RiHeartFill,
} from 'react-icons/ri';

// ── Validation rules ──────────────────────────────────────────────
const RULES = {
  name:     { regex: /^[a-zA-Z\s'-]{2,50}$/,   msg: 'Name must be 2–50 letters (spaces, hyphens, apostrophes allowed)' },
  email:    { regex: /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, msg: 'Enter a valid email address' },
  occupation: { regex: /^[a-zA-Z0-9\s,.'&()-]{2,60}$/, msg: 'Occupation must be 2–60 characters' },
  password: { regex: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/, msg: 'Min 8 chars with uppercase, lowercase and a number' },
};

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
  'Vietnam','Zimbabwe',
];

// Password strength meter
function PasswordStrength({ password }) {
  if (!password) return null;
  const checks = [
    { label: '8+ characters',  ok: password.length >= 8 },
    { label: 'uppercase',      ok: /[A-Z]/.test(password) },
    { label: 'lowercase',      ok: /[a-z]/.test(password) },
    { label: 'number',         ok: /\d/.test(password) },
  ];
  const score = checks.filter(c => c.ok).length;
  const color = score <= 1 ? 'var(--red)' : score <= 2 ? 'var(--yellow)' : score === 3 ? '#f97316' : 'var(--green)';
  const label = ['', 'Weak', 'Fair', 'Good', 'Strong'][score];

  return (
    <div style={{ marginTop: 8 }}>
      <div style={{ display: 'flex', gap: 4, marginBottom: 6 }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{
            flex: 1, height: 3, borderRadius: 2,
            background: i <= score ? color : 'var(--border-light)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {checks.map(c => (
            <span key={c.label} style={{ fontSize: 11, color: c.ok ? 'var(--green)' : 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: 3 }}>
              {c.ok ? <RiCheckLine size={11} /> : <RiCloseLine size={11} />} {c.label}
            </span>
          ))}
        </div>
        {label && <span style={{ fontSize: 11, color, fontWeight: 600 }}>{label}</span>}
      </div>
    </div>
  );
}

export default function SignUpPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '', email: '', country: '', occupation: '',
    isUnemployed: false, password: '', confirmPassword: '',
  });
  const [touched, setTouched] = useState({});
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
    setError('');
  };

  const handleBlur = (e) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const getFieldError = (field) => {
    if (!touched[field]) return null;
    if (field === 'name' && !RULES.name.regex.test(form.name.trim())) return RULES.name.msg;
    if (field === 'email' && !RULES.email.regex.test(form.email.trim())) return RULES.email.msg;
    if (field === 'occupation' && !form.isUnemployed && !RULES.occupation.regex.test(form.occupation.trim())) return RULES.occupation.msg;
    if (field === 'password' && !RULES.password.regex.test(form.password)) return RULES.password.msg;
    if (field === 'confirmPassword' && form.password !== form.confirmPassword) return "Passwords don't match";
    return null;
  };

  const validate = () => {
    if (!form.name.trim())                                    return 'Name is required';
    if (!RULES.name.regex.test(form.name.trim()))             return RULES.name.msg;
    if (!form.email.trim())                                   return 'Email is required';
    if (!RULES.email.regex.test(form.email.trim()))           return RULES.email.msg;
    if (!form.country)                                        return 'Select your country';
    if (!form.isUnemployed) {
      if (!form.occupation.trim())                            return 'Enter your occupation or check unemployed';
      if (!RULES.occupation.regex.test(form.occupation.trim())) return RULES.occupation.msg;
    }
    if (!form.password)                                       return 'Password is required';
    if (!RULES.password.regex.test(form.password))            return RULES.password.msg;
    if (form.password !== form.confirmPassword)               return "Passwords don't match";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Mark all fields touched so errors show
    setTouched({ name: true, email: true, country: true, occupation: true, password: true, confirmPassword: true });
    const err = validate();
    if (err) { setError(err); return; }

    setLoading(true);
    try {
      await register({
        name:         form.name.trim(),
        email:        form.email.trim().toLowerCase(),
        country:      form.country,
        occupation:   form.isUnemployed ? null : form.occupation.trim(),
        isUnemployed: form.isUnemployed,
        password:     form.password,
      });
      navigate('/getting-to-know');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const passMatch    = form.confirmPassword && form.password === form.confirmPassword;
  const passMismatch = form.confirmPassword && form.password !== form.confirmPassword;

  const FieldIcon = ({ icon: Icon }) => (
    <Icon size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }} />
  );

  return (
    <div className="page-center">
      <div style={{ width: '100%', maxWidth: 480 }} className="animate-fade-up">
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 22, color: 'var(--green)', marginBottom: 4 }}>
              Kind<span style={{ color: 'var(--text)', fontWeight: 400 }}>Match</span>{' '}
              <RiHeartFill style={{ color: 'var(--green)', verticalAlign: 'middle' }} />
            </div>
          </Link>
          <h1 style={{ fontSize: 28, marginBottom: 8 }}>create your account</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>let's get you set up, no bs</p>
        </div>

        <div className="card">
          {error && (
            <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <RiAlertLine size={16} /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name */}
            <div className="input-group">
              <label>your name</label>
              <div style={{ position: 'relative' }}>
                <FieldIcon icon={RiUserLine} />
                <input
                  type="text" name="name" value={form.name}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="what people call you"
                  autoComplete="name"
                  style={{ paddingLeft: 40, borderColor: getFieldError('name') ? 'var(--red)' : undefined }}
                />
              </div>
              {getFieldError('name') && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>{getFieldError('name')}</div>}
            </div>

            {/* Email */}
            <div className="input-group">
              <label>email address</label>
              <div style={{ position: 'relative' }}>
                <FieldIcon icon={RiMailLine} />
                <input
                  type="email" name="email" value={form.email}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="your@email.com"
                  autoComplete="email"
                  style={{ paddingLeft: 40, borderColor: getFieldError('email') ? 'var(--red)' : undefined }}
                />
              </div>
              {getFieldError('email') && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>{getFieldError('email')}</div>}
            </div>

            {/* Country */}
            <div className="input-group">
              <label>country</label>
              <div style={{ position: 'relative' }}>
                <FieldIcon icon={RiGlobalLine} />
                <select
                  name="country" value={form.country}
                  onChange={handleChange} onBlur={handleBlur}
                  style={{ paddingLeft: 40, borderColor: touched.country && !form.country ? 'var(--red)' : undefined }}
                >
                  <option value="">— select your country —</option>
                  {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              {touched.country && !form.country && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>Select your country</div>}
            </div>

            {/* Occupation */}
            <div className="input-group">
              <label>occupation</label>
              <div style={{ position: 'relative' }}>
                <FieldIcon icon={RiBriefcaseLine} />
                <input
                  type="text" name="occupation" value={form.occupation}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder={form.isUnemployed ? 'skipped — unemployed selected' : 'what you do for a living'}
                  disabled={form.isUnemployed}
                  style={{
                    paddingLeft: 40,
                    opacity: form.isUnemployed ? 0.4 : 1,
                    borderColor: getFieldError('occupation') ? 'var(--red)' : undefined,
                  }}
                />
              </div>
              {getFieldError('occupation') && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>{getFieldError('occupation')}</div>}
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10, cursor: 'pointer', fontSize: 13, color: 'var(--text-muted)', textTransform: 'none', letterSpacing: 0 }}>
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
              <label>password</label>
              <div style={{ position: 'relative' }}>
                <RiLockPasswordLine size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }} />
                <input
                  type={showPass ? 'text' : 'password'}
                  name="password" value={form.password}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="min 8 chars, upper + lower + number"
                  autoComplete="new-password"
                  style={{ paddingLeft: 40, paddingRight: 48, borderColor: getFieldError('password') ? 'var(--red)' : undefined }}
                />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  {showPass ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                </button>
              </div>
              <PasswordStrength password={form.password} />
              {getFieldError('password') && <div style={{ fontSize: 12, color: 'var(--red)', marginTop: 4 }}>{getFieldError('password')}</div>}
            </div>

            {/* Confirm Password */}
            <div className="input-group">
              <label>confirm password</label>
              <div style={{ position: 'relative' }}>
                <RiLockPasswordLine size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)', pointerEvents: 'none' }} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  name="confirmPassword" value={form.confirmPassword}
                  onChange={handleChange} onBlur={handleBlur}
                  placeholder="same as above"
                  autoComplete="new-password"
                  style={{
                    paddingLeft: 40, paddingRight: 48,
                    borderColor: passMismatch ? 'var(--red)' : passMatch ? 'var(--green)' : undefined,
                  }}
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  {showConfirm ? <RiEyeOffLine size={18} /> : <RiEyeLine size={18} />}
                </button>
              </div>
              {passMatch    && <div style={{ fontSize: 12, color: 'var(--green)', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><RiCheckLine size={12} /> passwords match</div>}
              {passMismatch && <div style={{ fontSize: 12, color: 'var(--red)',   marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 }}><RiCloseLine size={12} /> passwords don't match</div>}
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? 'creating account...' : 'create my account'}
            </button>
          </form>

          <div className="divider">or</div>

          <div style={{ textAlign: 'center', fontSize: 14, color: 'var(--text-muted)' }}>
            already have an account?{' '}
            <Link to="/signin" style={{ color: 'var(--green)', textDecoration: 'none', fontWeight: 500 }}>sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
