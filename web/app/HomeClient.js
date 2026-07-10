'use client';

import { useState, useMemo } from 'react';

function SkillCard({ skill, onClick }) {
  return (
    <div
      className="skill-card"
      onClick={() => onClick(skill)}
      style={{ '--card-color': skill.color }}
    >
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: skill.color }} />
      <div className="skill-card-name">{skill.icon} {skill.name}</div>
      <div className="skill-card-description">{skill.description}</div>
      <div className="skill-card-slug">{skill.slug}</div>
    </div>
  );
}

function SkillModal({ skill, onClose }) {
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
        } else {
          inCodeBlock = true;
        }
        continue;
      }
      
      if (inCodeBlock) {
        codeContent += (codeContent ? '\n' : '') + line;
        continue;
      }
      
      if (line.startsWith('### ')) {
        flushList();
        elements.push(<h3 key={`h3-${elements.length}`}>{line.slice(4)}</h3>);
      } else if (line.startsWith('## ')) {
        flushList();
        elements.push(<h2 key={`h2-${elements.length}`}>{line.slice(3)}</h2>);
      } else if (line.startsWith('# ')) {
        flushList();
        elements.push(<h1 key={`h1-${elements.length}`}>{line.slice(2)}</h1>);
      } else if (line.match(/^[-*] /)) {
        if (!inList || listType !== 'ul') { flushList(); inList = true; listType = 'ul'; }
        listItems.push(line.replace(/^[-*] /, '').replace(/`([^`]+)`/g, '<code>$1</code>'));
      } else if (line.match(/^\d+\. /)) {
        if (!inList || listType !== 'ol') { flushList(); inList = true; listType = 'ol'; }
        listItems.push(line.replace(/^\d+\. /, '').replace(/`([^`]+)`/g, '<code>$1</code>'));
      } else if (line.trim() === '') {
        flushList();
      } else {
        flushList();
        elements.push(<p key={`p-${elements.length}`} dangerouslySetInnerHTML={{ __html: line.replace(/`([^`]+)`/g, '<code>$1</code>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>') }} />);
      }
    }
    flushList();
    if (inCodeBlock) {
      elements.push(<pre key={`code-${elements.length}`}><code>{codeContent}</code></pre>);
    }
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

export default function HomeClient({ skills }) {
  const [search, setSearch] = useState('');
  const [selectedSkill, setSelectedSkill] = useState(null);
  
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
  
  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-badge">
          &#x26A1; Open Source &bull; MIT License
        </div>
        <h1>
          <span className="gradient-text">Marq AI</span> Skills Platform
        </h1>
        <p>
          Production-ready AI skills for business, coding, and everyday life. 
          Each skill is a self-contained prompt &mdash; no dependencies, no build step.
        </p>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="number">{skills.length}+</div>
            <div className="label">Skills</div>
          </div>
          <div className="hero-stat">
            <div className="number">{Object.keys(categoryMeta).length}</div>
            <div className="label">Categories</div>
          </div>
          <div className="hero-stat">
            <div className="number">3</div>
            <div className="label">Pillars</div>
          </div>
        </div>
      </section>
      
      {/* Search */}
      <div className="search-container">
        <span className="search-icon">&#x1F50D;</span>
        <input
          className="search-input"
          type="text"
          placeholder="Search skills by name, category, or description..."
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
      
      {/* Footer */}
      <footer className="footer">
        <div>Marq AI Skills Platform &mdash; Production-ready AI skills for every workflow</div>
        <div className="footer-links">
          <a href="https://github.com/pmkshar/marqaiskills" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.marqai.io" target="_blank" rel="noopener noreferrer">Marq AI</a>
        </div>
      </footer>
      
      {/* Skill Detail Modal */}
      {selectedSkill && (
        <SkillModal skill={selectedSkill} onClose={() => setSelectedSkill(null)} />
      )}
    </div>
  );
}
