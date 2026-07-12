'use client';

import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeSwitcher from './ThemeSwitcher';

const ROLE_BADGES = {
  admin: { label: 'Admin', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' },
  manager: { label: 'Manager', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  editor: { label: 'Editor', color: '#3b82f6', bg: 'rgba(59,130,246,0.15)' },
  viewer: { label: 'Viewer', color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
};

function NavLink({ href, children, active }) {
  return (
    <Link href={href} style={{
      color: active ? 'var(--accent-light)' : 'var(--text-secondary)',
      fontSize: '0.82rem',
      textDecoration: 'none',
      padding: '6px 12px',
      borderRadius: 8,
      background: active ? 'rgba(99,102,241,0.1)' : 'transparent',
      transition: 'all 0.15s',
      fontWeight: active ? 600 : 400,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
    }}>
      {children}
    </Link>
  );
}

export default function Navbar() {
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const role = session?.user?.role;
  const badge = ROLE_BADGES[role] || ROLE_BADGES.viewer;
  
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'var(--nav-bg, rgba(10,10,15,0.9))', backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border)', padding: '0 24px',
      display: 'flex', alignItems: 'center', height: 60,
    }}>
      <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--gradient-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 800, color: '#fff' }}>M</div>
        <span style={{ fontSize: '1.15rem', fontWeight: 800, background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Marq AI
        </span>
        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 500, background: 'var(--bg-card)', padding: '2px 8px', borderRadius: 4, border: '1px solid var(--border)' }}>Skills</span>
      </Link>
      
      <div style={{ flex: 1 }} />
      
      {status === 'loading' && (
        <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Loading...</span>
      )}
      
      {status === 'authenticated' && session?.user && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'nowrap', overflowX: 'auto', maxWidth: 'calc(100vw - 280px)' }}>
          <NavLink href="/dashboard" active={pathname === '/dashboard'}>📊 Dashboard</NavLink>
          <NavLink href="/skills" active={pathname === '/skills'}>🧠 Skills</NavLink>
          <NavLink href="/agents" active={pathname === '/agents'}>🤖 Agents</NavLink>
          <NavLink href="/ai-directory" active={pathname === '/ai-directory'}>🌐 AI Directory</NavLink>
          <NavLink href="/ideas" active={pathname === '/ideas'}>💡 Ideas Lab</NavLink>

          {(role === 'admin' || role === 'manager') && (
            <NavLink href="/admin" active={pathname === '/admin'}>⚙️ Admin</NavLink>
          )}
          
          <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 8px' }} />

          {/* Theme Switcher */}
          <ThemeSwitcher />
          
          <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 8px' }} />

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 10, padding: '6px 12px', cursor: 'pointer', color: 'var(--text-primary)',
                transition: 'all 0.15s',
              }}
            >
              <div style={{
                width: 28, height: 28, borderRadius: 8, background: badge.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.75rem', fontWeight: 700, color: badge.color,
              }}>
                {session.user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <span style={{ fontSize: '0.82rem' }}>{session.user.name}</span>
              <span style={{
                fontSize: '0.6rem', fontWeight: 600, color: badge.color,
                background: badge.bg, padding: '2px 6px', borderRadius: 4,
              }}>
                {badge.label}
              </span>
            </button>
            
            {menuOpen && (
              <div style={{
                position: 'absolute', right: 0, top: '100%', marginTop: 8,
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 12, minWidth: 200, overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
              }}>
                <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: badge.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 700, color: badge.color }}>
                    {session.user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600 }}>{session.user.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{session.user.email}</div>
                  </div>
                </div>
                <div style={{ padding: '6px 8px' }}>
                  <Link href="/profile" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.82rem', transition: 'background 0.1s' }}>👤 Profile</Link>
                  <Link href="/dashboard" onClick={() => setMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 8, color: 'var(--text-secondary)', textDecoration: 'none', fontSize: '0.82rem', transition: 'background 0.1s' }}>📊 Dashboard</Link>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', padding: '6px 8px' }}>
                  <button
                    onClick={() => { setMenuOpen(false); signOut({ callbackUrl: '/auth/login' }); }}
                    style={{
                      width: '100%', padding: '8px 12px', background: 'none', border: 'none',
                      color: '#ef4444', fontSize: '0.82rem', cursor: 'pointer', textAlign: 'left',
                      borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8,
                    }}
                  >
                    🚪 Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {status === 'unauthenticated' && (
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <ThemeSwitcher />
          <div style={{ width: 1, height: 24, background: 'var(--border)', margin: '0 4px' }} />
          <Link href="/auth/login" style={{
            padding: '8px 18px', fontSize: '0.82rem', color: 'var(--text-secondary)',
            textDecoration: 'none', border: '1px solid var(--border)', borderRadius: 10,
            transition: 'all 0.15s',
          }}>
            Sign In
          </Link>
          <Link href="/auth/signup" style={{
            padding: '8px 18px', fontSize: '0.82rem', color: '#fff',
            textDecoration: 'none', background: 'var(--accent)', borderRadius: 10,
            fontWeight: 600, transition: 'all 0.15s',
          }}>
            Sign Up
          </Link>
        </div>
      )}
    </nav>
  );
}
