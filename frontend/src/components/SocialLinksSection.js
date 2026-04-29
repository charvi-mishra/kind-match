import React, { useState } from 'react';
import { RiInstagramLine, RiWhatsappLine, RiLinkM, RiCheckLine, RiCloseLine } from 'react-icons/ri';

// ── Validation ────────────────────────────────────────────────────
const IG_REGEX  = /^[a-zA-Z0-9._]{1,30}$/;
const WA_REGEX  = /^\+?[0-9]{7,15}$/;

function validateInstagram(val) {
  if (!val) return null;
  const handle = val.replace(/^@/, '').trim();
  if (!IG_REGEX.test(handle)) return 'Letters, numbers, dots and underscores only (max 30)';
  return null;
}

function validateWhatsapp(val) {
  if (!val) return null;
  const stripped = val.replace(/[\s\-().]/g, '');
  if (!WA_REGEX.test(stripped)) return 'Use international format e.g. +919876543210';
  return null;
}

const S = {
  card:        { background: '#111', border: '1px solid #1a1a1a', borderRadius: 16, padding: 24, marginTop: 24 },
  heading:     { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '1.1rem', color: '#fff', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 },
  row:         { display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 },
  iconWrap:    { width: 36, height: 36, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  igIcon:      { background: 'linear-gradient(135deg,#833ab4,#fd1d1d,#fcb045)' },
  waIcon:      { background: '#25D366' },
  inputWrap:   { flex: 1, position: 'relative' },
  input:       { width: '100%', background: '#0a0a0a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 14px', color: '#fff', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' },
  displayText: { flex: 1, color: '#ccc', fontFamily: 'DM Sans, sans-serif', fontSize: '0.95rem' },
  link:        { color: '#00ff87', textDecoration: 'none', fontWeight: 500 },
  empty:       { color: '#444', fontStyle: 'italic', fontSize: '0.9rem' },
  btnRow:      { display: 'flex', gap: 10, marginTop: 18, justifyContent: 'flex-end' },
  btnPrimary:  { background: '#00ff87', color: '#0a0a0a', border: 'none', borderRadius: 10, padding: '10px 22px', fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer' },
  btnSecondary:{ background: 'transparent', color: '#666', border: '1px solid #2a2a2a', borderRadius: 10, padding: '10px 18px', fontFamily: 'DM Sans, sans-serif', fontSize: '0.9rem', cursor: 'pointer' },
  fieldError:  { color: '#ff4d4d', fontSize: '0.8rem', marginTop: 4, display: 'flex', alignItems: 'center', gap: 4 },
  success:     { color: '#00ff87', fontSize: '0.85rem', marginTop: 10, display: 'flex', alignItems: 'center', gap: 4 },
};

export default function SocialLinksSection({ instagram = null, whatsapp = null, isOwner = false, onSave }) {
  const [editing, setEditing] = useState(false);
  const [igVal,   setIgVal]   = useState(instagram ?? '');
  const [waVal,   setWaVal]   = useState(whatsapp  ?? '');
  const [igTouched, setIgTouched] = useState(false);
  const [waTouched, setWaTouched] = useState(false);
  const [status,  setStatus]  = useState(null);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (!editing) { setIgVal(instagram ?? ''); setWaVal(whatsapp ?? ''); }
  }, [instagram, whatsapp, editing]);

  const igError = igTouched ? validateInstagram(igVal) : null;
  const waError = waTouched ? validateWhatsapp(waVal)  : null;

  const handleSave = async () => {
    setIgTouched(true); setWaTouched(true);
    const igErr = validateInstagram(igVal);
    const waErr = validateWhatsapp(waVal);
    if (igErr || waErr) return;

    setStatus(null); setLoading(true);
    try {
      const result = await onSave({
        instagram: igVal.replace(/^@/, '').trim() || null,
        whatsapp:  waVal.trim() || null,
      });
      if (result?.ok) { setStatus({ type: 'success', msg: 'Saved!' }); setEditing(false); }
      else            { setStatus({ type: 'error',   msg: result?.message ?? 'Something went wrong.' }); }
    } catch (e) {
      setStatus({ type: 'error', msg: e.message ?? 'Network error.' });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setIgVal(instagram ?? ''); setWaVal(whatsapp ?? '');
    setIgTouched(false); setWaTouched(false);
    setStatus(null); setEditing(false);
  };

  const hasAny = instagram || whatsapp;

  /* ── VIEW MODE ── */
  if (!editing) {
    return (
      <div style={S.card}>
        <div style={S.heading}>
          <RiLinkM size={18} /> Connect
          {isOwner && (
            <button onClick={() => setEditing(true)} style={{ ...S.btnSecondary, marginLeft: 'auto', padding: '6px 14px', fontSize: '0.8rem' }}>
              {hasAny ? 'Edit' : '+ Add'}
            </button>
          )}
        </div>

        <div style={S.row}>
          <div style={{ ...S.iconWrap, ...S.igIcon }}><RiInstagramLine size={18} color="#fff" /></div>
          <div style={S.displayText}>
            {instagram
              ? <a href={`https://instagram.com/${instagram}`} target="_blank" rel="noopener noreferrer" style={S.link}>@{instagram}</a>
              : <span style={S.empty}>No Instagram added</span>}
          </div>
        </div>

        <div style={S.row}>
          <div style={{ ...S.iconWrap, ...S.waIcon }}><RiWhatsappLine size={18} color="#fff" /></div>
          <div style={S.displayText}>
            {whatsapp
              ? <a href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" style={S.link}>{whatsapp}</a>
              : <span style={S.empty}>No WhatsApp added</span>}
          </div>
        </div>
      </div>
    );
  }

  /* ── EDIT MODE ── */
  return (
    <div style={S.card}>
      <div style={S.heading}><RiLinkM size={18} /> Connect</div>

      {/* Instagram */}
      <div style={S.row}>
        <div style={{ ...S.iconWrap, ...S.igIcon }}><RiInstagramLine size={18} color="#fff" /></div>
        <div style={S.inputWrap}>
          <input
            style={{ ...S.input, borderColor: igError ? '#ff4d4d' : undefined }}
            type="text" placeholder="your.handle  (no @)" maxLength={30}
            value={igVal}
            onChange={e => setIgVal(e.target.value)}
            onBlur={() => setIgTouched(true)}
            onFocus={e => (e.target.style.borderColor = '#00ff87')}
          />
          {igError && <div style={S.fieldError}><RiCloseLine size={12} /> {igError}</div>}
        </div>
      </div>

      {/* WhatsApp */}
      <div style={S.row}>
        <div style={{ ...S.iconWrap, ...S.waIcon }}><RiWhatsappLine size={18} color="#fff" /></div>
        <div style={S.inputWrap}>
          <input
            style={{ ...S.input, borderColor: waError ? '#ff4d4d' : undefined }}
            type="tel" placeholder="+91 9876543210" maxLength={20}
            value={waVal}
            onChange={e => setWaVal(e.target.value)}
            onBlur={() => setWaTouched(true)}
            onFocus={e => (e.target.style.borderColor = '#00ff87')}
          />
          {waError && <div style={S.fieldError}><RiCloseLine size={12} /> {waError}</div>}
        </div>
      </div>

      {status?.type === 'error'   && <div style={{ ...S.fieldError, marginTop: 8 }}><RiCloseLine size={14} /> {status.msg}</div>}
      {status?.type === 'success' && <div style={S.success}><RiCheckLine size={14} /> {status.msg}</div>}

      <div style={S.btnRow}>
        <button style={S.btnSecondary} onClick={handleCancel} disabled={loading}>Cancel</button>
        <button style={S.btnPrimary}   onClick={handleSave}   disabled={loading}>
          {loading ? 'Saving…' : 'Save'}
        </button>
      </div>
    </div>
  );
}
