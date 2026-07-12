'use client';

import { useState, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

function SkillCard({ skill, onClick, canEdit, canDelete }) {
  return (
    <div
      className="skill-card"
      onClick={() => onClick(skill)}
      style={{ '--card-color': skill.color }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: skill.color }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <span style={{ fontSize: '1.2rem' }}>{skill.icon}</span>
        <div className="skill-card-name" style={{ marginBottom: 0 }}>{skill.name}</div>
      </div>
      <div className="skill-card-description">{skill.description}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <div className="skill-card-slug">{skill.slug}</div>
        {canEdit && (
          <span style={{ fontSize: '0.65rem', color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '2px 8px', borderRadius: 4, fontWeight: 500 }}>Editable</span>
        )}
        {canDelete && (
          <span style={{ fontSize: '0.65rem', color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '2px 8px', borderRadius: 4, fontWeight: 500 }}>Manageable</span>
        )}
      </div>
    </div>
  );
}

function SkillModal({ skill, onClose, canEdit, canDelete }) {
  if (!skill) return null;
  
  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const elements = [];
    let inCodeBlock = false;
    let codeContent = '';
    let inList = false;
    let listItems = [];
    let listType = '';
    
    const flushList = () => {
      if (listItems.length > 0) {
        const Tag = listType === 'ol' ? 'ol' : 'ul';
        elements.push(<Tag key={`list-${elements.length}`}>{listItems.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}</Tag>);
        listItems = [];
        inList = false;
      }
    };
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith('```')) {
        flushList();
        if (inCodeBlock) {
          elements.push(<pre key={`code-${elements.length}`}><code>{codeContent}</code></pre>);
          codeContent = '';
          inCodeBlock = false;
        } else { inCodeBlock = true; }
        continue;
      }
      if (inCodeBlock) { codeContent += (codeContent ? '\n' : '') + line; continue; }
      if (line.startsWith('### ')) { flushList(); elements.push(<h3 key={`h3-${elements.length}`}>{line.slice(4)}</h3>); }
      else if (line.startsWith('## ')) { flushList(); elements.push(<h2 key={`h2-${elements.length}`}>{line.slice(3)}</h2>); }
      else if (line.startsWith('# ')) { flushList(); elements.push(<h1 key={`h1-${elements.length}`}>{line.slice(2)}</h1>); }
      else if (line.match(/^[-*] /)) { if (!inList || listType !== 'ul') { flushList(); inList = true; listType = 'ul'; } listItems.push(line.replace(/^[-*] /, '').replace(/`([^`]+)`/g, '<code>$1</code>')); }
      else if (line.match(/^\d+\. /)) { if (!inList || listType !== 'ol') { flushList(); inList = true; listType = 'ol'; } listItems.push(line.replace(/^\d+\. /, '').replace(/`([^`]+)`/g, '<code>$1</code>')); }
      else if (line.trim() === '') { flushList(); }
      else { flushList(); elements.push(<p key={`p-${elements.length}`} dangerouslySetInnerHTML={{ __html: line.replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') }} />); }
    }
    flushList();
    if (inCodeBlock) { elements.push(<pre key={`code-${elements.length}`}><code>{codeContent}</code></pre>); }
    return elements;
  };
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕ Close</button>
        <div className="modal-title">{skill.icon} {skill.name}</div>
        <div className="modal-category" style={{ color: skill.color }}>{skill.category}</div>
        <div className="modal-body">{renderMarkdown(skill.content)}</div>
      </div>
    </div>
  );
}

const ROLE_INFO = {
  admin: { label: 'Administrator', color: '#ef4444', desc: 'Full access to all features', icon: '👑', skills: 'All 173+' },
  manager: { label: 'Manager', color: '#f59e0b', desc: 'Manage skills & view users', icon: '⭐', skills: '9 Categories' },
  editor: { label: 'Editor', color: '#3b82f6', desc: 'Create & edit skills', icon: '✏️', skills: '3 Categories' },
  viewer: { label: 'Viewer', color: '#10b981', desc: 'Read-only access', icon: '👁️', skills: '2 Categories' },
};

export default function HomeClient({ skills, totalSkills, userRole, permissions, session }) {
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const router = useRouter();
  const { data: clientSession } = useSession();
  
  const currentSession = clientSession || session;
  const role = currentSession?.user?.role || userRole;
  const roleInfo = ROLE_INFO[role] || ROLE_INFO.viewer;
  
  const filteredSkills = useMemo(() => {
    if (!search.trim()) return skills;
    const q = search.toLowerCase();
    return skills.filter(s =>
      s.name.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.category.toLowerCase().includes(q) ||
      s.slug.toLowerCase().includes(q)
    );
  }, [search, skills]);
  
  const filteredByCategory = useMemo(() => {
    const grouped = {};
    for (const skill of filteredSkills) {
      if (!grouped[skill.category]) grouped[skill.category] = [];
      grouped[skill.category].push(skill);
    }
    return grouped;
  }, [filteredSkills]);

  const categoryMeta = useMemo(() => {
    const meta = {};
    for (const skill of skills) {
      if (!meta[skill.category]) meta[skill.category] = { count: 0, icon: skill.icon, color: skill.color };
      meta[skill.category].count++;
    }
    return meta;
  }, [skills]);
  
  const canEdit = permissions?.canWrite || false;
  const canDelete = permissions?.canDelete || false;
  const canManageUsers = permissions?.canManageUsers || false;
  
  // If not logged in, show landing page with infographic hero
  if (!currentSession) {
    return (
      <div>
        {/* Hero with infographic background */}
        <section className="hero" style={{ padding: '80px 24px 60px' }}>
          <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
            <img src="/images/hero-dashboard.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.08 }} />
          </div>
          <div className="hero-badge">⚡ Marq AI Skills Platform</div>
          <h1><span className="gradient-text">Marq AI</span> Skills Platform</h1>
          <p>Production-ready AI skills, intelligent agents, and curated AI projects — all in one powerful platform. Sign in to access resources based on your role.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, position: 'relative', zIndex: 1, flexWrap: 'wrap' }}>
            <button
              onClick={() => router.push('/auth/login')}
              style={{ padding: '14px 32px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 12, fontSize: '1rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(13,148,136,0.3)', transition: 'all 0.2s' }}
            >
              Sign In to Access
            </button>
            <button
              onClick={() => router.push('/auth/signup')}
              style={{ padding: '14px 32px', background: 'transparent', color: 'var(--accent-light)', border: '1px solid rgba(13,148,136,0.4)', borderRadius: 12, fontSize: '1rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Create Account
            </button>
          </div>
          <div className="hero-stats" style={{ marginTop: 40 }}>
            <div className="hero-stat">
              <div className="number">{totalSkills || skills.length}+</div>
              <div className="label">Skills</div>
            </div>
            <div className="hero-stat">
              <div className="number">{Object.keys(categoryMeta).length}</div>
              <div className="label">Categories</div>
            </div>
            <div className="hero-stat">
              <div className="number">9</div>
              <div className="label">AI Agents</div>
            </div>
            <div className="hero-stat">
              <div className="number">931</div>
              <div className="label">AI Projects</div>
            </div>
          </div>
        </section>
        
        {/* Feature highlights with infographics */}
        <section style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px 60px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 20 }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
              <img src="/images/skills-library.png" alt="Skills" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: 20, background: 'var(--bg-card)' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>🧠 Skills Library</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>173+ production-ready skills across 10 categories — from sales playbooks to engineering tools.</div>
              </div>
            </div>
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
              <img src="/images/ai-agents.png" alt="Agents" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: 20, background: 'var(--bg-card)' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>🤖 AI Agents</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>9 intelligent agents with interactive prompt simulation — from execution to navigation.</div>
              </div>
            </div>
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', position: 'relative' }}>
              <img src="/images/ai-directory.png" alt="Directory" style={{ width: '100%', height: 160, objectFit: 'cover', display: 'block' }} />
              <div style={{ padding: 20, background: 'var(--bg-card)' }}>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 6 }}>🌐 AI Directory</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>931 curated AI projects across 14 categories — frameworks, models, tools, and more.</div>
              </div>
            </div>
          </div>
        </section>

        {/* Role overview */}
        <section className="categories-section" style={{ paddingTop: 0 }}>
          <h2 style={{ textAlign: 'center', marginBottom: 32, color: 'var(--text-primary)', fontSize: '1.4rem' }}>Access by Role</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, maxWidth: 1100, margin: '0 auto' }}>
            {Object.entries(ROLE_INFO).map(([key, info]) => (
              <div key={key} className="glass-card" style={{
                padding: 28, textAlign: 'center', borderRadius: 16,
              }}>
                <div style={{ fontSize: '2rem', marginBottom: 8 }}>{info.icon}</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: info.color, marginBottom: 6 }}>{info.label}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginBottom: 8 }}>{info.desc}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', background: info.color + '10', padding: '4px 10px', borderRadius: 6, display: 'inline-block' }}>{info.skills}</div>
              </div>
            ))}
          </div>
        </section>
        
        <footer className="footer">
          <div>Marq AI Skills Platform &mdash; Production-ready AI skills for every workflow</div>
          <div className="footer-links">
            <a href="https://github.com/pmkshar/marqaiskills" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="https://www.marqai.io" target="_blank" rel="noopener noreferrer">Marq AI</a>
          </div>
        </footer>
      </div>
    );
  }
  
  // Logged in - show skills with better UI
  return (
    <div>
      {/* Welcome banner with infographic */}
      <div style={{ position: 'relative', borderRadius: 0, overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '40%', height: '100%', opacity: 0.1 }}>
          <img src="/images/platform-overview.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{
          position: 'relative', zIndex: 1,
          background: `linear-gradient(135deg, rgba(13,148,136,0.06) 0%, ${roleInfo.color}08 50%, transparent 100%)`,
          borderBottom: '1px solid var(--border)', padding: '24px 32px',
          display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
        }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: roleInfo.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>
            {roleInfo.icon}
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-primary)' }}>Welcome, {currentSession.user.name}</span>
              <span style={{
                fontSize: '0.65rem', fontWeight: 600, color: roleInfo.color,
                background: roleInfo.color + '20', padding: '3px 8px', borderRadius: 4,
              }}>
                {roleInfo.label}
              </span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {skills.length} of {totalSkills} skills accessible &bull; {Object.keys(filteredByCategory).length} categories
            </div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button
              onClick={() => router.push('/dashboard')}
              style={{ padding: '8px 16px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}
            >
              📊 Dashboard
            </button>
            {canManageUsers && (
              <button
                onClick={() => router.push('/admin')}
                style={{ padding: '8px 16px', background: 'var(--bg-card)', color: 'var(--text-secondary)', border: '1px solid var(--border)', borderRadius: 10, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4 }}
              >
                ⚙️ Admin
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Search */}
      <div className="search-container" style={{ marginTop: 24 }}>
        <span className="search-icon">&#x1F50D;</span>
        <input
          className="search-input"
          type="text"
          placeholder={`Search ${skills.length} accessible skills...`}
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      
      {/* Categories & Skills */}
      <section className="categories-section">
        {Object.entries(filteredByCategory).map(([category, catSkills]) => (
          <div key={category} className="category-section">
            <div className="category-header">
              <span className="category-icon">{catSkills[0]?.icon}</span>
              <span className="category-name">{category}</span>
              <span className="category-count">{catSkills.length} skills</span>
            </div>
            <div className="skills-grid">
              {catSkills.map(skill => (
                <SkillCard
                  key={skill.slug}
                  skill={skill}
                  onClick={setSelectedSkill}
                  canEdit={canEdit}
                  canDelete={canDelete}
                />
              ))}
            </div>
          </div>
        ))}
        
        {filteredSkills.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '16px' }}>&#x1F50D;</div>
            <div>No skills found matching &quot;{search}&quot;</div>
            <div style={{ fontSize: '0.875rem', marginTop: '8px' }}>Try a different search term</div>
          </div>
        )}
      </section>
      
      <footer className="footer">
        <div>Marq AI Skills Platform &mdash; Production-ready AI skills for every workflow</div>
        <div className="footer-links">
          <a href="https://github.com/pmkshar/marqaiskills" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.marqai.io" target="_blank" rel="noopener noreferrer">Marq AI</a>
        </div>
      </footer>
      
      {selectedSkill && (
        <SkillModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} canEdit={canEdit} canDelete={canDelete} />
      )}
    </div>
  );
}
