'use client';

import { useState, useMemo, useEffect, useCallback } from 'react';

const CATEGORY_COLORS = {
  '1. Core Frameworks & Libraries': '#0d9488',
  '2. Model Codebases & Model Families': '#14b8a6',
  '3. Inference Engines & Serving': '#f59e0b',
  '4. Agentic AI & Multi-Agent Systems': '#ef4444',
  '5. Retrieval-Augmented Generation (RAG) & Knowledge': '#14b8a6',
  '6. Generative Media Tools': '#ec4899',
  '7. Training & Fine-tuning Ecosystem': '#f97316',
  '8. MLOps / LLMOps & Production': '#64748b',
  '9. Evaluation, Benchmarks & Datasets': '#3b82f6',
  '10. AI Safety, Alignment & Interpretability': '#dc2626',
  '11. Specialized Domains': '#059669',
  '12. User Interfaces & Self-hosted Platforms': '#7c3aed',
  '13. Developer Tools & Integrations': '#0284c7',
  '14. Resources & Learning': '#a21caf',
};

// ─── Capability Badge Definitions ───────────────────────────────
const CAPABILITIES = {
  Chat:      { icon: '💬', color: '#3b82f6', bg: 'rgba(59,130,246,0.10)', border: 'rgba(59,130,246,0.25)' },
  Voice:     { icon: '🎙️', color: '#14b8a6', bg: 'rgba(20,184,166,0.10)', border: 'rgba(20,184,166,0.25)' },
  Video:     { icon: '🎬', color: '#ef4444', bg: 'rgba(239,68,68,0.10)', border: 'rgba(239,68,68,0.25)' },
  Image:     { icon: '🎨', color: '#ec4899', bg: 'rgba(236,72,153,0.10)', border: 'rgba(236,72,153,0.25)' },
  Vision:    { icon: '👁️', color: '#f59e0b', bg: 'rgba(245,158,11,0.10)', border: 'rgba(245,158,11,0.25)' },
  Code:      { icon: '💻', color: '#10b981', bg: 'rgba(16,185,129,0.10)', border: 'rgba(16,185,129,0.25)' },
  Reasoning: { icon: '🧠', color: '#0d9488', bg: 'rgba(13,148,136,0.10)', border: 'rgba(13,148,136,0.25)' },
  Agents:    { icon: '🤖', color: '#f97316', bg: 'rgba(249,115,22,0.10)', border: 'rgba(249,115,22,0.25)' },
  Tools:     { icon: '🔧', color: '#64748b', bg: 'rgba(100,116,139,0.10)', border: 'rgba(100,116,139,0.25)' },
  Embeddings:{ icon: '📊', color: '#14b8a6', bg: 'rgba(20,184,166,0.10)', border: 'rgba(20,184,166,0.25)' },
};

// ─── Industry Badge Definitions ───────────────────────────────
const INDUSTRY_COLORS = {
  'Technology & Software': '#0d9488',
  'Healthcare & Life Sciences': '#EC4899',
  'Finance & Banking': '#F59E0B',
  'Retail & E-Commerce': '#EF4444',
  'Manufacturing & Supply Chain': '#06B6D4',
  'Education & Training': '#8B5CF6',
  'Telecommunications': '#3B82F6',
  'Energy & Utilities': '#F97316',
  'Media & Entertainment': '#A21CAF',
  'Legal & Compliance': '#64748B',
};

const INDUSTRY_ICONS = {
  'Technology & Software': '💻',
  'Healthcare & Life Sciences': '🏥',
  'Finance & Banking': '🏦',
  'Retail & E-Commerce': '🛒',
  'Manufacturing & Supply Chain': '🏭',
  'Education & Training': '🎓',
  'Telecommunications': '📡',
  'Energy & Utilities': '⚡',
  'Media & Entertainment': '🎬',
  'Legal & Compliance': '⚖️',
};

function CapBadge({ cap, small }) {
  const def = CAPABILITIES[cap];
  if (!def) return null;
  return (
    <span
      title={cap}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: small ? 2 : 4,
        fontSize: small ? '0.6rem' : '0.68rem',
        fontWeight: 500, color: def.color,
        background: def.bg,
        border: `1px solid ${def.border}`,
        padding: small ? '1px 5px' : '2px 7px',
        borderRadius: 5,
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
      }}
    >
      <span style={{ fontSize: small ? '0.55rem' : '0.65rem' }}>{def.icon}</span>
      {cap}
    </span>
  );
}

