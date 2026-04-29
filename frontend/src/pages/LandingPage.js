import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

const MARQUEE_PILLS = [
  { text: 'opposite wounds attract', cls: 'tag tag-green' },
  { text: 'heal together, bloom together', cls: 'tag tag-purple' },
  { text: 'no kundli needed', cls: 'tag tag-pink' },
  { text: 'wound-based matching', cls: 'tag tag-green' },
  { text: 'not trauma bonding — wound healing', cls: 'tag tag-purple' },
  { text: 'genZ relationships, done right', cls: 'tag tag-pink' },
  { text: 'emotionally self-aware matching', cls: 'tag tag-green' },
  { text: 'same disorders, opposite wounds', cls: 'tag tag-purple' },
  { text: "it's the 21st century", cls: 'tag tag-pink' },
  { text: 'your kind exists', cls: 'tag tag-green' },
  { text: 'stop repeating the pattern', cls: 'tag tag-purple' },
  { text: 'hidden wounds, seen by the right person', cls: 'tag tag-pink' },
];

const WOUND_CARDS = [
  {
    icon: '🌸',
    title: 'mom wound',
    titleColor: 'var(--pink)',
    desc: "rooted in the nurturing parent. shapes how you receive love, ask for emotional safety, and set boundaries in relationships.",
    badge: 'EMOTIONAL ORIGIN',
    badgeBg: 'rgba(253,121,168,0.1)',
    badgeColor: 'var(--pink)',
    badgeBorder: 'rgba(253,121,168,0.2)',
    cardBorder: 'rgba(253,121,168,0.2)',
  },
  {
    icon: '🏔️',
    title: 'dad wound',
    titleColor: '#64c8ff',
    desc: "rooted in the structuring parent. shapes how you handle ambition, authority, validation, and your relationship with failure.",
    badge: 'STRUCTURAL ORIGIN',
    badgeBg: 'rgba(100,200,255,0.1)',
    badgeColor: '#64c8ff',
    badgeBorder: 'rgba(100,200,255,0.2)',
    cardBorder: 'rgba(100,200,255,0.2)',
  },
  {
    icon: '👁️',
    title: 'visible wound',
    titleColor: 'var(--yellow, #fbbf24)',
    desc: "the wound you act out. your go-to defence mechanism. the pattern others notice in you before you notice it yourself.",
    badge: 'SEEN BY OTHERS',
    badgeBg: 'rgba(251,191,36,0.1)',
    badgeColor: '#fbbf24',
    badgeBorder: 'rgba(251,191,36,0.2)',
    cardBorder: 'rgba(251,191,36,0.2)',
  },
  {
    icon: '🌑',
    title: 'hidden wound',
    titleColor: 'var(--purple)',
    desc: "the wound running you from the inside. the one you're still learning exists. the one the right partner gently, safely mirrors back.",
    badge: 'SEEN BY YOUR MATCH',
    badgeBg: 'rgba(162,155,254,0.1)',
    badgeColor: 'var(--purple)',
    badgeBorder: 'rgba(162,155,254,0.2)',
    cardBorder: 'rgba(162,155,254,0.2)',
  },
];

const MANIFESTO = [
  {
    num: '01', tag: 'THE PROBLEM',
    title: 'kundli matching is so last millennium.',
    titleColor: 'var(--pink)',
    body: "Your grandparents matched planets. You match trauma responses on dating apps and call it chemistry. Mars in the 7th house doesn't explain why you keep attracting the same emotionally unavailable person. Your wound does. And until you know which wound you're operating from, you'll keep calling the same person by a different name.",
  },
  {
    num: '02', tag: 'THE TRUTH',
    title: "trauma bonding feels like love. it's not.",
    titleColor: '#fbbf24',
    body: "When two people with the same unhealed wound find each other, it feels electric. Fated. Like you finally found someone who gets it. But two people bleeding from the same wound don't heal each other — they just keep reopening it. You need someone whose wound completes the circuit, not someone who mirrors your break.",
  },
  {
    num: '03', tag: 'THE SCIENCE',
    title: 'you carry two wounds. one visible. one hidden.',
    titleColor: 'var(--purple)',
    body: "From how you were parented — one parent's energy becomes your visible wound (the defence mechanism everyone can see) and the other becomes your hidden wound (the one driving you from the inside, the one you're still learning exists). Real healing happens when your hidden wound meets someone whose visible wound gently holds space for what yours couldn't say.",
  },
  {
    num: '04', tag: 'THE ANSWER',
    title: 'match opposites. heal together. bloom.',
    titleColor: 'var(--green)',
    body: "KindMatch pairs you with someone whose wounds complement yours, not collide with them. Add shared mental health patterns — because people who've lived similar experiences actually understand without a 3am explanation — and similar life stage, and you get a relationship that doesn't just feel good. It actually grows you both.",
  },
];

