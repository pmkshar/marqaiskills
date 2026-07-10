'use client';

import { useState, useRef, useEffect } from 'react';
import { getAccessibleAgents, getAccessibleAgentCategories } from '../../lib/agents';

function AgentCard({ agent, onClick }) {
  return (
    <div
      onClick={() => onClick(agent)}
      style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: 24,
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = agent.color + '60'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'var(--border)'; }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${agent.color}, ${agent.color}88)` }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <span style={{ fontSize: '2rem' }}>{agent.icon}</span>
        <div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{agent.name}</div>
          <div style={{ fontSize: '0.75rem', color: agent.color, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{agent.type}</div>
        </div>
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>{agent.tagline}</p>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
        {agent.capabilities.slice(0, 3).map((cap, i) => (
          <span key={i} style={{ fontSize: '0.7rem', background: agent.color + '15', color: agent.color, padding: '3px 8px', borderRadius: 4 }}>
            {cap.length > 35 ? cap.slice(0, 35) + '...' : cap}
          </span>
        ))}
        {agent.capabilities.length > 3 && (
          <span style={{ fontSize: '0.7rem', background: 'var(--bg-primary)', color: 'var(--text-muted)', padding: '3px 8px', borderRadius: 4 }}>
            +{agent.capabilities.length - 3} more
          </span>
        )}
      </div>
    </div>
  );
}

function PromptPanel({ agent }) {
  const [promptText, setPromptText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [promptHistory, setPromptHistory] = useState([]);
  const outputRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // Focus input when agent changes
    if (inputRef.current) inputRef.current.focus();
    setPromptText('');
    setResponse(null);
    setPromptHistory([]);
  }, [agent.id]);

  useEffect(() => {
    // Auto-scroll output
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [response, isLoading]);

  const handleSubmit = async () => {
    if (!promptText.trim() || isLoading) return;

    const userPrompt = promptText.trim();
    setPromptText('');
    setIsLoading(true);
    setResponse(null);

    // Add to history
    setPromptHistory(prev => [...prev, { role: 'user', content: userPrompt, timestamp: new Date() }]);

    try {
      const res = await fetch('/api/agents/prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agentId: agent.id, prompt: userPrompt }),
      });

      const data = await res.json();

      if (data.success) {
        setPromptHistory(prev => [...prev, {
          role: 'agent',
          content: data.output,
          timestamp: new Date(data.timestamp),
          executionTime: data.executionTime,
          status: data.status,
        }]);
        setResponse(data);
      } else {
        setPromptHistory(prev => [...prev, {
          role: 'error',
          content: data.error || 'An error occurred',
          timestamp: new Date(),
        }]);
      }
    } catch (err) {
      setPromptHistory(prev => [...prev, {
        role: 'error',
        content: 'Network error. Please try again.',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const fillTemplate = (template) => {
    setPromptText(template);
    if (inputRef.current) inputRef.current.focus();
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Prompt Templates */}
      {promptHistory.length === 0 && !isLoading && (
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Try these prompts
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {agent.promptTemplates?.map((template, i) => (
              <button
                key={i}
                onClick={() => fillTemplate(template)}
                style={{
                  padding: '10px 14px',
                  background: 'var(--bg-primary)',
                  border: `1px solid var(--border)`,
                  borderRadius: 8,
                  color: 'var(--text-secondary)',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  lineHeight: 1.4,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = agent.color + '40';
                  e.currentTarget.style.background = agent.color + '08';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = 'var(--border)';
                  e.currentTarget.style.background = 'var(--bg-primary)';
                }}
              >
                <span style={{ color: agent.color, marginRight: 6 }}>▸</span>
                {template}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat History / Output Area */}
      <div
        ref={outputRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          marginBottom: 16,
          minHeight: 200,
          maxHeight: 400,
        }}
      >
        {promptHistory.length === 0 && !isLoading && (
          <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            color: 'var(--text-muted)',
          }}>
            <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{agent.icon}</div>
            <div style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 8 }}>
              {agent.name}
            </div>
            <div style={{ fontSize: '0.85rem' }}>
              Type a prompt below or select a template to see what this agent can do
            </div>
          </div>
        )}

        {promptHistory.map((entry, i) => (
          <div key={i} style={{ marginBottom: 16 }}>
            {entry.role === 'user' && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
                <div style={{
                  maxWidth: '80%',
                  padding: '10px 16px',
                  background: agent.color + '20',
                  border: `1px solid ${agent.color}30`,
                  borderRadius: '12px 12px 4px 12px',
                  color: 'var(--text-primary)',
                  fontSize: '0.88rem',
                  lineHeight: 1.5,
                }}>
                  {entry.content}
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4, textAlign: 'right' }}>
                    {formatTime(entry.timestamp)}
                  </div>
                </div>
              </div>
            )}

            {entry.role === 'agent' && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ maxWidth: '95%', width: '100%' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: '1rem' }}>{agent.icon}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: agent.color }}>{agent.name}</span>
                    {entry.executionTime && (
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg-primary)', padding: '2px 6px', borderRadius: 4 }}>
                        ⏱️ {entry.executionTime}
                      </span>
                    )}
                    <span style={{ fontSize: '0.7rem', color: '#10b981' }}>✅ {entry.status}</span>
                  </div>
                  <pre style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border)',
                    borderRadius: 10,
                    padding: 16,
                    fontSize: '0.82rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.7,
                    whiteSpace: 'pre-wrap',
                    overflow: 'auto',
                    fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', monospace",
                  }}>
                    {typeof entry.content === 'string' ? entry.content : JSON.stringify(entry.content, null, 2)}
                  </pre>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 4 }}>
                    {formatTime(entry.timestamp)}
                  </div>
                </div>
              </div>
            )}

            {entry.role === 'error' && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{
                  padding: '10px 16px',
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: 10,
                  color: '#ef4444',
                  fontSize: '0.85rem',
                }}>
                  ⚠️ {entry.content}
                </div>
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1rem' }}>{agent.icon}</span>
              <div style={{
                display: 'flex',
                gap: 4,
                padding: '12px 16px',
                background: 'var(--bg-primary)',
                border: '1px solid var(--border)',
                borderRadius: 10,
              }}>
                <span className="dot-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: agent.color, animation: 'pulse 1s ease-in-out infinite' }} />
                <span className="dot-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: agent.color, animation: 'pulse 1s ease-in-out 0.2s infinite' }} />
                <span className="dot-pulse" style={{ width: 8, height: 8, borderRadius: '50%', background: agent.color, animation: 'pulse 1s ease-in-out 0.4s infinite' }} />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                {agent.name} is processing...
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{
        display: 'flex',
        gap: 8,
        padding: '12px 0 0',
        borderTop: '1px solid var(--border)',
      }}>
        <textarea
          ref={inputRef}
          value={promptText}
          onChange={e => setPromptText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Ask ${agent.name} to do something... (Enter to send, Shift+Enter for new line)`}
          style={{
            flex: 1,
            padding: '12px 16px',
            background: 'var(--bg-primary)',
            border: `1px solid var(--border)`,
            borderRadius: 10,
            color: 'var(--text-primary)',
            fontSize: '0.88rem',
            outline: 'none',
            resize: 'none',
            minHeight: 44,
            maxHeight: 120,
            lineHeight: 1.5,
            fontFamily: 'inherit',
            transition: 'border-color 0.2s',
          }}
          onFocus={e => { e.target.style.borderColor = agent.color + '60'; }}
          onBlur={e => { e.target.style.borderColor = 'var(--border)'; }}
          rows={1}
        />
        <button
          onClick={handleSubmit}
          disabled={!promptText.trim() || isLoading}
          style={{
            padding: '12px 20px',
            background: promptText.trim() && !isLoading ? agent.color : 'var(--bg-card)',
            border: `1px solid ${promptText.trim() && !isLoading ? agent.color : 'var(--border)'}`,
            borderRadius: 10,
            color: promptText.trim() && !isLoading ? '#fff' : 'var(--text-muted)',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: promptText.trim() && !isLoading ? 'pointer' : 'not-allowed',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
          }}
        >
          {isLoading ? 'Running...' : 'Run ▸'}
        </button>
        {promptHistory.length > 0 && (
          <button
            onClick={() => { setPromptHistory([]); setResponse(null); }}
            style={{
              padding: '12px 14px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              color: 'var(--text-muted)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            title="Clear conversation"
          >
            🗑️
          </button>
        )}
      </div>
    </div>
  );
}

