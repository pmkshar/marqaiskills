'use client';

import { useSession } from 'next-auth/react';

const ROLE_COLORS = {
  admin: '#ef4444',
  manager: '#f59e0b',
  editor: '#3b82f6',
  viewer: '#10b981',
};

export default function ProfileClient({ user, roleInfo, accessibleCategories, accessibleSkillsCount, totalSkillsCount, permissions }) {
  const { data: session } = useSession();
  const currentUser = session?.user || user;
  const roleColor = ROLE_COLORS[currentUser.role] || '#6366f1';
  
  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '32px 24px' }}>
      {/* Profile Header */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16,
        padding: 32, textAlign: 'center', marginBottom: 24,
      }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', margin: '0 auto 16px',
          background: roleColor + '20', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2rem', fontWeight: 700, color: roleColor,
        }}>
          {currentUser.name?.charAt(0).toUpperCase()}
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{currentUser.name}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: 4 }}>{currentUser.email}</p>
        <div style={{ marginTop: 12 }}>
          <span style={{
            fontSize: '0.85rem', fontWeight: 600, color: roleColor,
            background: roleColor + '20', padding: '6px 16px', borderRadius: 8,
          }}>
            {roleInfo.label}
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 8 }}>{roleInfo.description}</p>
      </div>
      
      {/* Access Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-light)' }}>{accessibleSkillsCount}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>of {totalSkillsCount} skills accessible</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 20, textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-light)' }}>{accessibleCategories.length}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>of 10 categories accessible</div>
        </div>
      </div>
      
      {/* Accessible Categories */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16 }}>Accessible Categories</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {accessibleCategories.map(cat => (
            <span key={cat} style={{
              fontSize: '0.8rem', color: 'var(--text-secondary)',
              background: 'rgba(99,102,241,0.1)', padding: '6px 12px', borderRadius: 6,
            }}>
              {cat}
            </span>
          ))}
        </div>
      </div>
      
      {/* Permissions */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16 }}>Your Permissions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {Object.entries(permissions).map(([perm, has]) => (
            <div key={perm} style={{
              display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px',
              background: 'var(--bg-primary)', borderRadius: 6,
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: has ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)',
                color: has ? '#10b981' : '#ef4444',
                fontSize: '0.7rem', fontWeight: 700,
              }}>
                {has ? 'Y' : 'N'}
              </span>
              <span style={{
                fontSize: '0.8rem', fontFamily: 'monospace',
                color: has ? 'var(--text-primary)' : 'var(--text-muted)',
              }}>
                {perm}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
