'use client';

import { useState, useRef, useEffect } from 'react';
import { useTheme, THEMES } from './ThemeProvider';

const themeKeys = Object.keys(THEMES);

export default function ThemeSwitcher() {
  const { theme, setTheme, mounted } = useTheme();
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Don't render until client-side hydration is done (prevents flash)
  if (!mounted) {
    return (
      <div style={{
        width: 36, height: 36, borderRadius: 10,
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '0.85rem', opacity: 0.5,
      }}>
        🎨
      </div>
    );
  }

  const currentTheme = THEMES[theme];

  return (
    <div style={{ position: 'relative' }} ref={panelRef}>
      <button
        onClick={() => setOpen(!open)}
        title={`Theme: ${currentTheme?.name || 'Default'}`}
        style={{
          width: 36, height: 36, borderRadius: 10,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.85rem', cursor: 'pointer', transition: 'all 0.2s',
          color: 'var(--text-primary)',
        }}
        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.background = 'var(--bg-card-hover)'; }}
        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-card)'; }}
      >
        {currentTheme?.icon || '🎨'}
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: '100%', marginTop: 8,
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 14, padding: 12, minWidth: 240,
          boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
          zIndex: 200,
          animation: 'fadeInUp 0.2s ease',
        }}>
          <div style={{
            fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)',
            textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 10, padding: '0 4px',
          }}>
            Choose Theme
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {themeKeys.map(key => {
              const t = THEMES[key];
              const isActive = key === theme;
              return (
                <button
                  key={key}
                  onClick={() => { setTheme(key); setOpen(false); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 12px', borderRadius: 10, cursor: 'pointer',
                    border: isActive ? '1px solid var(--accent)' : '1px solid transparent',
                    background: isActive ? 'rgba(99,102,241,0.08)' : 'transparent',
                    transition: 'all 0.15s',
                    width: '100%', textAlign: 'left',
                  }}
                  onMouseEnter={e => {
                    if (!isActive) e.currentTarget.style.background = 'var(--bg-card-hover)';
                  }}
                  onMouseLeave={e => {
                    if (!isActive) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  {/* Color swatches */}
                  <div style={{ display: 'flex', gap: 3, flexShrink: 0 }}>
                    {t.preview.map((color, i) => (
                      <div key={i} style={{
                        width: 14, height: 14, borderRadius: 4,
                        background: color,
                        border: i === 2 ? '1px solid var(--border)' : 'none',
                      }} />
                    ))}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '0.82rem', fontWeight: isActive ? 600 : 400,
                      color: isActive ? 'var(--accent-light)' : 'var(--text-primary)',
                    }}>
                      {t.icon} {t.name}
                    </div>
                  </div>
                  {isActive && (
                    <div style={{
                      width: 8, height: 8, borderRadius: '50%',
                      background: 'var(--accent)', flexShrink: 0,
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
