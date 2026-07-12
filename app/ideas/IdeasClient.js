'use client';

import { useState, useRef, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const CATEGORY_COLORS = {
  'Frontend & UI': '#3b82f6',
  'Backend & API': '#10b981',
  'AI & ML Models': '#8b5cf6',
  'Data & Storage': '#f59e0b',
  'Infrastructure': '#64748b',
  'Testing & QA': '#ec4899',
  'Deployment & DevOps': '#f97316',
  'Security & Auth': '#ef4444',
  'Integration': '#14b8a6',
  'Monitoring': '#6366f1',
};

const PHASE_ICONS = {
  1: '📋',
  2: '🏗️',
  3: '🧠',
  4: '⚡',
  5: '🧪',
  6: '🚀',
  7: '📊',
};

function PhaseCard({ phase, index, isLast }) {
  const color = CATEGORY_COLORS[phase.category] || '#6366f1';
  const icon = PHASE_ICONS[(index % 7) + 1] || '📌';

  return (
    <div style={{ display: 'flex', gap: 16, position: 'relative' }}>
      {/* Timeline connector */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 36, flexShrink: 0 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: color + '18',
          border: `2px solid ${color}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', fontWeight: 700, color, position: 'relative', zIndex: 1,
        }}>
          {icon}
        </div>
        {!isLast && (
          <div style={{ width: 2, flex: 1, background: `linear-gradient(to bottom, ${color}60, ${color}10)`, marginTop: 4 }} />
        )}
      </div>

      {/* Phase content */}
      <div style={{
        flex: 1, marginBottom: isLast ? 0 : 24,
        background: 'var(--bg-card)', border: `1px solid ${color}20`,
        borderRadius: 12, padding: '18px 22px', position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: `linear-gradient(90deg, ${color}, ${color}40)` }} />

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color, background: color + '15', padding: '3px 8px', borderRadius: 5 }}>
              Phase {index + 1}
            </span>
            <span style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {phase.title}
            </span>
          </div>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: color + '10', padding: '3px 8px', borderRadius: 5, border: `1px solid ${color}20` }}>
            {phase.category}
          </span>
        </div>

        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 12 }}>
          {phase.description}
        </p>

        {/* Recommended tools */}
        {phase.tools && phase.tools.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
              Recommended Tools & Platforms
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {phase.tools.map((tool, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: '0.72rem', fontWeight: 500,
                  background: color + '10', color: color,
                  border: `1px solid ${color}20`,
                  padding: '3px 8px', borderRadius: 6,
                }}>
                  {tool.icon || '🔧'} {tool.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Models/Agents recommendation */}
        {phase.models && phase.models.length > 0 && (
          <div style={{ marginBottom: 10 }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
              AI Models & Agents
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {phase.models.map((model, i) => (
                <span key={i} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 4,
                  fontSize: '0.72rem', fontWeight: 500,
                  background: 'rgba(139,92,246,0.10)', color: '#8b5cf6',
                  border: '1px solid rgba(139,92,246,0.25)',
                  padding: '3px 8px', borderRadius: 6,
                }}>
                  🤖 {model.name}
                  {model.reason && <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginLeft: 2 }}>- {model.reason}</span>}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Key deliverables */}
        {phase.deliverables && phase.deliverables.length > 0 && (
          <div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6 }}>
              Key Deliverables
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {phase.deliverables.map((d, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                  <span style={{ color: '#10b981', fontSize: '0.65rem' }}>✓</span>
                  {d}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ArchitectureBlock({ arch }) {
  if (!arch) return null;
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '20px 24px', marginTop: 24,
    }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        🏛️ Recommended Architecture
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
        {arch.layers && arch.layers.map((layer, i) => (
          <div key={i} style={{
            background: CATEGORY_COLORS[layer.type] + '08',
            border: `1px solid ${CATEGORY_COLORS[layer.type]}25`,
            borderRadius: 8, padding: '12px 16px',
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: CATEGORY_COLORS[layer.type], textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
              {layer.type}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', fontWeight: 500, marginBottom: 4 }}>
              {layer.name}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {layer.description}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function CostEstimate({ costs }) {
  if (!costs) return null;
  return (
    <div style={{
      background: 'var(--bg-card)', border: '1px solid var(--border)',
      borderRadius: 12, padding: '20px 24px', marginTop: 16,
    }}>
      <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
        💰 Cost & Timeline Estimate
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 12 }}>
        {costs.items && costs.items.map((item, i) => (
          <div key={i} style={{
            background: 'var(--bg-primary)', borderRadius: 8, padding: '12px 16px',
            border: '1px solid var(--border)',
          }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 4 }}>
              {item.label}
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function IdeasClient() {
  const { data: session, status } = useSession();
  const userRole = session?.user?.role || 'viewer';
  const userName = session?.user?.name || 'User';
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const resultRef = useRef(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      window.location.href = '/auth/login';
    }
  }, [status]);

  // Show loading while session is being determined
  if (status === 'loading') {
    return (
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: 16 }}>💡</div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Loading Ideas Lab...</p>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  // Load history from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('marq-ai-ideas-history');
      if (saved) setHistory(JSON.parse(saved));
    } catch {}
  }, []);

  const analyzeIdea = async () => {
    if (!idea.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/ideas/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: idea.trim(), role: userRole }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Analysis failed');
      }

      setResult(data.plan);

      // Save to history
      const entry = {
        id: Date.now(),
        idea: idea.trim(),
        timestamp: new Date().toISOString(),
        summary: data.plan.summary || idea.trim().slice(0, 80),
      };
      const newHistory = [entry, ...history].slice(0, 20);
      setHistory(newHistory);
      try { localStorage.setItem('marq-ai-ideas-history', JSON.stringify(newHistory)); } catch {}

      // Scroll to results
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 300);

    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      analyzeIdea();
    }
  };

  const exampleIdeas = [
    'Build a customer support chatbot with multilingual support and knowledge base',
    'Create an AI-powered content writing platform with SEO optimization',
    'Build a real-time voice translation app for international meetings',
    'Develop an AI code review tool that detects bugs and suggests fixes',
    'Create an AI image generation marketplace for designers',
    'Build a predictive analytics dashboard for e-commerce sales forecasting',
    'Develop a medical document analysis system for hospitals',
    'Create an AI-powered personal finance advisor with investment insights',
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            💡 Ideas Lab
          </h1>
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, color: '#8b5cf6',
            background: 'rgba(139,92,246,0.1)', padding: '4px 10px', borderRadius: 6,
          }}>
            AI-POWERED
          </span>
          <span style={{
            fontSize: '0.68rem', fontWeight: 500, color: 'var(--text-muted)',
            background: 'var(--bg-card)', padding: '4px 10px', borderRadius: 6,
            border: '1px solid var(--border)',
          }}>
            Welcome, {userName} ({userRole})
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, maxWidth: 700 }}>
          Describe your app idea and our AI will generate a complete development plan — recommending the best AI platforms, models, agents, and step-by-step implementation roadmap.
        </p>
      </div>

      {/* Idea Input Section */}
      <div style={{
        background: 'var(--bg-card)', border: '1px solid var(--border)',
        borderRadius: 16, padding: '28px 32px', marginBottom: 24,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: 'linear-gradient(90deg, #8b5cf6, #3b82f6, #10b981)' }} />

        <div style={{ marginBottom: 16 }}>
          <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', display: 'block', marginBottom: 8 }}>
            Describe your idea
          </label>
          <textarea
            value={idea}
            onChange={e => setIdea(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Build an AI-powered customer support chatbot that handles multilingual queries, integrates with our knowledge base, and escalates complex issues to human agents..."
            style={{
              width: '100%', minHeight: 140, padding: '14px 18px',
              fontSize: '0.88rem', lineHeight: 1.6,
              background: 'var(--bg-primary)', color: 'var(--text-primary)',
              border: '1px solid var(--border)', borderRadius: 12,
              resize: 'vertical', outline: 'none',
              fontFamily: 'inherit',
              transition: 'border-color 0.2s',
            }}
            onFocus={e => e.target.style.borderColor = '#8b5cf6'}
            onBlur={e => e.target.style.borderColor = 'var(--border)'}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            {idea.length > 0 ? `${idea.length} characters` : 'Press Ctrl+Enter to analyze'} • Powered by Marq AI
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            {idea.length > 0 && (
              <button
                onClick={() => { setIdea(''); setResult(null); setError(null); }}
                style={{
                  padding: '10px 18px', borderRadius: 10, cursor: 'pointer',
                  background: 'var(--bg-primary)', border: '1px solid var(--border)',
                  color: 'var(--text-muted)', fontSize: '0.82rem',
                }}
              >
                Clear
              </button>
            )}
            <button
              onClick={analyzeIdea}
              disabled={!idea.trim() || loading}
              style={{
                padding: '10px 24px', borderRadius: 10, cursor: 'pointer',
                background: (!idea.trim() || loading) ? 'var(--bg-primary)' : 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                border: (!idea.trim() || loading) ? '1px solid var(--border)' : 'none',
                color: (!idea.trim() || loading) ? 'var(--text-muted)' : '#fff',
                fontSize: '0.88rem', fontWeight: 600,
                display: 'flex', alignItems: 'center', gap: 6,
                transition: 'all 0.2s',
              }}
            >
              {loading ? (
                <>
                  <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⚙️</span>
                  Analyzing...
                </>
              ) : (
                <>🚀 Analyze Idea</>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Example Ideas */}
      {!result && !loading && (
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 10 }}>
            Try an example
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 8 }}>
            {exampleIdeas.map((ex, i) => (
              <button
                key={i}
                onClick={() => setIdea(ex)}
                style={{
                  padding: '10px 14px', borderRadius: 10, cursor: 'pointer',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  color: 'var(--text-secondary)', fontSize: '0.78rem', textAlign: 'left',
                  transition: 'all 0.15s', lineHeight: 1.4,
                }}
                onMouseEnter={e => { e.target.style.borderColor = '#8b5cf640'; e.target.style.background = 'rgba(139,92,246,0.05)'; }}
                onMouseLeave={e => { e.target.style.borderColor = 'var(--border)'; e.target.style.background = 'var(--bg-card)'; }}
              >
                💡 {ex}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 12, padding: '16px 20px', marginBottom: 24,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: '1.1rem' }}>⚠️</span>
          <span style={{ fontSize: '0.85rem', color: '#ef4444' }}>{error}</span>
        </div>
      )}

      {/* Loading Animation */}
      {loading && (
        <div style={{
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 16, padding: '48px 32px', textAlign: 'center', marginBottom: 24,
        }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16, animation: 'pulse 2s infinite' }}>🧠</div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>
            Analyzing your idea...
          </h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto', lineHeight: 1.6 }}>
            Our AI is identifying the best platforms, models, and agents for your application. This typically takes 10-30 seconds.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
            {['Understanding requirements', 'Matching AI models', 'Designing architecture', 'Building roadmap'].map((step, i) => (
              <span key={i} style={{
                fontSize: '0.68rem', padding: '4px 10px', borderRadius: 6,
                background: i < 2 ? 'rgba(139,92,246,0.1)' : 'var(--bg-primary)',
                color: i < 2 ? '#8b5cf6' : 'var(--text-muted)',
                border: `1px solid ${i < 2 ? 'rgba(139,92,246,0.2)' : 'var(--border)'}`,
              }}>
                {i < 2 ? '✓' : '⏳'} {step}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {result && (
        <div ref={resultRef}>
          {/* Summary */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(139,92,246,0.08), rgba(59,130,246,0.08))',
            border: '1px solid rgba(139,92,246,0.2)',
            borderRadius: 16, padding: '24px 28px', marginBottom: 24,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span style={{ fontSize: '1.5rem' }}>🎯</span>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                Development Plan
              </h2>
              <span style={{
                fontSize: '0.68rem', fontWeight: 600, color: '#10b981',
                background: 'rgba(16,185,129,0.1)', padding: '3px 8px', borderRadius: 5,
                border: '1px solid rgba(16,185,129,0.2)',
              }}>
                AI Generated
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
              {result.summary}
            </p>

            {/* Quick stats */}
            {result.quickStats && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                {result.quickStats.map((stat, i) => (
                  <div key={i} style={{
                    background: 'var(--bg-card)', borderRadius: 8, padding: '10px 14px',
                    border: '1px solid var(--border)',
                  }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--accent-light)' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Architecture */}
          <ArchitectureBlock arch={result.architecture} />

          {/* Cost & Timeline */}
          <CostEstimate costs={result.costs} />

          {/* Step-by-step phases */}
          {result.phases && result.phases.length > 0 && (
            <div style={{ marginTop: 28 }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                📋 Step-by-Step Development Roadmap
              </h3>
              {result.phases.map((phase, i) => (
                <PhaseCard key={i} phase={phase} index={i} isLast={i === result.phases.length - 1} />
              ))}
            </div>
          )}

          {/* Key Risks & Tips */}
          {result.tips && result.tips.length > 0 && (
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 12, padding: '20px 24px', marginTop: 24,
            }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                💡 Pro Tips & Considerations
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {result.tips.map((tip, i) => (
                  <div key={i} style={{
                    display: 'flex', gap: 10, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6,
                    padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: 8,
                    border: '1px solid var(--border)',
                  }}>
                    <span style={{ color: '#f59e0b', fontSize: '0.85rem', flexShrink: 0 }}>⚡</span>
                    {tip}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 24, justifyContent: 'center' }}>
            <button
              onClick={() => { setResult(null); setIdea(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              style={{
                padding: '12px 24px', borderRadius: 10, cursor: 'pointer',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                color: 'var(--text-primary)', fontSize: '0.85rem', fontWeight: 500,
              }}
            >
              💡 New Idea
            </button>
            <button
              onClick={() => {
                const text = JSON.stringify(result, null, 2);
                navigator.clipboard.writeText(text).catch(() => {});
              }}
              style={{
                padding: '12px 24px', borderRadius: 10, cursor: 'pointer',
                background: 'linear-gradient(135deg, #8b5cf6, #3b82f6)',
                border: 'none', color: '#fff', fontSize: '0.85rem', fontWeight: 600,
              }}
            >
              📋 Copy Plan
            </button>
          </div>
        </div>
      )}

      {/* History sidebar */}
      {history.length > 0 && !loading && (
        <div style={{ marginTop: 40, borderTop: '1px solid var(--border)', paddingTop: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)' }}>
              📜 Recent Ideas
            </h3>
            <button
              onClick={() => { setHistory([]); try { localStorage.removeItem('marq-ai-ideas-history'); } catch {} }}
              style={{
                fontSize: '0.72rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer',
              }}
            >
              Clear
            </button>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {history.slice(0, 5).map(h => (
              <button
                key={h.id}
                onClick={() => setIdea(h.idea)}
                style={{
                  padding: '10px 14px', borderRadius: 8, cursor: 'pointer',
                  background: 'var(--bg-card)', border: '1px solid var(--border)',
                  color: 'var(--text-secondary)', fontSize: '0.78rem', textAlign: 'left',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => e.target.style.borderColor = '#8b5cf640'}
                onMouseLeave={e => e.target.style.borderColor = 'var(--border)'}
              >
                <div style={{ fontWeight: 500, marginBottom: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {h.summary}
                </div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                  {new Date(h.timestamp).toLocaleDateString()}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
