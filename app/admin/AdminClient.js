'use client';

import { useState } from 'react';
import { ROLES } from '../../lib/rbac';

const ROLE_COLORS = {
  admin: '#ef4444',
  manager: '#f59e0b',
  editor: '#3b82f6',
  viewer: '#10b981',
};

const STATUS_COLORS = {
  active: '#10b981',
  suspended: '#ef4444',
};

export default function AdminClient({ users: initialUsers, currentRole, currentUserId }) {
  const [users, setUsers] = useState(initialUsers);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formName, setFormName] = useState('');
  const [formEmail, setFormEmail] = useState('');
  const [formPassword, setFormPassword] = useState('');
  const [formRole, setFormRole] = useState('viewer');
  
  const canWrite = currentRole === 'admin' || currentRole === 'manager';
  const canDelete = currentRole === 'admin';
  
  const clearMessages = () => { setError(''); setSuccess(''); };
  
  const handleAddUser = async (e) => {
    e.preventDefault();
    clearMessages();
    
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: formName, email: formEmail, password: formPassword, role: formRole }),
      });
      const data = await res.json();
      
      if (!res.ok) { setError(data.error); return; }
      
      setUsers([...users, data.user]);
      setShowAddUser(false);
      setFormName(''); setFormEmail(''); setFormPassword(''); setFormRole('viewer');
      setSuccess(`User "${data.user.name}" created successfully`);
    } catch (err) {
      setError('Failed to create user');
    }
  };
  
  const handleUpdateRole = async (userId, newRole) => {
    clearMessages();
    
    // Managers can't assign admin role
    if (currentRole === 'manager' && newRole === 'admin') {
      setError('Managers cannot assign admin role');
      return;
    }
    
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole }),
      });
      const data = await res.json();
      
      if (!res.ok) { setError(data.error); return; }
      
      setUsers(users.map(u => u.id === userId ? data.user : u));
      setSuccess(`Role updated for "${data.user.name}"`);
      setEditingUser(null);
    } catch (err) {
      setError('Failed to update role');
    }
  };
  
  const handleToggleStatus = async (userId, currentStatus) => {
    clearMessages();
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active';
    
    try {
      const res = await fetch('/api/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, status: newStatus }),
      });
      const data = await res.json();
      
      if (!res.ok) { setError(data.error); return; }
      
      setUsers(users.map(u => u.id === userId ? data.user : u));
      setSuccess(`User ${newStatus === 'active' ? 'activated' : 'suspended'}`);
    } catch (err) {
      setError('Failed to update status');
    }
  };
  
  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete "${userName}"? This cannot be undone.`)) return;
    clearMessages();
    
    try {
      const res = await fetch(`/api/users?id=${userId}`, { method: 'DELETE' });
      const data = await res.json();
      
      if (!res.ok) { setError(data.error); return; }
      
      setUsers(users.filter(u => u.id !== userId));
      setSuccess(`User "${userName}" deleted`);
    } catch (err) {
      setError('Failed to delete user');
    }
  };
  
  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32, flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>User Management</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 4 }}>Manage users, roles, and permissions</p>
        </div>
        {canWrite && (
          <button
            onClick={() => { setShowAddUser(!showAddUser); clearMessages(); }}
            style={{
              padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none',
              borderRadius: 8, fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer',
            }}
          >
            + Add User
          </button>
        )}
      </div>
      
      {/* Messages */}
      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', fontSize: '0.875rem', marginBottom: 20 }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ padding: '12px 16px', background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 8, color: '#10b981', fontSize: '0.875rem', marginBottom: 20 }}>
          {success}
        </div>
      )}
      
      {/* Add User Form */}
      {showAddUser && (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16 }}>Create New User</h3>
          <form onSubmit={handleAddUser} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Name</label>
              <input type="text" value={formName} onChange={e => setFormName(e.target.value)} required style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Email</label>
              <input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)} required style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Password</label>
              <input type="password" value={formPassword} onChange={e => setFormPassword(e.target.value)} required minLength={6} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: 6 }}>Role</label>
              <select value={formRole} onChange={e => setFormRole(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8, color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none' }}>
                {currentRole === 'admin' && <option value="admin">Administrator</option>}
                <option value="manager">Manager</option>
                <option value="editor">Editor</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 12 }}>
              <button type="submit" style={{ padding: '10px 20px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.9rem', cursor: 'pointer', fontWeight: 500 }}>Create User</button>
              <button type="button" onClick={() => setShowAddUser(false)} style={{ padding: '10px 20px', background: 'var(--bg-primary)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 8, fontSize: '0.9rem', cursor: 'pointer' }}>Cancel</button>
            </div>
          </form>
        </div>
      )}
      
      {/* Role Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {Object.entries(ROLES).map(([key, role]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: ROLE_COLORS[key], display: 'inline-block' }} />
            {role.label}: {role.permissions.length} permissions
          </div>
        ))}
      </div>
      
      {/* Users Table */}
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>User</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Role</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</th>
              <th style={{ padding: '14px 16px', textAlign: 'left', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Created</th>
              <th style={{ padding: '14px 16px', textAlign: 'right', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '14px 16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: '50%',
                      background: (ROLE_COLORS[user.role] || '#0d9488') + '20',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 700, color: ROLE_COLORS[user.role] || '#0d9488',
                    }}>
                      {user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 500 }}>{user.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {editingUser === user.id ? (
                    <select
                      defaultValue={user.role}
                      onChange={e => handleUpdateRole(user.id, e.target.value)}
                      onBlur={() => setEditingUser(null)}
                      style={{ padding: '6px 10px', background: 'var(--bg-primary)', border: '1px solid var(--accent)', borderRadius: 6, color: 'var(--text-primary)', fontSize: '0.8rem', outline: 'none' }}
                      autoFocus
                    >
                      {currentRole === 'admin' && <option value="admin">Administrator</option>}
                      <option value="manager">Manager</option>
                      <option value="editor">Editor</option>
                      <option value="viewer">Viewer</option>
                    </select>
                  ) : (
                    <span
                      onClick={() => canWrite && user.id !== currentUserId && setEditingUser(user.id)}
                      style={{
                        fontSize: '0.8rem', fontWeight: 600,
                        color: ROLE_COLORS[user.role] || '#0d9488',
                        background: (ROLE_COLORS[user.role] || '#0d9488') + '15',
                        padding: '4px 10px', borderRadius: 6,
                        cursor: canWrite && user.id !== currentUserId ? 'pointer' : 'default',
                      }}
                    >
                      {ROLES[user.role]?.label || user.role}
                    </span>
                  )}
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    fontSize: '0.8rem', fontWeight: 500,
                    color: STATUS_COLORS[user.status] || '#64748b',
                    background: (STATUS_COLORS[user.status] || '#64748b') + '15',
                    padding: '4px 10px', borderRadius: 6,
                  }}>
                    {user.status || 'active'}
                  </span>
                </td>
                <td style={{ padding: '14px 16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                    {canWrite && user.id !== currentUserId && (
                      <button
                        onClick={() => handleToggleStatus(user.id, user.status)}
                        style={{
                          padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer',
                          background: user.status === 'active' ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                          color: user.status === 'active' ? '#ef4444' : '#10b981',
                          border: `1px solid ${user.status === 'active' ? 'rgba(239,68,68,0.3)' : 'rgba(16,185,129,0.3)'}`,
                          borderRadius: 6, fontWeight: 500,
                        }}
                      >
                        {user.status === 'active' ? 'Suspend' : 'Activate'}
                      </button>
                    )}
                    {canDelete && user.id !== currentUserId && (
                      <button
                        onClick={() => handleDeleteUser(user.id, user.name)}
                        style={{
                          padding: '6px 12px', fontSize: '0.75rem', cursor: 'pointer',
                          background: 'rgba(239,68,68,0.1)', color: '#ef4444',
                          border: '1px solid rgba(239,68,68,0.3)', borderRadius: 6, fontWeight: 500,
                        }}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Permissions Reference */}
      <div style={{ marginTop: 32, background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: 24 }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: 16 }}>Permissions Reference</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {Object.entries(ROLES).map(([key, role]) => (
            <div key={key} style={{ background: 'var(--bg-primary)', borderRadius: 8, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: ROLE_COLORS[key] }} />
                <span style={{ fontWeight: 600, color: ROLE_COLORS[key], fontSize: '0.9rem' }}>{role.label}</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {role.permissions.map(p => (
                  <span key={p} style={{ fontSize: '0.7rem', background: 'rgba(13,148,136,0.1)', color: 'var(--text-secondary)', padding: '2px 6px', borderRadius: 4 }}>
                    {p}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