function AgentDetailModal({ agent, onClose }) {
  const [activeTab, setActiveTab] = useState('prompt');
  const [activeSampleIdx, setActiveSampleIdx] = useState(0);

  if (!agent) return null;

  const tabs = [
    { key: 'prompt', label: '💬 Prompt', highlight: true },
    { key: 'overview', label: 'Overview' },
    { key: 'capabilities', label: 'Capabilities' },
    { key: 'demo', label: 'Input/Output Demo' },
    { key: 'tools', label: 'Tools & Config' },
  ];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{ maxWidth: 960, padding: 0, overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{
          padding: '20px 28px',
          background: `linear-gradient(135deg, ${agent.color}15, ${agent.color}05)`,
          borderBottom: '1px solid var(--border)',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${agent.color}, ${agent.color}88)` }} />
          <button
            className="modal-close"
            onClick={onClose}
            style={{ position: 'absolute', top: 12, right: 12 }}
          >
            ✕ Close
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <span style={{ fontSize: '2.5rem' }}>{agent.icon}</span>
            <div>
              <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>{agent.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: '0.78rem', color: agent.color, fontWeight: 600, background: agent.color + '20', padding: '3px 10px', borderRadius: 6 }}>{agent.type}</span>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Category: {agent.category}</span>
              </div>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: 8, lineHeight: 1.5 }}>{agent.tagline}</p>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 28px', background: 'var(--bg-primary)' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '12px 18px', background: 'none', border: 'none',
                color: activeTab === tab.key ? agent.color : 'var(--text-muted)',
                fontSize: '0.82rem', fontWeight: activeTab === tab.key ? 600 : 400,
                cursor: 'pointer',
                borderBottom: activeTab === tab.key ? `2px solid ${agent.color}` : '2px solid transparent',
                transition: 'all 0.15s',
              }}
            >
              {tab.label}
              {tab.highlight && activeTab !== 'prompt' && (
                <span style={{
                  marginLeft: 6,
                  fontSize: '0.6rem',
                  background: agent.color,
                  color: '#fff',
                  padding: '1px 5px',
                  borderRadius: 8,
                  fontWeight: 700,
                }}>NEW</span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div style={{ padding: activeTab === 'prompt' ? '20px 28px 16px' : '24px 28px', maxHeight: '55vh', overflowY: 'auto' }}>
          {activeTab === 'prompt' && (
            <PromptPanel agent={agent} />
          )}

          {activeTab === 'overview' && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>Best For</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 24 }}>
                {agent.bestFor.map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--bg-primary)', borderRadius: 6 }}>
                    <span style={{ color: agent.color, fontSize: '0.8rem' }}>▸</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>{item}</span>
                  </div>
                ))}
              </div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>Description</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.7 }}>{agent.description}</p>
            </div>
          )}

          {activeTab === 'capabilities' && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>Capabilities</h3>
              {agent.capabilities.map((cap, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: agent.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', color: agent.color, fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>
                    {i + 1}
                  </div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>{cap}</div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'demo' && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>Sample Inputs & Outputs</h3>

              {/* Sample Input Selector */}
              {agent.sampleInputs.length > 1 && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
                  {agent.sampleInputs.map((sample, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveSampleIdx(i)}
                      style={{
                        padding: '8px 16px', fontSize: '0.8rem', cursor: 'pointer',
                        background: activeSampleIdx === i ? agent.color + '20' : 'var(--bg-primary)',
                        color: activeSampleIdx === i ? agent.color : 'var(--text-muted)',
                        border: `1px solid ${activeSampleIdx === i ? agent.color + '40' : 'var(--border)'}`,
                        borderRadius: 6, fontWeight: activeSampleIdx === i ? 600 : 400,
                      }}
                    >
                      {sample.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Input */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '2px 8px', borderRadius: 4 }}>INPUT</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{agent.sampleInputs[activeSampleIdx]?.label}</span>
                </div>
                <pre style={{
                  background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8,
                  padding: 16, fontSize: '0.85rem', color: 'var(--text-secondary)',
                  lineHeight: 1.6, whiteSpace: 'pre-wrap', overflow: 'auto',
                }}>
                  {agent.sampleInputs[activeSampleIdx]?.input}
                </pre>
              </div>

              {/* Output */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#10b981', background: 'rgba(16,185,129,0.1)', padding: '2px 8px', borderRadius: 4 }}>OUTPUT</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{agent.sampleOutputs[0]?.label}</span>
                </div>
                <pre style={{
                  background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: 8,
                  padding: 16, fontSize: '0.82rem', color: 'var(--text-secondary)',
                  lineHeight: 1.7, whiteSpace: 'pre-wrap', overflow: 'auto', maxHeight: 400,
                }}>
                  {agent.sampleOutputs[0]?.output}
                </pre>
              </div>
            </div>
          )}

          {activeTab === 'tools' && (
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 16, color: 'var(--text-primary)' }}>Available Tools</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 24 }}>
                {agent.tools.map(tool => (
                  <span key={tool} style={{
                    fontSize: '0.85rem', color: 'var(--accent-light)',
                    background: 'rgba(99,102,241,0.1)', padding: '6px 14px', borderRadius: 8,
                    fontFamily: 'monospace', fontWeight: 500,
                  }}>
                    {tool}
                  </span>
                ))}
              </div>

              <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 12, color: 'var(--text-primary)' }}>Configuration</h3>
              <div style={{ background: 'var(--bg-primary)', borderRadius: 8, border: '1px solid var(--border)', padding: 16 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Skill Name</td>
                      <td style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--text-primary)', fontFamily: 'monospace' }}>{agent.id}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Type</td>
                      <td style={{ padding: '8px 12px', fontSize: '0.85rem', color: agent.color }}>{agent.type}</td>
                    </tr>
                    <tr style={{ borderBottom: '1px solid var(--border)' }}>
                      <td style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category</td>
                      <td style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{agent.category}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Capabilities</td>
                      <td style={{ padding: '8px 12px', fontSize: '0.85rem', color: 'var(--text-primary)' }}>{agent.capabilities.length} defined</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AgentsClient({ userRole, canEdit }) {
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [search, setSearch] = useState('');

  // Role-based filtering
  const accessibleAgents = getAccessibleAgents(userRole);
  const accessibleCategories = getAccessibleAgentCategories(userRole);

  const filteredAgents = accessibleAgents.filter(agent => {
    if (filterCategory !== 'all' && agent.category !== filterCategory) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return (
        agent.name.toLowerCase().includes(q) ||
        agent.type.toLowerCase().includes(q) ||
        agent.description.toLowerCase().includes(q) ||
        agent.tagline.toLowerCase().includes(q) ||
        agent.capabilities.some(c => c.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const groupedAgents = {};
  for (const agent of filteredAgents) {
    if (!groupedAgents[agent.category]) groupedAgents[agent.category] = [];
    groupedAgents[agent.category].push(agent);
  }

  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            🤖 Marq AI Agents
          </h1>
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, color: '#10b981',
            background: 'rgba(16,185,129,0.1)', padding: '4px 10px', borderRadius: 6,
            letterSpacing: '0.5px',
          }}>
            INTERACTIVE
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 8, lineHeight: 1.6 }}>
          Production-ready AI agents with specialized capabilities. Click any agent to open the <strong style={{ color: 'var(--text-primary)' }}>Prompt tab</strong> and interact with it live — see what each agent can do with real simulated outputs.
        </p>
      </div>

      {/* Stats Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap', alignItems: 'center' }}>
        {Object.entries(accessibleCategories).map(([cat, meta]) => {
          const count = (groupedAgents[cat] || []).length;
          return (
            <div
              key={cat}
              onClick={() => setFilterCategory(filterCategory === cat ? 'all' : cat)}
              style={{
                padding: '10px 18px', borderRadius: 10, cursor: 'pointer',
                background: filterCategory === cat ? meta.color + '15' : 'var(--bg-card)',
                border: `1px solid ${filterCategory === cat ? meta.color + '40' : 'var(--border)'}`,
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '1.1rem', marginRight: 6 }}>{meta.icon}</span>
              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: filterCategory === cat ? meta.color : 'var(--text-primary)' }}>{cat}</span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 6 }}>({count})</span>
            </div>
          );
        })}
        <div
          onClick={() => setFilterCategory('all')}
          style={{
            padding: '10px 18px', borderRadius: 10, cursor: 'pointer',
            background: filterCategory === 'all' ? 'rgba(99,102,241,0.15)' : 'var(--bg-card)',
            border: `1px solid ${filterCategory === 'all' ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`,
          }}
        >
          <span style={{ fontSize: '0.82rem', fontWeight: 600, color: filterCategory === 'all' ? 'var(--accent-light)' : 'var(--text-primary)' }}>All</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginLeft: 6 }}>({accessibleAgents.length})</span>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 32 }}>
        <input
          className="search-input"
          type="text"
          placeholder="Search agents by name, type, or capability..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ width: '100%', maxWidth: 500, paddingLeft: 16 }}
        />
      </div>

      {/* Agent Cards by Category */}
      {Object.entries(groupedAgents).map(([category, catAgents]) => (
        <div key={category} style={{ marginBottom: 40 }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            marginBottom: 16, paddingBottom: 10,
            borderBottom: '1px solid var(--border)',
          }}>
            <span style={{ fontSize: '1.3rem' }}>{accessibleCategories[category]?.icon}</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)' }}>{category}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: accessibleCategories[category]?.color + '15', padding: '2px 8px', borderRadius: 6 }}>
              {catAgents.length} agent{catAgents.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: 16,
          }}>
            {catAgents.map(agent => (
              <AgentCard key={agent.id} agent={agent} onClick={setSelectedAgent} />
            ))}
          </div>
        </div>
      ))}

      {filteredAgents.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 16 }}>🔍</div>
          <div>No agents found matching your search</div>
          <div style={{ fontSize: '0.85rem', marginTop: 8 }}>Your role may restrict access to some agent categories</div>
        </div>
      )}

      {/* Agent Detail Modal */}
      {selectedAgent && (
        <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </div>
  );
}