const FEATURES = [
  { num: '01', title: 'wound-based matching', color: 'var(--green)', desc: "we don't match your horoscope or your height. we match your healing — using your parental energy scale and the wounds you carry from it." },
  { num: '02', title: 'disorder solidarity', color: 'var(--pink)', desc: "people living with similar mental health patterns actually get it. we factor in what you're navigating so your match holds space, not confusion." },
  { num: '03', title: 'no toxic positivity', color: 'var(--purple)', desc: "\"just be happy\" isn't advice. we're built for people who know healing isn't linear and love isn't a fix — it's a companion for the work." },
  { num: '04', title: 'swipe left to match', color: '#64c8ff', desc: "yes, left is yes. we flipped it on purpose — because sometimes going against your reflex is exactly the point. frfr." },
];

const STEPS = [
  { num: '01', title: 'sign up, no fluff', desc: "name, country, what you do — or proudly don't do. unemployment is nullable, genuinely no judgment. then set a real password." },
  { num: '02', title: 'tell us who you lean toward', desc: "drag a scale from mom energy to dad energy. not about who's better — about which parental style shaped your emotional patterns more. the scale decides your wounds." },
  { num: '03', title: "check what you're living with", desc: "a checklist of 25 mental health patterns — diagnosed or just suspected. full spectrum, zero shame. this shapes who actually understands your world." },
  { num: '04', title: 'we run the algorithm', desc: "scores by: opposite hidden wound (highest priority), opposite visible wound, shared disorders, similar age, similar occupation. in that order. always." },
  { num: '05', title: 'swipe left to match, right to pass', desc: "yes, left is yes. we meant to do that. when you both swipe left — it's a KindMatch. two wounds, one circuit. bloom together." },
];

