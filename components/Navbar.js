'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';

const ROLE_BADGES = {
  admin: { label: 'Admin', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  manager: { label: 'Manager', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  editor: { label: 'Editor', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  viewer: { label: 'Viewer', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
};

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  
  const role = session?.user?.role;
  const badge = ROLE_BADGES[role] || ROLE_BADGES.viewer;
  
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)', padding: '0 24px',
      display: 'flex', alignItems: 'center', height: 60,
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <span style={{ fontSize: '1.2rem', fontWeight: 800, background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Marq AI
        </span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Skills Platform</span>
      </Link>
      
      <div style={{ flex: 1 }} />
      
      {status === 'loading' && (
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading...</span>
      )}
      
      {status === 'authenticated' && session?.user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Link href="/skills" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }}>
            Skills
          </Link>
          
          <Link href="/agents" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }}>
            Agents
          </Link>
          
          <Link href="/ai-directory" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }}>
            AI Directory
          </Link>
          
          {(role === 'admin' || role === 'manager') && (
            <Link href="/admin" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }}>
              Admin
            </Link>
          )}
          
          <Link href="/profile" style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textDecoration: 'none' }}>
            Profile
          </Link>
          
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 8, padding: '6px 12px', cursor: 'pointer', color: 'var(--text-primary)',
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: '50%', background: badge.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: badge.color,
              }}>
                {session.user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span style={{ fontSize: '0.85rem' }}>{session.user.name}</span>
              <span style={{
                fontSize: '0.65rem', fontWeight: 600, color: badge.color,
                background: badge.bg, padding: '2px 6px', borderRadius: 4,
              }}>
                {badge.label}
              </span>
            </button>
            
            {menuOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '100%', marginTop: 8,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 8, minWidth: 180, overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}>
                <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{session.user.email}</div>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/auth/login' }); }}
                  style={{
                    width: '100%', padding: '10px 16px', background: 'none', border: 'none',
                    color: '#ef4444', fontSize: '0.85rem', cursor: 'pointer', textAlign: 'left',
                  }}
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
      
      {status === 'unauthenticated' && (
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/auth/login" style={{
            padding: '8px 16px', fontSize: '0.85rem', color: 'var(--text-secondary)',
            textDecoration: 'none', border: '1px solid var(--border)', borderRadius: 8,
          }}>
            Sign In
          </Link>
          <Link href="/auth/signup" style={{
            padding: '8px 16px', fontSize: '0.85rem', color: '#fff',
            textDecoration: 'none', background: 'var(--accent)', borderRadius: 8,
          }}>
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
