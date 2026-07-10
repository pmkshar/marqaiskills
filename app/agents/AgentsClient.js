'use client';

import { useState } from 'react';
import { AGENTS, AGENT_CATEGORIES, getAgentsByCategory } from '../../lib/agents';

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

function AgentDetailModal({ agent, onClose }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [activeSampleIdx, setActiveSampleIdx] = useState(0);
  
  if (!agent) return null;
  
  const tabs = [
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
        style={{ maxWidth: 900, padding: 0, overflow: 'hidden' }}
      >
        {/* Header */}
        <div style={{
          padding: '24px 32px',
          background: `linear-gradient(135deg, ${agent.color}15, ${agent.color}05)`,
          borderBottom: '1px solid var(--border)',
          position: 'relative',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${agent.color}, ${agent.color}88)` }} />
          <button
            className="modal-close"
            onClick={onClose}
            style={{ position: 'absolute', top: 16, right: 16 }}
          >
            &#x2715; Close
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ fontSize: '3rem' }}>{agent.icon}</span>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>{agent.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                <span style={{ fontSize: '0.8rem', color: agent.color, fontWeight: 600, background: agent.color + '20', padding: '3px 10px', borderRadius: 6 }}>{agent.type}</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Category: {agent.category}</span>
              </div>
            </div>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 12, lineHeight: 1.5 }}>{agent.description}</p>
        </div>
        
        {/* Tabs */}
        <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', padding: '0 32px' }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '14px 20px', background: 'none', border: 'none',
                color: activeTab === tab.key ? agent.color : 'var(--text-muted)',
                fontSize: '0.85rem', fontWeight: activeTab === tab.key ? 600 : 400,
                cursor: 'pointer',
                borderBottom: activeTab === tab.key ? `2px solid ${agent.color}` : '2px solid transparent',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Tab Content */}
        <div style={{ padding: '24px 32px', maxHeight: '50vh', overflowY: 'auto' }}>
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
  
  const agentsByCategory = getAgentsByCategory();
  
  const filteredAgents = AGENTS.filter(agent => {
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
  
  return (
    <div style={{ maxWidth: 1280, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
          🤖 Marq AI Agents
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: 8 }}>
          Production-ready AI agents with specialized capabilities. Click any agent to see what it can do with sample inputs and outputs.
        </p>
      </div>
      
      {/* Stats Bar */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
        {Object.entries(AGENT_CATEGORIES).map(([cat, meta]) => {
          const count = (agentsByCategory[cat] || []).length;
          return (
            <div
              key={cat}
              onClick={() => setFilterCategory(filterCategory === cat ? 'all' : cat)}
              style={{
                padding: '12px 20px', borderRadius: 10, cursor: 'pointer',
                background: filterCategory === cat ? meta.color + '15' : 'var(--bg-card)',
                border: `1px solid ${filterCategory === cat ? meta.color + '40' : 'var(--border)'}`,
                transition: 'all 0.2s',
              }}
            >
              <span style={{ fontSize: '1.2rem', marginRight: 8 }}>{meta.icon}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: filterCategory === cat ? meta.color : 'var(--text-primary)' }}>{cat}</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 8 }}>({count})</span>
            </div>
          );
        })}
        <div
          onClick={() => setFilterCategory('all')}
          style={{
            padding: '12px 20px', borderRadius: 10, cursor: 'pointer',
            background: filterCategory === 'all' ? 'rgba(99,102,241,0.15)' : 'var(--bg-card)',
            border: `1px solid ${filterCategory === 'all' ? 'rgba(99,102,241,0.4)' : 'var(--border)'}`,
          }}
        >
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: filterCategory === 'all' ? 'var(--accent-light)' : 'var(--text-primary)' }}>All</span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: 8 }}>({AGENTS.length})</span>
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
      
      {/* Agent Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
        gap: 20,
      }}>
        {filteredAgents.map(agent => (
          <AgentCard key={agent.id} agent={agent} onClick={setSelectedAgent} />
        ))}
      </div>
      
      {filteredAgents.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 16 }}>🔍</div>
          <div>No agents found matching your search</div>
        </div>
      )}
      
      {/* Agent Detail Modal */}
      {selectedAgent && (
        <AgentDetailModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
      )}
    </div>
  );
}
