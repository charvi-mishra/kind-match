import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const MENTAL_DISORDERS = [
  'ADHD', 'Anxiety Disorder', 'Autism Spectrum Disorder (ASD)',
  'Bipolar Disorder', 'Borderline Personality Disorder (BPD)',
  'Depression', 'Dissociative Identity Disorder (DID)',
  'Eating Disorder', 'Generalized Anxiety Disorder (GAD)',
  'OCD (Obsessive-Compulsive Disorder)', 'PTSD',
  'Panic Disorder', 'Paranoid Personality Disorder',
  'Schizoaffective Disorder', 'Schizophrenia',
  'Social Anxiety Disorder', 'Somatic Symptom Disorder',
  'Substance Use Disorder', 'Narcissistic Personality Disorder (NPD)',
  'Histrionic Personality Disorder', 'Avoidant Personality Disorder',
  'Dependent Personality Disorder', 'Antisocial Personality Disorder',
  'Cyclothymia', 'Dysthymia (Persistent Depressive Disorder)'
];

export default function GettingToKnowPage() {
  const { user, updateUser, apiCall } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1); // 1 = parental scale, 2 = disorders
  const [scaleValue, setScaleValue] = useState(50);
  const [selectedDisorders, setSelectedDisorders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const identifiesAs = scaleValue <= 50 ? 'mom' : 'dad';
  const visibleWound = identifiesAs === 'mom' ? 'dad' : 'mom';
  const hiddenWound = identifiesAs === 'mom' ? 'mom' : 'dad';

  const toggleDisorder = (disorder) => {
    setSelectedDisorders(prev =>
      prev.includes(disorder) ? prev.filter(d => d !== disorder) : [...prev, disorder]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiCall('PUT', '/profile/getting-to-know', {
        parentalScaleResult: scaleValue,
        mentalDisorders: selectedDisorders
      });
      updateUser(data.user);
      navigate('/discover');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  // Background gradient shifts based on scale
  const momColor = 'rgba(253,121,168,0.12)';
  const dadColor = 'rgba(100,200,255,0.12)';
  const ratio = scaleValue / 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: `radial-gradient(ellipse 600px 400px at 50% 0, ${ratio < 0.5 ? momColor : dadColor}, transparent 70%), var(--bg)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '32px 24px', transition: 'background 0.5s'
    }}>
      <div style={{ width: '100%', maxWidth: 640 }} className="animate-fade-up">
        {/* Brand */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: 'var(--green)', marginBottom: 8 }}>
            Kind<span style={{ color: 'var(--text)', fontWeight: 400 }}>Match</span> 💚
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 4, borderRadius: 4,
              background: step >= 1 ? 'var(--green)' : 'var(--border)'
            }} />
            <div style={{
              width: 32, height: 4, borderRadius: 4,
              background: step >= 2 ? 'var(--green)' : 'var(--border)'
            }} />
          </div>
        </div>

        {/* Step 1: Parental Scale */}
        {step === 1 && (
          <div className="card animate-fade-in">
            <div style={{ marginBottom: 32 }}>
              <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600, letterSpacing: 2, marginBottom: 8 }}>GET TO KNOW YOU · 1 OF 2</div>
              <h2 style={{ fontSize: 28, marginBottom: 12 }}>who do you identify more as?</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.7 }}>
                drag the slider to show which parental energy you lean toward. no right answer here — this shapes who you connect with.
              </p>
            </div>

            {/* Scale */}
            <div style={{ marginBottom: 40 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 4 }}>🌸</div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--pink)' }}>Mom</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>nurturing, emotional</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 32, marginBottom: 4 }}>🏔️</div>
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: '#64c8ff' }}>Dad</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>stoic, structured</div>
                </div>
              </div>

              <div style={{ position: 'relative', padding: '8px 0' }}>
                <input
                  type="range" min={0} max={100} value={scaleValue}
                  onChange={e => setScaleValue(Number(e.target.value))}
                  style={{
                    width: '100%', height: 8, cursor: 'pointer',
                    WebkitAppearance: 'none', appearance: 'none',
                    background: `linear-gradient(to right, var(--pink) 0%, var(--pink) ${scaleValue}%, #64c8ff ${scaleValue}%, #64c8ff 100%)`,
                    borderRadius: 4, outline: 'none', border: 'none'
                  }}
                />
                <style>{`
                  input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 28px; height: 28px;
                    border-radius: 50%;
                    background: white;
                    border: 3px solid ${scaleValue <= 50 ? 'var(--pink)' : '#64c8ff'};
                    box-shadow: 0 2px 12px rgba(0,0,0,0.4);
                    cursor: pointer;
                    transition: border-color 0.3s;
                  }
                  input[type=range]::-moz-range-thumb {
                    width: 28px; height: 28px;
                    border-radius: 50%;
                    background: white;
                    border: 3px solid ${scaleValue <= 50 ? 'var(--pink)' : '#64c8ff'};
                    cursor: pointer;
                  }
                `}</style>
              </div>

              {/* Result display */}
              <div style={{
                marginTop: 24, padding: '20px 24px',
                background: 'var(--bg-elevated)', borderRadius: 16,
                border: `1px solid ${identifiesAs === 'mom' ? 'rgba(253,121,168,0.3)' : 'rgba(100,200,255,0.3)'}`,
                transition: 'border-color 0.3s'
              }}>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>based on your selection:</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4, letterSpacing: 1 }}>YOU IDENTIFY AS</div>
                    <div style={{
                      fontFamily: 'Syne', fontWeight: 700, fontSize: 16,
                      color: identifiesAs === 'mom' ? 'var(--pink)' : '#64c8ff'
                    }}>
                      {identifiesAs === 'mom' ? '🌸 Mom energy' : '🏔️ Dad energy'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4, letterSpacing: 1 }}>SCALE VALUE</div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16 }}>{scaleValue}/100</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4, letterSpacing: 1 }}>VISIBLE WOUND</div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--yellow)' }}>
                      {visibleWound === 'mom' ? '🌸 Mom wound' : '🏔️ Dad wound'}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 11, color: 'var(--text-dim)', marginBottom: 4, letterSpacing: 1 }}>HIDDEN WOUND</div>
                    <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 14, color: 'var(--purple)' }}>
                      {hiddenWound === 'mom' ? '🌸 Mom wound' : '🏔️ Dad wound'}
                    </div>
                  </div>
                </div>
              </div>

              <div style={{
                marginTop: 16, padding: '12px 16px',
                background: 'rgba(162,155,254,0.06)', borderRadius: 12,
                fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.7
              }}>
                💡 <strong style={{ color: 'var(--purple)' }}>how matching works:</strong> we pair people with <em>opposite visible wounds</em> and <em>opposite hidden wounds</em> — you attract what you need to heal, frfr.
              </div>
            </div>

            <button className="btn btn-primary btn-full" onClick={() => setStep(2)}>
              next up: mental health check →
            </button>
          </div>
        )}

        {/* Step 2: Mental Disorders */}
        {step === 2 && (
          <div className="card animate-fade-in">
            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 12, color: 'var(--green)', fontWeight: 600, letterSpacing: 2, marginBottom: 8 }}>GET TO KNOW YOU · 2 OF 2</div>
              <h2 style={{ fontSize: 24, marginBottom: 12 }}>have you been diagnosed with — or think you probably have — any of these?</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.7 }}>
                select all that apply. this is a safe space. this helps us match you with people who <em>get it</em>.
              </p>
            </div>

            {error && <div className="alert alert-error">⚠️ {error}</div>}

            {/* Disorders grid */}
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 8, marginBottom: 24, maxHeight: 400, overflowY: 'auto',
              paddingRight: 4
            }}>
              {MENTAL_DISORDERS.map(disorder => {
                const checked = selectedDisorders.includes(disorder);
                return (
                  <div
                    key={disorder}
                    className={`checkbox-item ${checked ? 'checked' : ''}`}
                    onClick={() => toggleDisorder(disorder)}
                  >
                    <div style={{
                      width: 18, height: 18, borderRadius: 4, flexShrink: 0,
                      border: `2px solid ${checked ? 'var(--green)' : 'var(--border-light)'}`,
                      background: checked ? 'var(--green)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.15s'
                    }}>
                      {checked && <span style={{ fontSize: 11, color: '#000', fontWeight: 700 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 13, lineHeight: 1.4 }}>{disorder}</span>
                  </div>
                );
              })}
            </div>

            {/* None option */}
            <div
              className={`checkbox-item ${selectedDisorders.length === 0 ? 'checked' : ''}`}
              onClick={() => setSelectedDisorders([])}
              style={{ marginBottom: 24, justifyContent: 'center', borderStyle: 'dashed' }}
            >
              <span style={{ fontSize: 14 }}>none of these apply to me (for now)</span>
            </div>

            {selectedDisorders.length > 0 && (
              <div style={{
                marginBottom: 20, padding: '10px 14px',
                background: 'rgba(0,255,135,0.06)', borderRadius: 10,
                fontSize: 13, color: 'var(--green)'
              }}>
                ✓ {selectedDisorders.length} selected: {selectedDisorders.slice(0, 3).join(', ')}{selectedDisorders.length > 3 ? ` +${selectedDisorders.length - 3} more` : ''}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-ghost" onClick={() => setStep(1)} style={{ flex: '0 0 auto' }}>
                ← back
              </button>
              <button
                className="btn btn-primary"
                onClick={handleSubmit}
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? 'saving...' : "let's find my kind 💚"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