export default function LandingPage() {
  const revealRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => { if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  const addReveal = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(28px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      revealRefs.current.push(el);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', overflowX: 'hidden' }}>

      {/* ── Ambient glows ── */}
      <div style={{
        position: 'fixed', top: -200, left: '50%', transform: 'translateX(-50%)',
        width: 800, height: 600, pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(ellipse, rgba(0,255,135,0.06) 0%, transparent 70%)'
      }} />
      <div style={{
        position: 'fixed', bottom: -200, right: -200, width: 500, height: 500,
        borderRadius: '50%', pointerEvents: 'none', zIndex: 0,
        background: 'radial-gradient(circle, rgba(162,155,254,0.05) 0%, transparent 70%)'
      }} />

      {/* ── NAV ── */}
      <header className="landing-nav">
        <span style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(17px,4vw,22px)', color: 'var(--green)', letterSpacing: '-0.5px' }}>
          Kind<span style={{ color: 'var(--text)', fontWeight: 400 }}>Match</span> 💚
        </span>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link to="/signin" className="btn btn-ghost" style={{ fontSize: 13, padding: '9px 18px' }}>sign in</Link>
          <Link to="/signup" className="btn btn-primary" style={{ fontSize: 13, padding: '9px 18px', fontWeight: 700 }}>get started</Link>
        </div>
      </header>

      {/* ── HERO ── */}
      <section style={{ paddingTop: 120, textAlign: 'center', padding: '120px 24px 80px', position: 'relative', zIndex: 1 }}>
        <div className="animate-fade-up">
          {/* Eyebrow */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(0,255,135,0.09)', border: '1px solid rgba(0,255,135,0.22)',
            borderRadius: 100, padding: '6px 18px', marginBottom: 32,
            fontSize: 13, color: 'var(--green)', fontWeight: 500
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--green)', display: 'inline-block' }} />
            not your parents' dating app
          </div>

          {/* H1 */}
          <h1 style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 'clamp(42px, 7vw, 80px)',
            lineHeight: 1.05, letterSpacing: '-2px', marginBottom: 28
          }}>
            stop{' '}
            <span style={{ textDecoration: 'line-through', opacity: 0.3, fontWeight: 400 }}>trauma bonding</span>
            .<br />
            start <span style={{ color: 'var(--green)' }}>healing together</span>.
          </h1>

          {/* Sub */}
          <p style={{
            fontSize: 'clamp(16px, 2.2vw, 20px)', color: 'var(--text-muted)',
            maxWidth: 600, margin: '0 auto 48px', lineHeight: 1.8, fontWeight: 300
          }}>
            Still matching <strong style={{ color: 'var(--text)', fontWeight: 500 }}>kundli</strong> for love? It's the 21st century.<br />
            You can't heal in others what you can't heal in yourself —<br />
            so we match you on your <strong style={{ color: 'var(--text)', fontWeight: 500 }}>wounds</strong>, not your stars.
          </p>

          {/* CTA */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 80 }}>
            <Link to="/signup" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 36px', fontWeight: 700 }}>
              find my kind 💚
            </Link>
            <Link to="/signin" className="btn btn-outline" style={{ fontSize: 16, padding: '14px 36px' }}>
              already here?
            </Link>
          </div>

          {/* Trust bar */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, flexWrap: 'wrap',
            padding: '20px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)'
          }}>
            {[
              ['wound-based', 'matching'],
              ['no kundli', 'required'],
              ['genZ', 'first'],
              ['swipe left', 'to match'],
            ].map(([strong, rest], i) => (
              <div key={i} style={{ fontSize: 13, color: 'var(--text-dim)', display: 'flex', gap: 5 }}>
                <strong style={{ color: 'var(--green)', fontWeight: 600 }}>{strong}</strong> {rest}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── MARQUEE ── */}
      <div style={{
        overflow: 'hidden', padding: '16px 0',
        borderBottom: '1px solid var(--border)',
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
        maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)',
      }}>
        <style>{`
          @keyframes km-marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
          .km-marquee-track { display: flex; gap: 14px; width: max-content; animation: km-marquee 30s linear infinite; }
          .km-marquee-track:hover { animation-play-state: paused; }
        `}</style>
        <div className="km-marquee-track">
          {[...MARQUEE_PILLS, ...MARQUEE_PILLS].map((p, i) => (
            <span key={i} className={p.cls} style={{ whiteSpace: 'nowrap', padding: '7px 18px', fontSize: 13 }}>
              {p.text}
            </span>
          ))}
        </div>
      </div>

      {/* ── MANIFESTO ── */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '80px 32px' }}>
        <div ref={addReveal} style={{ marginBottom: 60 }}>
          <span style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 500, display: 'block', marginBottom: 14 }}>
            the manifesto
          </span>
          <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-1px', lineHeight: 1.15 }}>
            we built kindmatch because<br />
            <em style={{ fontStyle: 'italic', color: 'var(--green)' }}>dating is broken.</em>
          </h2>
        </div>

        {MANIFESTO.map((m, i) => (
          <div key={i} ref={addReveal} style={{
            padding: '32px 0',
            borderBottom: i < MANIFESTO.length - 1 ? '1px solid var(--border)' : 'none',
          }}>
            <div className="manifesto-grid">
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 11, letterSpacing: 2, color: 'var(--text-dim)', paddingTop: 5, lineHeight: 1.8 }}>
                {m.num} ·<br />{m.tag}
              </div>
              <div>
                <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 'clamp(18px, 3vw, 26px)', lineHeight: 1.2, letterSpacing: '-0.5px', marginBottom: 10, color: m.titleColor }}>
                  {m.title}
                </h3>
                <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.8, fontWeight: 300 }}>
                  {m.body}
                </p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* ── WOUND MODEL ── */}
      <section style={{ borderTop: '1px solid var(--border)', padding: '80px 32px', textAlign: 'center' }}>
        <span ref={addReveal} style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 500, display: 'block', marginBottom: 12 }}>
          the framework
        </span>
        <h2 ref={addReveal} style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-1px', marginBottom: 12 }}>
          the wound model, explained
        </h2>
        <p ref={addReveal} style={{ color: 'var(--text-muted)', fontSize: 16, maxWidth: 480, margin: '0 auto 56px', lineHeight: 1.7 }}>
          every person carries two wound types. kindmatch uses both to find your person.
        </p>

        {/* Wound cards */}
        <div className="wound-cards-grid" style={{ maxWidth: 900, margin: '0 auto 64px' }}>
          {WOUND_CARDS.map((w, i) => (
            <div key={i} ref={addReveal} className="card" style={{
              textAlign: 'left', border: `1px solid ${w.cardBorder}`,
              transition: 'transform 0.2s'
            }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <span style={{ fontSize: 28, display: 'block', marginBottom: 14 }}>{w.icon}</span>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 8, color: w.titleColor }}>{w.title}</div>
              <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.65 }}>{w.desc}</p>
              <span style={{
                display: 'inline-block', marginTop: 16,
                fontSize: 10, fontWeight: 700, letterSpacing: 1.5, textTransform: 'uppercase',
                padding: '4px 12px', borderRadius: 100,
                background: w.badgeBg, color: w.badgeColor, border: `1px solid ${w.badgeBorder}`
              }}>{w.badge}</span>
            </div>
          ))}
        </div>

        {/* Match diagram */}
        <div ref={addReveal} style={{ maxWidth: 680, margin: '0 auto' }}>
          <div style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: 2, textTransform: 'uppercase', marginBottom: 20, textAlign: 'center' }}>
            a kindmatch pair — wounds complement, not collide
          </div>
          <div className="match-diagram">
            {/* Person A */}
            <div className="card" style={{ flex: 1, textAlign: 'center', padding: 24 }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%', margin: '0 auto 12px',
                background: 'var(--pink)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: '#000'
              }}>A</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Aarav</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)', textAlign: 'left' }}>
                  <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 }}>visible wound</div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#fbbf24' }}>🏔️ dad wound</div>
                </div>
                <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(162,155,254,0.08)', border: '1px solid rgba(162,155,254,0.15)', textAlign: 'left' }}>
                  <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 }}>hidden wound</div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--purple)' }}>🌸 mom wound</div>
                </div>
              </div>
            </div>

            {/* Connector */}
            <div className="match-diagram-connector">
              <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, transparent, var(--green), transparent)' }} />
              <div style={{ background: 'var(--green)', color: '#000', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 10, letterSpacing: 0.5, padding: '5px 10px', borderRadius: 100, whiteSpace: 'nowrap' }}>💚 kind match</div>
              <div style={{ width: 1, height: 36, background: 'linear-gradient(to bottom, var(--green), transparent)' }} />
            </div>

            {/* Person B */}
            <div className="card" style={{ flex: 1, textAlign: 'center', padding: 24 }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%', margin: '0 auto 12px',
                background: '#64c8ff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, color: '#000'
              }}>S</div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 16, marginBottom: 16 }}>Simran</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.15)', textAlign: 'left' }}>
                  <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 }}>visible wound</div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: '#fbbf24' }}>🌸 mom wound</div>
                </div>
                <div style={{ padding: '8px 12px', borderRadius: 10, background: 'rgba(162,155,254,0.08)', border: '1px solid rgba(162,155,254,0.15)', textAlign: 'left' }}>
                  <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 2 }}>hidden wound</div>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--purple)' }}>🏔️ dad wound</div>
                </div>
              </div>
            </div>
          </div>
          <p style={{ marginTop: 20, fontSize: 13, color: 'var(--text-dim)', textAlign: 'center', lineHeight: 1.7 }}>
            opposite visible wound + opposite hidden wound = two people who see<br />
            and gently hold each other's blindspots. that's a kindmatch.
          </p>
        </div>
      </section>

      {/* ── BIG QUOTE ── */}
      <section style={{
        padding: '100px 32px', textAlign: 'center',
        borderTop: '1px solid var(--border)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 700px 400px at 50% 50%, rgba(0,255,135,0.04), transparent)'
        }} />
        <p ref={addReveal} style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: 'clamp(26px, 4.5vw, 52px)',
          lineHeight: 1.2, letterSpacing: '-1.5px',
          maxWidth: 800, margin: '0 auto 24px', position: 'relative'
        }}>
          <span style={{ color: 'var(--green)', fontSize: '0.65em', verticalAlign: 'top', lineHeight: 1 }}>"</span>
          you can't heal in others<br />
          what you can't heal in yourself.<br />
          <span style={{ color: 'var(--green)' }}>but the right person makes you want to try.</span>
        </p>
        <div ref={addReveal} style={{ fontSize: 13, color: 'var(--text-dim)', position: 'relative' }}>
          — the kindmatch philosophy
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ borderTop: '1px solid var(--border)', padding: '80px 32px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <span style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 500, display: 'block', textAlign: 'center', marginBottom: 12 }}>
            why kindmatch
          </span>
          <h2 ref={addReveal} style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-1px', textAlign: 'center', marginBottom: 48 }}>
            not another swiping app
          </h2>
          <div className="features-grid" style={{ border: '1px solid var(--border)', borderRadius: 20, overflow: 'hidden' }}>
            {FEATURES.map((f, i) => (
              <div key={i} ref={addReveal} className="card-elevated"
                style={{ borderRadius: 0, border: 'none', borderRight: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '32px 28px', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-elevated)'}
                onMouseLeave={e => e.currentTarget.style.background = ''}
              >
                <div style={{ fontSize: 11, color: 'var(--text-dim)', letterSpacing: 2, marginBottom: 16 }}>{f.num}</div>
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 18, marginBottom: 10, color: f.color }}>{f.title}</div>
                <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section style={{ borderTop: '1px solid var(--border)', padding: '80px 32px' }} id="how">
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <span style={{ fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 500, display: 'block', textAlign: 'center', marginBottom: 12 }}>
            the process
          </span>
          <h2 ref={addReveal} style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 'clamp(28px, 4vw, 44px)', letterSpacing: '-1px', textAlign: 'center', marginBottom: 48 }}>
            how it works, no cap
          </h2>
          <div>
            {STEPS.map((s, i) => (
              <div key={i} ref={addReveal} style={{
                display: 'flex', gap: 28, padding: '32px 0',
                borderBottom: i < STEPS.length - 1 ? '1px solid var(--border)' : 'none',
                transition: 'padding-left 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.paddingLeft = '10px'}
                onMouseLeave={e => e.currentTarget.style.paddingLeft = '0'}
              >
                <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 12, color: 'var(--green)', minWidth: 32, paddingTop: 4, letterSpacing: 1 }}>
                  {s.num}
                </div>
                <div>
                  <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 19, marginBottom: 8 }}>{s.title}</div>
                  <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.75 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section style={{
        borderTop: '1px solid var(--border)',
        padding: '100px 32px', textAlign: 'center',
        background: 'var(--bg-card)', position: 'relative', overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(ellipse 600px 400px at 50% 0%, rgba(0,255,135,0.06), transparent)'
        }} />
        <h2 ref={addReveal} style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: 'clamp(36px, 6vw, 64px)',
          letterSpacing: '-2px', lineHeight: 1.05, marginBottom: 20, position: 'relative'
        }}>
          your kind is<br /><span style={{ color: 'var(--green)' }}>out there.</span>
        </h2>
        <p ref={addReveal} style={{ color: 'var(--text-muted)', fontSize: 17, maxWidth: 480, margin: '0 auto 44px', lineHeight: 1.7, position: 'relative' }}>
          not your trauma twin. your healing partner.
          someone whose wounds make yours finally make sense.
        </p>
        <Link to="/signup" ref={addReveal} className="btn btn-primary" style={{ fontSize: 16, padding: '16px 44px', fontWeight: 700, position: 'relative' }}>
          find my kind 💚
        </Link>
        <p ref={addReveal} style={{ marginTop: 20, fontSize: 12, color: 'var(--text-dim)', position: 'relative' }}>
          no kundli. no stars. just wounds — and the courage to heal them.
        </p>
      </section>

      {/* ── FOOTER ── */}
      <footer className="landing-footer" style={{
        padding: '24px 20px', borderTop: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
      }}>
        <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 17, color: 'var(--green)' }}>
          Kind<span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>Match</span> 💚
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-dim)' }}>
          © 2024 KindMatch · made with 💚 for the emotionally aware
        </div>
        <div className="landing-footer-links" style={{ display: 'flex', gap: 20 }}>
          {['privacy', 'terms', 'about', 'contact'].map(link => (
            <a key={link} href="#" style={{ fontSize: 13, color: 'var(--text-dim)', textDecoration: 'none' }}
              onMouseEnter={e => e.target.style.color = 'var(--green)'}
              onMouseLeave={e => e.target.style.color = 'var(--text-dim)'}
            >{link}</a>
          ))}
        </div>
      </footer>

    </div>
  );
}
