'use client';

export default function Error({ error, reset }) {
  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg-primary)',
      padding: 24,
    }}>
      <div style={{ 
        maxWidth: 480, 
        textAlign: 'center',
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 16,
        padding: 40,
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 16 }}>⚠️</div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
          Something went wrong
        </h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: 24 }}>
          An unexpected error occurred. This might be a temporary issue.
        </p>
        {error?.digest && (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginBottom: 16 }}>
            Error ID: {error.digest}
          </p>
        )}
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
          <button
            onClick={reset}
            style={{
              padding: '10px 24px',
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
          <a
            href="/auth/login"
            style={{
              padding: '10px 24px',
              background: 'var(--bg-card-hover)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              fontSize: '0.9rem',
              fontWeight: 600,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
            }}
          >
            Go to Login
          </a>
        </div>
      </div>
    </div>
  );
}
