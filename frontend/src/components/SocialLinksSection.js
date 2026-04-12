// src/components/SocialLinksSection.js
// Drop-in component — rendered inside any profile page.
// Handles edit / save / display entirely by itself.

import React, { useState } from 'react';

/* ─── tiny inline styles (no extra CSS file needed) ─────────── */
const S = {
  card: {
    background: '#111',
    border: '1px solid #1a1a1a',
    borderRadius: '16px',
    padding: '24px',
    marginTop: '24px',
  },
  heading: {
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: '1.1rem',
    color: '#fff',
    marginBottom: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '14px',
  },
  icon: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
  },
  igIcon: { background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)' },
  waIcon: { background: '#25D366' },
  input: {
    flex: 1,
    background: '#0a0a0a',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    padding: '10px 14px',
    color: '#fff',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '0.95rem',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  displayText: {
    flex: 1,
    color: '#ccc',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '0.95rem',
  },
  link: {
    color: '#00ff87',
    textDecoration: 'none',
    fontWeight: 500,
  },
  empty: {
    color: '#444',
    fontStyle: 'italic',
    fontSize: '0.9rem',
  },
  btnRow: {
    display: 'flex',
    gap: '10px',
    marginTop: '18px',
    justifyContent: 'flex-end',
  },
  btnPrimary: {
    background: '#00ff87',
    color: '#0a0a0a',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 22px',
    fontFamily: 'Syne, sans-serif',
    fontWeight: 800,
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  btnSecondary: {
    background: 'transparent',
    color: '#666',
    border: '1px solid #2a2a2a',
    borderRadius: '10px',
    padding: '10px 18px',
    fontFamily: 'DM Sans, sans-serif',
    fontSize: '0.9rem',
    cursor: 'pointer',
  },
  error: {
    color: '#ff4d4d',
    fontSize: '0.85rem',
    marginTop: '10px',
    fontFamily: 'DM Sans, sans-serif',
  },
  success: {
    color: '#00ff87',
    fontSize: '0.85rem',
    marginTop: '10px',
    fontFamily: 'DM Sans, sans-serif',
  },
};

/* ─── component ──────────────────────────────────────────────── */

/**
 * Props
 * ─────
 * @param {string|null}  instagram      — current handle (no "@"), from user object
 * @param {string|null}  whatsapp       — current number (with or without "+")
 * @param {boolean}      isOwner        — true = show edit controls; false = view-only
 * @param {function}     onSave(data)   — async fn; receives { instagram, whatsapp }
 *                                        should call PUT /api/profile/social-links
 *                                        and return { ok: bool, message?: string }
 */
export default function SocialLinksSection({
  instagram = null,
  whatsapp = null,
  isOwner = false,
  onSave,
}) {
  const [editing, setEditing]   = useState(false);
  const [igVal,   setIgVal]     = useState(instagram ?? '');
  const [waVal,   setWaVal]     = useState(whatsapp  ?? '');
  const [status,  setStatus]    = useState(null); // { type: 'error'|'success', msg }
  const [loading, setLoading]   = useState(false);

  /* sync if parent re-renders with fresh data */
  React.useEffect(() => {
    if (!editing) {
      setIgVal(instagram ?? '');
      setWaVal(whatsapp  ?? '');
    }
  }, [instagram, whatsapp, editing]);

  const handleSave = async () => {
    setStatus(null);
    setLoading(true);
    try {
      const result = await onSave({
        instagram: igVal.replace(/^@/, '').trim() || null,
        whatsapp:  waVal.trim() || null,
      });
      if (result?.ok) {
        setStatus({ type: 'success', msg: 'Saved! 💚' });
        setEditing(false);
      } else {
        setStatus({ type: 'error', msg: result?.message ?? 'Something went wrong.' });
      }
    } catch (e) {
      setStatus({ type: 'error', msg: e.message ?? 'Network error.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIgVal(instagram ?? '');
    setWaVal(whatsapp  ?? '');
    setStatus(null);
    setEditing(false);
  };

  /* ── VIEW MODE ─────────────────────────────────────────────── */
  const hasAny = instagram || whatsapp;

  if (!editing) {
    return (
      <div style={S.card}>
        <div style={S.heading}>
          🔗 Connect
          {isOwner && (
            <button
              onClick={() => setEditing(true)}
              style={{ ...S.btnSecondary, marginLeft: 'auto', padding: '6px 14px', fontSize: '0.8rem' }}
            >
              {hasAny ? 'Edit' : '+ Add'}
            </button>
          )}
        </div>

        {/* Instagram */}
        <div style={S.row}>
          <div style={{ ...S.icon, ...S.igIcon }}>📸</div>
          <div style={S.displayText}>
            {instagram ? (
              <a
                href={`https://instagram.com/${instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                style={S.link}
              >
                @{instagram}
              </a>
            ) : (
              <span style={S.empty}>No Instagram added</span>
            )}
          </div>
        </div>

        {/* WhatsApp */}
        <div style={S.row}>
          <div style={{ ...S.icon, ...S.waIcon }}>💬</div>
          <div style={S.displayText}>
            {whatsapp ? (
              <a
                href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                style={S.link}
              >
                {whatsapp}
              </a>
            ) : (
              <span style={S.empty}>No WhatsApp added</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  /* ── EDIT MODE (owner only) ────────────────────────────────── */
  return (
    <div style={S.card}>
      <div style={S.heading}>🔗 Connect</div>

      {/* Instagram input */}
      <div style={S.row}>
        <div style={{ ...S.icon, ...S.igIcon }}>📸</div>
        <input
          style={S.input}
          type="text"
          placeholder="your.handle  (no @)"
          maxLength={30}
          value={igVal}
          onChange={e => setIgVal(e.target.value)}
          onFocus={e => (e.target.style.borderColor = '#00ff87')}
          onBlur={e  => (e.target.style.borderColor = '#2a2a2a')}
        />
      </div>

      {/* WhatsApp input */}
      <div style={S.row}>
        <div style={{ ...S.icon, ...S.waIcon }}>💬</div>
        <input
          style={S.input}
          type="tel"
          placeholder="+91 98765 43210"
          maxLength={16}
          value={waVal}
          onChange={e => setWaVal(e.target.value)}
          onFocus={e => (e.target.style.borderColor = '#00ff87')}
          onBlur={e  => (e.target.style.borderColor = '#2a2a2a')}
        />
      </div>

      {/* feedback */}
      {status && (
        <div style={status.type === 'error' ? S.error : S.success}>
          {status.msg}
        </div>
      )}

      <div style={S.btnRow}>
        <button style={S.btnSecondary} onClick={handleCancel} disabled={loading}>
          Cancel
        </button>
        <button style={S.btnPrimary} onClick={handleSave} disabled={loading}>
          {loading ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}
