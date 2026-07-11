'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password');
    } else {
      router.push('/dashboard');
      router.refresh();
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', position: 'relative', overflow: 'hidden' }}>
      {/* Left side - Infographic */}
      <div style={{ flex: 1, position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(139,92,246,0.05) 50%, rgba(236,72,153,0.03) 100%)' }}>
        <div style={{ position: 'absolute', inset: 0 }}>
          <img src="/images/hero-dashboard.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.06 }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, padding: 48, maxWidth: 480 }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--gradient-1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#fff', marginBottom: 24, boxShadow: '0 4px 20px rgba(99,102,241,0.3)' }}>M</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.1, marginBottom: 16 }}>
            <span style={{ background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Marq AI</span>
            <br />
            <span style={{ color: 'var(--text-primary)' }}>Skills Platform</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.6, marginBottom: 32 }}>
            173+ production-ready AI skills, 9 intelligent agents, and 931 curated AI projects — all accessible through a role-based interface.
          </p>
          <div style={{ display: 'flex', gap: 24 }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>173+</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Skills</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>9</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Agents</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: 800, background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>931</div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Projects</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div style={{ width: 440, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border)', padding: 48 }}>
        <div style={{ width: '100%' }}>
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Welcome back</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Sign in to access the Skills Platform</p>
          </div>

          {error && (
            <div style={{ padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, color: '#ef4444', fontSize: '0.85rem', marginBottom: 20 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' }}
                placeholder="you@marqai.io"
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 6, fontWeight: 500 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={{ width: '100%', padding: '12px 16px', background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: '0.95rem', outline: 'none', transition: 'border-color 0.2s' }}
                placeholder="Enter password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', padding: '13px', background: 'var(--accent)', color: '#fff',
                border: 'none', borderRadius: 10, fontSize: '0.95rem', fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1,
                boxShadow: '0 4px 16px rgba(99,102,241,0.3)', transition: 'all 0.2s',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div style={{ marginTop: 24, textAlign: 'center', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Don&apos;t have an account?{' '}
            <a href="/auth/signup" style={{ color: 'var(--accent-light)', fontWeight: 500 }}>Sign up</a>
          </div>

          <div style={{ marginTop: 28, padding: 16, background: 'rgba(99,102,241,0.05)', borderRadius: 12, border: '1px solid rgba(99,102,241,0.12)' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Demo Accounts</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 2 }}>
              <div><span style={{ color: '#ef4444', fontWeight: 600 }}>Admin:</span> admin@marqai.io</div>
              <div><span style={{ color: '#f59e0b', fontWeight: 600 }}>Manager:</span> manager@marqai.io</div>
              <div><span style={{ color: '#3b82f6', fontWeight: 600 }}>Editor:</span> editor@marqai.io</div>
              <div><span style={{ color: '#10b981', fontWeight: 600 }}>Viewer:</span> viewer@marqai.io</div>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 6 }}>Password: <code style={{ background: 'rgba(99,102,241,0.1)', padding: '1px 4px', borderRadius: 3 }}>password</code></div>
          </div>
        </div>
      </div>
    </div>
  );
}
