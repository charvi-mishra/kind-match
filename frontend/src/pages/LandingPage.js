import React from 'react';
import { Link } from 'react-router-dom';

export default function LandingPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflow: 'hidden' }}>
      {/* Ambient background */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse 800px 600px at 50% -100px, rgba(0,255,135,0.08) 0%, transparent 70%)'
      }} />
      <div style={{
        position: 'fixed', bottom: -200, right: -200, width: 500, height: 500,
        borderRadius: '50%', pointerEvents: 'none',
        background: 'radial-gradient(circle, rgba(162,155,254,0.06) 0%, transparent 70%)'
      }} />

      {/* Nav */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        background: 'rgba(10,10,10,0.8)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--border)',
        padding: '0 40px', height: 64,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <span style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 20, color: 'var(--green)' }}>
          Kind<span style={{ color: 'var(--text)', fontWeight: 400 }}>Match</span> 💚
        </span>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/signin" className="btn btn-ghost" style={{ padding: '10px 20px', fontSize: 14 }}>Sign In</Link>
          <Link to="/signup" className="btn btn-primary" style={{ padding: '10px 20px', fontSize: 14 }}>Get Started</Link>
        </div>
      </header>

      {/* Hero */}
      <main style={{ paddingTop: 120, maxWidth: 900, margin: '0 auto', padding: '120px 24px 80px', textAlign: 'center' }}>
        <div className="animate-fade-up">
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,255,135,0.08)', border: '1px solid rgba(0,255,135,0.2)',
            borderRadius: 100, padding: '6px 16px', marginBottom: 32,
            fontSize: 13, color: 'var(--green)', fontWeight: 500
          }}>
            <span>✨</span> dating but make it self-aware
          </div>

          <h1 style={{ fontSize: 'clamp(48px, 8vw, 88px)', fontFamily: 'Syne', fontWeight: 800, lineHeight: 1.05, marginBottom: 24 }}>
            find your kind<br />
            <span style={{ color: 'var(--green)' }}>in genZ terms</span>
          </h1>

          <p style={{ fontSize: 18, color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto 48px', lineHeight: 1.8 }}>
            not just a pretty profile. we match you based on your <strong style={{ color: 'var(--text)' }}>wounds</strong>, your <strong style={{ color: 'var(--text)' }}>patterns</strong>, and the parts of you that actually matter.
          </p>

          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" className="btn btn-primary" style={{ fontSize: 16, padding: '16px 36px' }}>
              find my kind 💚
            </Link>
            <Link to="/signin" className="btn btn-outline" style={{ fontSize: 16, padding: '16px 36px' }}>
              already here?
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16, marginTop: 96
        }}>
          {[
            { icon: '🧠', title: 'wound-based matching', desc: 'we pair opposite visible & hidden wounds — because that\'s where the real chemistry lives' },
            { icon: '💊', title: 'disorder solidarity', desc: 'similar mental health patterns mean actual understanding, not performative empathy' },
            { icon: '🌊', title: 'no toxic positivity', desc: 'we know you\'re not okay sometimes. and that\'s literally the point' },
          ].map((f, i) => (
            <div key={i} className="card" style={{ textAlign: 'left', animationDelay: `${i * 0.1}s` }} >
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <h3 style={{ fontFamily: 'Syne', fontSize: 16, marginBottom: 8, color: 'var(--green)' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</p>
            </div>
          ))}
        </div>

        {/* How it works */}
        <div style={{ marginTop: 96, textAlign: 'left' }}>
          <h2 style={{ fontFamily: 'Syne', fontSize: 32, marginBottom: 40, textAlign: 'center' }}>
            how it actually works
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {[
              { step: '01', label: 'sign up', desc: 'name, country, what you do (or don\'t do)' },
              { step: '02', label: 'get to know you', desc: 'mom-leaning or dad-leaning? what disorders hit different?' },
              { step: '03', label: 'we do the math', desc: 'opposite wounds + shared disorders = your kind' },
              { step: '04', label: 'swipe left to match', desc: 'left = yes, right = nah. we know, we know.' },
            ].map((s, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 16, padding: 20
              }}>
                <div style={{ fontFamily: 'Syne', fontSize: 11, color: 'var(--green)', marginBottom: 8, letterSpacing: 2 }}>
                  STEP {s.step}
                </div>
                <div style={{ fontFamily: 'Syne', fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{s.label}</div>
                <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div style={{ marginTop: 96, padding: '48px 32px', background: 'var(--bg-card)', borderRadius: 24, border: '1px solid var(--border)' }}>
          <h2 style={{ fontFamily: 'Syne', fontSize: 36, marginBottom: 12 }}>ready to find your kind?</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 32 }}>no cap, this might actually change things for you.</p>
          <Link to="/signup" className="btn btn-primary" style={{ fontSize: 16, padding: '16px 40px' }}>
            let's go 🚀
          </Link>
        </div>
      </main>

      <footer style={{ textAlign: 'center', padding: '32px 24px', color: 'var(--text-dim)', fontSize: 13, borderTop: '1px solid var(--border)' }}>
        © 2024 KindMatch · made with 💚 for the emotionally aware
      </footer>
    </div>
  );
}
