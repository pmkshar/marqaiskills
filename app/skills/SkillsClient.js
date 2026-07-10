'use client';

import { useState, useMemo } from 'react';
import { ROLES } from '../../lib/rbac';

const ROLE_COLORS = {
  admin: '#ef4444', manager: '#f59e0b', editor: '#3b82f6', viewer: '#10b981',
};

function SkillCard({ skill, onClick, canEdit, canDelete }) {
  return (
    <div className="skill-card" onClick={() => onClick(skill)} style={{ '--card-color': skill.color }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: skill.color }} />
      <div className="skill-card-name">{skill.icon} {skill.name}</div>
      <div className="skill-card-description">{skill.description}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12 }}>
        <div className="skill-card-slug">{skill.slug}</div>
        {canEdit && <span style={{ fontSize: '0.7rem', color: '#3b82f6', background: 'rgba(59,130,246,0.1)', padding: '2px 6px', borderRadius: 4 }}>Edit</span>}
        {canDelete && <span style={{ fontSize: '0.7rem', color: '#ef4444', background: 'rgba(239,68,68,0.1)', padding: '2px 6px', borderRadius: 4 }}>Manage</span>}
      </div>
    </div>
  );
}

function SkillModal({ skill, onClose }) {
  if (!skill) return null;
  const renderMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    const elements = [];
    let inCodeBlock = false, codeContent = '', inList = false, listItems = [], listType = '';
    const flushList = () => { if (listItems.length > 0) { const Tag = listType === 'ol' ? 'ol' : 'ul'; elements.push(<Tag key={`list-${elements.length}`}>{listItems.map((item, i) => <li key={i} dangerouslySetInnerHTML={{ __html: item }} />)}</Tag>); listItems = []; inList = false; } };
    for (const line of lines) {
      if (line.startsWith('```')) { flushList(); if (inCodeBlock) { elements.push(<pre key={`code-${elements.length}`}><code>{codeContent}</code></pre>); codeContent = ''; inCodeBlock = false; } else { inCodeBlock = true; } continue; }
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
    if (inCodeBlock) elements.push(<pre key={`code-${elements.length}`}><code>{codeContent}</code></pre>);
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

export default function SkillsClient({ skills, totalSkills, userRole, permissions, session }) {
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  const categories = useMemo(() => {
    const cats = [...new Set(skills.map(s => s.category))];
    return cats.sort();
  }, [skills]);
  
  const filteredSkills = useMemo(() => {
    let result = skills;
    if (selectedCategory !== 'all') {
      result = result.filter(s => s.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.slug.toLowerCase().includes(q)
      );
    }
    return result;
  }, [search, skills, selectedCategory]);
  
  const filteredByCategory = useMemo(() => {
    const grouped = {};
    for (const skill of filteredSkills) {
      if (!grouped[skill.category]) grouped[skill.category] = [];
      grouped[skill.category].push(skill);
    }
    return grouped;
  }, [filteredSkills]);
  
  const canEdit = permissions?.canWrite || false;
  const canDelete = permissions?.canDelete || false;
  const roleInfo = ROLES[userRole] || ROLES.viewer;
  
  return (
    <div>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '24px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Skills Library</h1>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: ROLE_COLORS[userRole], background: ROLE_COLORS[userRole] + '20', padding: '4px 10px', borderRadius: 6 }}>{roleInfo.label}</span>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>{skills.length} of {totalSkills} skills</span>
        </div>
        
        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 250 }}>
            <input
              className="search-input"
              type="text"
              placeholder="Search skills..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ width: '100%', paddingLeft: 16 }}
            />
          </div>
          <select
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
            style={{ padding: '12px 16px', background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)', fontSize: '0.9rem', outline: 'none', cursor: 'pointer' }}
          >
            <option value="all">All Categories</option>
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
        </div>
      </div>
      
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
                <SkillCard key={skill.slug} skill={skill} onClick={setSelectedSkill} canEdit={canEdit} canDelete={canDelete} />
              ))}
            </div>
          </div>
        ))}
        {filteredSkills.length === 0 && (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--text-muted)' }}>
            <div style={{ fontSize: '2rem', marginBottom: 16 }}>&#x1F50D;</div>
            <div>No skills found</div>
          </div>
        )}
      </section>
      
      {selectedSkill && <SkillModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />}
    </div>
  );
}
