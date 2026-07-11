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
      <div className="skill-card-name">{skill.icon} {skill.name}</div>
      <div className="skill-card-description">{skill.description}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <div className="skill-card-slug">{skill.slug}</div>
        {canEdit && (
          <span style={{ fontSize: '0.7rem', color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '2px 6px', borderRadius: 4 }}>Editable</span>
        )}
        {canDelete && (
          <span style={{ fontSize: '0.7rem', color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '2px 6px', borderRadius: 4 }}>Manageable</span>
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
        <button className="modal-close" onClick={onClose}>&#x2715; Close</button>
        <div className="modal-title">{skill.icon} {skill.name}</div>
        <div className="modal-category" style={{ color: skill.color }}>{skill.category}</div>
        <div className="modal-body">{renderMarkdown(skill.content)}</div>
      </div>
    </div>
  );
}

const ROLE_INFO = {
  admin: { label: 'Administrator', color: '#ef4444', desc: 'Full access to all features' },
  manager: { label: 'Manager', color: '#f59e0b', desc: 'Manage skills & view users' },
  editor: { label: 'Editor', color: '#3b82f6', desc: 'Create & edit skills' },
  viewer: { label: 'Viewer', color: '#10b981', desc: 'Read-only access' },
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
  
  // If not logged in, show landing page with login prompt
  if (!currentSession) {
    return (
      <div>
        <section className="hero">
          <div className="hero-badge">&#x26A1; Open Source &bull; MIT License</div>
          <h1><span className="gradient-text">Marq AI</span> Skills Platform</h1>
          <p>Production-ready AI skills for business, coding, and everyday life. Sign in to access skills based on your role.</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, position: 'relative', zIndex: 1 }}>
            <button
              onClick={() => router.push('/auth/login')}
              style={{ padding: '14px 32px', background: 'var(--accent)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
            >
              Sign In to Access Skills
            </button>
            <button
              onClick={() => router.push('/auth/signup')}
              style={{ padding: '14px 32px', background: 'transparent', color: 'var(--accent-light)', border: '1px solid var(--accent)', borderRadius: 10, fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}
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
              <div className="number">4</div>
              <div className="label">Roles</div>
            </div>
          </div>
        </section>
        
        {/* Role overview for non-logged-in users */}
        <section className="categories-section">
          <h2 style={{ textAlign: 'center', marginBottom: 32, color: 'var(--text-primary)' }}>Access by Role</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, maxWidth: 1100, margin: '0 auto' }}>
            {Object.entries(ROLE_INFO).map(([key, info]) => (
              <div key={key} style={{
                background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12,
                padding: 24, textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: info.color, marginBottom: 8 }}>{info.label}</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{info.desc}</div>
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
  
  // Logged in - show skills filtered by role
  return (
    <div>
      {/* Role banner */}
      <div style={{
        background: `linear-gradient(135deg, rgba(99,102,241,0.05), ${roleInfo.color}11)`,
        borderBottom: '1px solid var(--border)', padding: '16px 24px',
        display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
      }}>
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Welcome, <strong style={{ color: 'var(--text-primary)' }}>{currentSession.user.name}</strong>
        </span>
        <span style={{
          fontSize: '0.7rem', fontWeight: 600, color: roleInfo.color,
          background: roleInfo.color + '20', padding: '3px 8px', borderRadius: 4,
        }}>
          {roleInfo.label}
        </span>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {skills.length} of {totalSkills} skills accessible
        </span>
        {canManageUsers && (
          <button
            onClick={() => router.push('/admin')}
            style={{
              padding: '6px 14px', background: 'var(--accent)', color: '#fff', border: 'none',
              borderRadius: 6, fontSize: '0.8rem', cursor: 'pointer', fontWeight: 500,
            }}
          >
            Manage Users
          </button>
        )}
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