function IndustryBadge({ industry, small }) {
  const color = INDUSTRY_COLORS[industry] || '#64748B';
  const icon = INDUSTRY_ICONS[industry] || '🏢';
  const shortName = industry.split(' & ')[0];
  return (
    <span
      title={industry}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: small ? 2 : 4,
        fontSize: small ? '0.58rem' : '0.68rem',
        fontWeight: 500, color,
        background: color + '10',
        border: `1px solid ${color}25`,
        padding: small ? '1px 5px' : '2px 8px',
        borderRadius: 5,
        whiteSpace: 'nowrap',
        lineHeight: 1.4,
      }}
    >
      <span style={{ fontSize: small ? '0.52rem' : '0.65rem' }}>{icon}</span>
      {small ? shortName : industry}
    </span>
  );
}

function ProjectCard({ project, color, onClick }) {
  const [hovered, setHovered] = useState(false);
  const caps = project.capabilities || [];
  const industries = project.industry || [];
  return (
    <div
      onClick={() => onClick(project)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? 'var(--bg-card-hover)' : 'var(--bg-card)',
        border: `1px solid ${hovered ? color + '40' : 'var(--border)'}`,
        borderRadius: 10,
        padding: '14px 18px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: color }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{
            fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {project.name}
          </div>
          <div style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap', marginTop: 4 }}>
            <span style={{
              fontSize: '0.7rem', color, fontWeight: 500,
              background: color + '12', padding: '2px 6px', borderRadius: 3,
            }}>
              {project.subcategory}
            </span>
            {industries.slice(0, 2).map((ind, i) => (
              <IndustryBadge key={i} industry={ind} small />
            ))}
            {industries.length > 2 && (
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>+{industries.length - 2}</span>
            )}
          </div>
        </div>
        <a
          href={project.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={e => e.stopPropagation()}
          style={{ color: 'var(--text-muted)', fontSize: '0.8rem', flexShrink: 0, textDecoration: 'none' }}
          title="Open repository"
        >
          ↗
        </a>
      </div>
      <p style={{
        fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.45,
        marginTop: 8, display: '-webkit-box', WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical', overflow: 'hidden',
      }}>
        {project.description}
      </p>
      {/* Capability Badges */}
      {caps.length > 0 && (
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginTop: 8 }}>
          {caps.slice(0, 5).map(cap => <CapBadge key={cap} cap={cap} small />)}
          {caps.length > 5 && (
            <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', padding: '1px 4px', background: 'var(--bg-primary)', borderRadius: 3 }}>
              +{caps.length - 5}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  const color = CATEGORY_COLORS[project.category] || '#0d9488';
  const caps = project.capabilities || [];
  const industries = project.industry || [];
  if (!project) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: 720 }}>
        <button className="modal-close" onClick={onClose}>✕ Close</button>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: `linear-gradient(90deg, ${color}, ${color}88)` }} />
        
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>
            {project.name}
          </h2>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.75rem', color, fontWeight: 600, background: color + '15', padding: '3px 8px', borderRadius: 4 }}>
              {project.subcategory}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {project.category}
            </span>
          </div>
        </div>

        {/* Industries Section in Modal */}
        {industries.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Industries</h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {industries.map((ind, i) => <IndustryBadge key={i} industry={ind} />)}
            </div>
          </div>
        )}

        {/* Capabilities Section in Modal */}
        {caps.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Capabilities</h3>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {caps.map(cap => <CapBadge key={cap} cap={cap} />)}
            </div>
          </div>
        )}

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Description</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>{project.description}</p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Repository</h3>
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontSize: '0.85rem', color: 'var(--accent-light)',
              background: 'rgba(13,148,136,0.08)', padding: '8px 14px',
              borderRadius: 8, textDecoration: 'none',
              border: '1px solid rgba(13,148,136,0.2)',
            }}
          >
            🔗 {project.url}
          </a>
        </div>

        <div>
          <h3 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>Project Details</h3>
          <div style={{ background: 'var(--bg-primary)', borderRadius: 8, border: '1px solid var(--border)', padding: 12 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '6px 10px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Category</td>
                  <td style={{ padding: '6px 10px', fontSize: '0.82rem', color: 'var(--text-primary)' }}>{project.category}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '6px 10px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Subcategory</td>
                  <td style={{ padding: '6px 10px', fontSize: '0.82rem', color }}>{project.subcategory}</td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '6px 10px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Industries</td>
                  <td style={{ padding: '6px 10px', fontSize: '0.82rem' }}>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {industries.map((ind, i) => <IndustryBadge key={i} industry={ind} small />)}
                    </div>
                  </td>
                </tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  <td style={{ padding: '6px 10px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Capabilities</td>
                  <td style={{ padding: '6px 10px', fontSize: '0.82rem', color: 'var(--text-primary)' }}>{caps.join(', ') || 'N/A'}</td>
                </tr>
                <tr>
                  <td style={{ padding: '6px 10px', fontSize: '0.82rem', color: 'var(--text-muted)', fontWeight: 600 }}>Platform</td>
                  <td style={{ padding: '6px 10px', fontSize: '0.82rem', color: 'var(--text-primary)' }}>Marq AI Skills</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AIDirectoryClient({ stats, categories, industries, userRole }) {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedCapability, setSelectedCapability] = useState('all');
  const [selectedIndustry, setSelectedIndustry] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const LIMIT = 50;

  const fetchProjects = useCallback(async (query, category, capability, industryParam, pageNum) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: query || '',
        category: category || 'all',
        capability: capability || 'all',
        industry: industryParam || 'all',
        role: userRole || 'viewer',
        page: String(pageNum),
        limit: String(LIMIT),
      });
      const res = await fetch(`/api/ai-directory/search?${params}`);
      const data = await res.json();
      if (data.success) {
        setProjects(data.results || []);
        setTotalResults(data.total || 0);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [userRole]);

  useEffect(() => {
    fetchProjects(search, selectedCategory, selectedCapability, selectedIndustry, page);
  }, [search, selectedCategory, selectedCapability, selectedIndustry, page, fetchProjects]);

  const handleCategoryClick = (catKey) => {
    setSelectedCategory(selectedCategory === catKey ? 'all' : catKey);
    setPage(1);
  };

  const handleCapabilityClick = (cap) => {
    setSelectedCapability(selectedCapability === cap ? 'all' : cap);
    setPage(1);
  };

  const handleIndustryClick = (indKey) => {
    setSelectedIndustry(selectedIndustry === indKey ? 'all' : indKey);
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  // Count projects per capability from stats
  const capabilityCounts = useMemo(() => {
    return stats.capabilityCounts || {};
  }, [stats]);

  const groupedProjects = useMemo(() => {
    const grouped = {};
    for (const p of projects) {
      if (!grouped[p.subcategory]) grouped[p.subcategory] = [];
      grouped[p.subcategory].push(p);
    }
    return grouped;
  }, [projects]);

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto', padding: '32px 24px' }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            🌐 Marq AI Directory
          </h1>
          <span style={{
            fontSize: '0.7rem', fontWeight: 700, color: '#0d9488',
            background: 'rgba(13,148,136,0.1)', padding: '4px 10px', borderRadius: 6,
          }}>
            {stats.totalProjects} PROJECTS
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
          Curated directory of the best AI projects, models, tools, and infrastructure — powered by Marq AI. Browse by category, industry, or search to find the right tool for your project.
        </p>
      </div>

      {/* Stats Bar */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
        gap: 12, marginBottom: 24,
      }}>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {stats.totalProjects}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Projects</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {stats.totalCategories}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Categories</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {stats.totalSubcategories}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Subcategories</div>
        </div>
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '14px 18px' }}>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, background: 'var(--gradient-4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {industries ? Object.keys(industries).length : 10}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Industries</div>
        </div>
      </div>

      {/* ─── Industry Filter ──────────────────────────── */}
      {industries && Object.keys(industries).length > 0 && (
        <div style={{
          marginBottom: 16, padding: '16px 20px',
          background: 'var(--bg-card)', border: '1px solid var(--border)',
          borderRadius: 12,
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12,
            fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)',
          }}>
            <span style={{ fontSize: '1rem' }}>🏢</span>
            <span>Filter by Industry</span>
            {selectedIndustry !== 'all' && (
              <button
                onClick={() => { setSelectedIndustry('all'); setPage(1); }}
                style={{
                  marginLeft: 'auto', padding: '3px 10px', borderRadius: 6,
                  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                  color: '#ef4444', fontSize: '0.72rem', cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                ✕ Clear
              </button>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(industries)
              .sort(([,a],[,b]) => b.count - a.count)
              .map(([indKey, meta]) => (
              <button
                key={indKey}
                onClick={() => handleIndustryClick(indKey)}
                style={{
                  padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
                  background: selectedIndustry === indKey ? meta.color + '15' : 'var(--bg-primary)',
                  border: `1px solid ${selectedIndustry === indKey ? meta.color + '40' : 'var(--border)'}`,
                  color: selectedIndustry === indKey ? meta.color : 'var(--text-secondary)',
                  fontSize: '0.75rem', fontWeight: selectedIndustry === indKey ? 600 : 400,
                  transition: 'all 0.15s',
                  display: 'flex', alignItems: 'center', gap: 5,
                }}
              >
                <span>{meta.icon}</span>
                <span>{meta.shortName}</span>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: 2 }}>({meta.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ─── Capabilities Filter ──────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>
          Filter by Capability
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {Object.entries(CAPABILITIES).map(([cap, def]) => (
            <button
              key={cap}
              onClick={() => handleCapabilityClick(cap)}
              style={{
                padding: '6px 12px', borderRadius: 8, cursor: 'pointer',
                background: selectedCapability === cap ? def.bg : 'var(--bg-card)',
                border: `1px solid ${selectedCapability === cap ? def.border : 'var(--border)'}`,
                color: selectedCapability === cap ? def.color : 'var(--text-secondary)',
                fontSize: '0.75rem', fontWeight: selectedCapability === cap ? 600 : 400,
                transition: 'all 0.15s',
                display: 'flex', alignItems: 'center', gap: 5,
              }}
            >
              <span style={{ fontSize: '0.7rem' }}>{def.icon}</span>
              {cap}
            </button>
          ))}
          {selectedCapability !== 'all' && (
            <button
              onClick={() => { setSelectedCapability('all'); setPage(1); }}
              style={{
                padding: '6px 10px', borderRadius: 8, cursor: 'pointer',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                color: 'var(--text-muted)', fontSize: '0.72rem',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              ✕ Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        {Object.entries(categories).map(([catKey, meta]) => (
          <button
            key={catKey}
            onClick={() => handleCategoryClick(catKey)}
            style={{
              padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
              background: selectedCategory === catKey ? meta.color + '15' : 'var(--bg-card)',
              border: `1px solid ${selectedCategory === catKey ? meta.color + '40' : 'var(--border)'}`,
              color: selectedCategory === catKey ? meta.color : 'var(--text-primary)',
              fontSize: '0.78rem', fontWeight: selectedCategory === catKey ? 600 : 400,
              transition: 'all 0.15s',
              display: 'flex', alignItems: 'center', gap: 6,
            }}
          >
            <span>{meta.icon}</span>
            <span>{meta.shortName}</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: 2 }}>({meta.count})</span>
          </button>
        ))}
        <button
          onClick={() => { setSelectedCategory('all'); setPage(1); }}
          style={{
            padding: '8px 14px', borderRadius: 8, cursor: 'pointer',
            background: selectedCategory === 'all' ? 'rgba(13,148,136,0.15)' : 'var(--bg-card)',
            border: `1px solid ${selectedCategory === 'all' ? 'rgba(13,148,136,0.4)' : 'var(--border)'}`,
            color: selectedCategory === 'all' ? 'var(--accent-light)' : 'var(--text-primary)',
            fontSize: '0.78rem', fontWeight: selectedCategory === 'all' ? 600 : 400,
          }}
        >
          All ({stats.totalProjects})
        </button>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 24 }}>
        <input
          className="search-input"
          type="text"
          placeholder={`Search ${stats.totalProjects} AI projects by name, description, or category...`}
          value={search}
          onChange={handleSearch}
          style={{ width: '100%', maxWidth: 600, paddingLeft: 16 }}
        />
      </div>

      {/* Active filters summary */}
      {(selectedIndustry !== 'all' || selectedCapability !== 'all' || selectedCategory !== 'all' || search) && (
        <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active filters:</span>
          {selectedIndustry !== 'all' && (
            <span style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: '0.72rem', padding: '3px 8px', borderRadius: 6,
              background: (industries[selectedIndustry]?.color || '#64748B') + '10',
              color: industries[selectedIndustry]?.color || '#64748B',
              border: `1px solid ${(industries[selectedIndustry]?.color || '#64748B')}25`,
            }}>
              {industries[selectedIndustry]?.icon} {industries[selectedIndustry]?.shortName || selectedIndustry}
              <span onClick={() => { setSelectedIndustry('all'); setPage(1); }} style={{ cursor: 'pointer', marginLeft: 2, opacity: 0.7 }}>✕</span>
            </span>
          )}
          {selectedCapability !== 'all' && (
            <span style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: '0.72rem', padding: '3px 8px', borderRadius: 6,
              background: CAPABILITIES[selectedCapability]?.bg, color: CAPABILITIES[selectedCapability]?.color,
              border: `1px solid ${CAPABILITIES[selectedCapability]?.border}`,
            }}>
              {CAPABILITIES[selectedCapability]?.icon} {selectedCapability}
              <span onClick={() => { setSelectedCapability('all'); setPage(1); }} style={{ cursor: 'pointer', marginLeft: 2, opacity: 0.7 }}>✕</span>
            </span>
          )}
          {selectedCategory !== 'all' && (
            <span style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: '0.72rem', padding: '3px 8px', borderRadius: 6,
              background: 'rgba(13,148,136,0.08)', color: 'var(--accent)',
              border: '1px solid rgba(13,148,136,0.2)',
            }}>
              {categories[selectedCategory]?.icon} {categories[selectedCategory]?.shortName}
              <span onClick={() => { setSelectedCategory('all'); setPage(1); }} style={{ cursor: 'pointer', marginLeft: 2, opacity: 0.7 }}>✕</span>
            </span>
          )}
          {search && (
            <span style={{ 
              display: 'inline-flex', alignItems: 'center', gap: 4,
              fontSize: '0.72rem', padding: '3px 8px', borderRadius: 6,
              background: 'var(--bg-card)', color: 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}>
              🔍 "{search}"
              <span onClick={() => { setSearch(''); setPage(1); }} style={{ cursor: 'pointer', marginLeft: 2, opacity: 0.7 }}>✕</span>
            </span>
          )}
        </div>
      )}

      {/* Results info */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {loading ? 'Loading...' : `${totalResults} project${totalResults !== 1 ? 's' : ''} found`}
          {selectedCategory !== 'all' && ` in ${categories[selectedCategory]?.shortName || selectedCategory}`}
          {selectedIndustry !== 'all' && ` for ${industries[selectedIndustry]?.shortName || selectedIndustry}`}
          {selectedCapability !== 'all' && ` with ${selectedCapability}`}
          {search && ` matching "${search}"`}
        </span>
        {totalPages > 1 && (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              style={{
                padding: '4px 10px', fontSize: '0.8rem', cursor: page === 1 ? 'not-allowed' : 'pointer',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 6, color: page === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
              }}
            >
              ← Prev
            </button>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              style={{
                padding: '4px 10px', fontSize: '0.8rem', cursor: page === totalPages ? 'not-allowed' : 'pointer',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                borderRadius: 6, color: page === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* Projects Grid by Subcategory */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>⏳</div>
          Loading projects...
        </div>
      )}

      {!loading && Object.entries(groupedProjects).map(([subcat, subProjects]) => {
        const firstProject = subProjects[0];
        const color = CATEGORY_COLORS[firstProject?.category] || '#0d9488';
        return (
          <div key={subcat} style={{ marginBottom: 32 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              marginBottom: 12, paddingBottom: 8, borderBottom: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: '1.1rem' }}>▸</span>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>{subcat}</span>
              <span style={{ fontSize: '0.72rem', color, background: color + '12', padding: '2px 8px', borderRadius: 4 }}>
                {subProjects.length}
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 10,
            }}>
              {subProjects.map((project, i) => (
                <ProjectCard
                  key={`${project.name}-${i}`}
                  project={project}
                  color={color}
                  onClick={setSelectedProject}
                />
              ))}
            </div>
          </div>
        );
      })}

      {!loading && projects.length === 0 && (
        <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: 16 }}>🔍</div>
          <div>No projects found</div>
          <div style={{ fontSize: '0.85rem', marginTop: 8 }}>Try a different search, category, industry, or capability filter</div>
        </div>
      )}

      {/* Pagination at bottom */}
      {!loading && totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 32, paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <button
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
            style={{
              padding: '8px 16px', fontSize: '0.85rem', cursor: page === 1 ? 'not-allowed' : 'pointer',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 8, color: page === 1 ? 'var(--text-muted)' : 'var(--text-primary)',
            }}
          >
            ← Previous
          </button>
          <span style={{ padding: '8px 16px', fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            style={{
              padding: '8px 16px', fontSize: '0.85rem', cursor: page === totalPages ? 'not-allowed' : 'pointer',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 8, color: page === totalPages ? 'var(--text-muted)' : 'var(--text-primary)',
            }}
          >
            Next →
          </button>
        </div>
      )}

      {/* Project Detail Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}
    </div>
  );
}
