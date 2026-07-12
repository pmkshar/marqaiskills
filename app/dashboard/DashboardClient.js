'use client';

import { useState, useMemo, useRef, useCallback } from 'react';
import { useSession } from 'next-auth/react';

// ─── Color Palette ──────────────────────────────
const COLORS = ['#0d9488','#14b8a6','#ec4899','#ef4444','#f59e0b','#10b981','#2dd4bf','#3b82f6','#64748b','#f97316','#5eead4','#0ea5e9','#84cc16','#e879f9'];
const ROLE_COLORS = { admin: '#ef4444', manager: '#f59e0b', editor: '#3b82f6', viewer: '#10b981' };
const ROLE_LABELS = { admin: 'Administrator', manager: 'Manager', editor: 'Editor', viewer: 'Viewer' };

// ─── SVG Chart Components ───────────────────────
function DonutChart({ data, size = 180, strokeWidth = 28, centerLabel, centerSub }) {
  const total = data.reduce((s, d) => s + d.value, 0);
  if (total === 0) return <div style={{ width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>No data</div>;
  const radius = (size - strokeWidth) / 2;
  const cx = size / 2, cy = size / 2;
  let cumulative = 0;
  const segments = data.map((d, i) => {
    const start = cumulative / total;
    cumulative += d.value;
    const end = cumulative / total;
    const startAngle = start * 2 * Math.PI - Math.PI / 2;
    const endAngle = end * 2 * Math.PI - Math.PI / 2;
    const largeArc = d.value / total > 0.5 ? 1 : 0;
    const x1 = cx + radius * Math.cos(startAngle);
    const y1 = cy + radius * Math.sin(startAngle);
    const x2 = cx + radius * Math.cos(endAngle);
    const y2 = cy + radius * Math.sin(endAngle);
    return { ...d, path: `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`, color: d.color || COLORS[i % COLORS.length], pct: ((d.value / total) * 100).toFixed(1) };
  });
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
        {segments.map((s, i) => <path key={i} d={s.path} fill="none" stroke={s.color} strokeWidth={strokeWidth} strokeLinecap="round" />)}
      </svg>
      {centerLabel && (
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>{centerLabel}</div>
          {centerSub && <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{centerSub}</div>}
        </div>
      )}
    </div>
  );
}

function BarChart({ data, height = 200, maxBars = 12 }) {
  const max = Math.max(...data.map(d => d.value), 1);
  const display = data.slice(0, maxBars);
  const barWidth = Math.max(20, Math.min(48, 600 / display.length - 8));
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height, padding: '0 4px' }}>
      {display.map((d, i) => {
        const h = (d.value / max) * (height - 30);
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, maxWidth: barWidth + 8 }}>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 4, whiteSpace: 'nowrap' }}>{d.value}</div>
            <div style={{ width: '100%', maxWidth: barWidth, height: h, background: d.color || COLORS[i % COLORS.length], borderRadius: '4px 4px 0 0', transition: 'height 0.6s ease', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 60%)` }} />
            </div>
            <div style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', marginTop: 6, textAlign: 'center', lineHeight: 1.2, maxWidth: barWidth + 16, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{d.label}</div>
          </div>
        );
      })}
    </div>
  );
}

function AreaChart({ data, height = 120, color = '#0d9488' }) {
  if (!data.length) return null;
  const max = Math.max(...data.map(d => d.value), 1);
  const w = 100;
  const points = data.map((d, i) => `${(i / (data.length - 1 || 1)) * w},${height - 20 - ((d.value / max) * (height - 30))}`);
  const areaPath = `M 0,${height - 20} L ${points.join(' ')} L ${w},${height - 20} Z`;
  const linePath = `M ${points.join(' ')}`;
  return (
    <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#grad-${color.replace('#','')})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RadialGauge({ value, max = 100, size = 120, color = '#0d9488', label }) {
  const pct = Math.min(value / max, 1);
  const radius = (size - 12) / 2;
  const cx = size / 2, cy = size / 2;
  const circumference = 2 * Math.PI * radius * 0.75;
  const offset = circumference * (1 - pct);
  const startAngle = -225;
  return (
    <div style={{ position: 'relative', width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke="var(--border)" strokeWidth="8" strokeDasharray={`${circumference} ${2 * Math.PI * radius}`} strokeDashoffset="0" strokeLinecap="round" transform={`rotate(${startAngle + 90} ${cx} ${cy})`} />
        <circle cx={cx} cy={cy} r={radius} fill="none" stroke={color} strokeWidth="8" strokeDasharray={`${circumference} ${2 * Math.PI * radius}`} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(${startAngle + 90} ${cx} ${cy})`} style={{ transition: 'stroke-dashoffset 1s ease' }} />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: '1.1rem', fontWeight: 800, color }}>{Math.round(pct * 100)}%</div>
        {label && <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', textAlign: 'center' }}>{label}</div>}
      </div>
    </div>
  );
}

// ─── KPI Card ───────────────────────────────────
function KPICard({ icon, label, value, change, changeDir, color, sparkData }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '20px 22px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: color || 'var(--accent)' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>{label}</div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{value}</div>
          {change !== undefined && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: '0.72rem' }}>
              <span style={{ color: changeDir === 'up' ? '#10b981' : '#ef4444' }}>{changeDir === 'up' ? '↑' : '↓'}</span>
              <span style={{ color: changeDir === 'up' ? '#10b981' : '#ef4444' }}>{change}%</span>
              <span style={{ color: 'var(--text-muted)' }}>vs last month</span>
            </div>
          )}
        </div>
        <div style={{ fontSize: '1.6rem', opacity: 0.7 }}>{icon}</div>
      </div>
      {sparkData && sparkData.length > 0 && (
        <div style={{ marginTop: 12, opacity: 0.8 }}>
          <AreaChart data={sparkData} height={40} color={color || 'var(--accent)'} />
        </div>
      )}
    </div>
  );
}

// ─── Section Header ─────────────────────────────
function SectionHeader({ title, icon, action }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span style={{ fontSize: '1.2rem' }}>{icon}</span>
        <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h2>
      </div>
      {action}
    </div>
  );
}

// ─── Report Download ────────────────────────────
function ReportDownloader({ analytics, userRole }) {
  const [generating, setGenerating] = useState(false);
  const [format, setFormat] = useState('csv');

  const generateCSV = useCallback(() => {
    const rows = [['Section', 'Metric', 'Value']];
    rows.push(['Platform', 'Total Skills', analytics.totalSkills]);
    rows.push(['Platform', 'Accessible Skills', analytics.accessibleSkills]);
    rows.push(['Platform', 'Total Agents', analytics.totalAgents]);
    rows.push(['Platform', 'AI Directory Projects', analytics.aiDirStats.totalProjects]);
    rows.push(['Platform', 'Users', analytics.users]);
    Object.entries(analytics.skillsByCategory).forEach(([cat, skills]) => {
      rows.push(['Skills by Category', cat, skills.length]);
    });
    Object.entries(analytics.agentsByCategory).forEach(([cat, agents]) => {
      rows.push(['Agents by Category', cat, agents.length]);
    });
    Object.entries(analytics.userRoles).forEach(([role, count]) => {
      rows.push(['Users by Role', role, count]);
    });
    return rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n');
  }, [analytics]);

  const generateJSON = useCallback(() => {
    return JSON.stringify({
      generatedAt: new Date().toISOString(),
      role: userRole,
      platform: 'Marq AI Skills',
      summary: {
        totalSkills: analytics.totalSkills,
        accessibleSkills: analytics.accessibleSkills,
        totalAgents: analytics.totalAgents,
        aiDirectoryProjects: analytics.aiDirStats.totalProjects,
        totalUsers: analytics.users,
      },
      skillsByCategory: Object.fromEntries(Object.entries(analytics.skillsByCategory).map(([k, v]) => [k, v.length])),
      agentsByCategory: Object.fromEntries(Object.entries(analytics.agentsByCategory).map(([k, v]) => [k, v.length])),
      usersByRole: analytics.userRoles,
      permissions: analytics.permissions,
    }, null, 2);
  }, [analytics, userRole]);

  const download = useCallback(() => {
    setGenerating(true);
    setTimeout(() => {
      const content = format === 'csv' ? generateCSV() : generateJSON();
      const mime = format === 'csv' ? 'text/csv' : 'application/json';
      const ext = format === 'csv' ? 'csv' : 'json';
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `marq-ai-report-${new Date().toISOString().slice(0, 10)}.${ext}`;
      a.click();
      URL.revokeObjectURL(url);
      setGenerating(false);
    }, 500);
  }, [format, generateCSV, generateJSON]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
      <select value={format} onChange={e => setFormat(e.target.value)} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px', color: 'var(--text-primary)', fontSize: '0.82rem', cursor: 'pointer' }}>
        <option value="csv">CSV</option>
        <option value="json">JSON</option>
      </select>
      <button onClick={download} disabled={generating} style={{ padding: '8px 18px', background: generating ? 'var(--bg-card-hover)' : 'var(--accent)', color: '#fff', border: 'none', borderRadius: 8, fontSize: '0.82rem', fontWeight: 600, cursor: generating ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 6 }}>
        {generating ? <><span className="dot-pulse" style={{ animation: 'pulse 1s infinite' }}>●</span> Generating...</> : '⬇ Download Report'}
      </button>
    </div>
  );
}

// ─── Activity Feed Item ─────────────────────────
function ActivityItem({ icon, text, time, color }) {
  return (
    <div style={{ display: 'flex', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ width: 32, height: 32, borderRadius: 8, background: color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', flexShrink: 0 }}>{icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.82rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>{text}</div>
        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 2 }}>{time}</div>
      </div>
    </div>
  );
}

// ─── Main Dashboard ─────────────────────────────
export default function DashboardClient({ analytics, userRole }) {
  const [activeTab, setActiveTab] = useState('overview');
  const { data: session } = useSession();
  const role = session?.user?.role || userRole;

  // Skills chart data
  const skillsBarData = useMemo(() => 
    Object.entries(analytics.skillsByCategory).map(([cat, skills], i) => ({
      label: cat.split(' & ')[0].split(' and ')[0],
      value: skills.length,
      color: COLORS[i % COLORS.length],
    })).sort((a, b) => b.value - a.value)
  , [analytics.skillsByCategory]);

  const skillsDonutData = useMemo(() =>
    Object.entries(analytics.skillsByCategory).map(([cat, skills], i) => ({
      label: cat.split(' & ')[0],
      value: skills.length,
      color: COLORS[i % COLORS.length],
    }))
  , [analytics.skillsByCategory]);

  const agentDonutData = useMemo(() =>
    Object.entries(analytics.agentsByCategory).map(([cat, agents], i) => ({
      label: cat,
      value: agents.length,
      color: ['#ef4444','#14b8a6','#ec4899','#14b8a6'][i % 4],
    }))
  , [analytics.agentsByCategory]);

  const roleDonutData = useMemo(() =>
    Object.entries(analytics.userRoles).map(([r, count]) => ({
      label: ROLE_LABELS[r] || r,
      value: count,
      color: ROLE_COLORS[r] || '#64748b',
    }))
  , [analytics.userRoles]);

  // Spark line fake data for KPIs
  const sparkSkills = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ value: Math.round(analytics.accessibleSkills * (0.7 + Math.random() * 0.3)) })), [analytics.accessibleSkills]);
  const sparkAgents = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ value: Math.round(analytics.totalAgents * (0.8 + Math.random() * 0.2)) })), [analytics.totalAgents]);
  const sparkProjects = useMemo(() => Array.from({ length: 7 }, (_, i) => ({ value: Math.round(analytics.aiDirStats.totalProjects * (0.75 + Math.random() * 0.25)) })), [analytics.aiDirStats.totalProjects]);

  const tabs = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'skills', label: 'Skills Analytics', icon: '🧠' },
    { id: 'agents', label: 'Agent Analytics', icon: '🤖' },
    { id: 'directory', label: 'AI Directory', icon: '🌐' },
    ...(role === 'admin' || role === 'manager' ? [{ id: 'users', label: 'User Analytics', icon: '👥' }] : []),
    { id: 'reports', label: 'Reports', icon: '📄' },
  ];

  return (
    <div style={{ maxWidth: 1440, margin: '0 auto', padding: '24px' }}>
      {/* Header with infographic background */}
      <div style={{ position: 'relative', borderRadius: 20, overflow: 'hidden', marginBottom: 28, background: 'linear-gradient(135deg, rgba(13,148,136,0.12) 0%, rgba(20,184,166,0.08) 50%, rgba(236,72,153,0.06) 100%)', border: '1px solid var(--border)' }}>
        <div style={{ position: 'absolute', top: 0, right: 0, width: '45%', height: '100%', opacity: 0.15 }}>
          <img src="/images/hero-dashboard.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, padding: '36px 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <span style={{ fontSize: '1.5rem' }}>📊</span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, background: 'var(--gradient-1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Marq AI Dashboard</h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: 500 }}>
            Real-time analytics and insights for your Marq AI Skills Platform. Track skills, agents, projects, and user engagement — all in one place.
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <span style={{ fontSize: '0.7rem', fontWeight: 600, color: ROLE_COLORS[role], background: ROLE_COLORS[role] + '20', padding: '4px 10px', borderRadius: 6 }}>{ROLE_LABELS[role]} View</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', background: 'var(--bg-card)', padding: '4px 10px', borderRadius: 6, border: '1px solid var(--border)' }}>{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            padding: '10px 18px', borderRadius: 10, cursor: 'pointer',
            background: activeTab === tab.id ? 'rgba(13,148,136,0.12)' : 'var(--bg-card)',
            border: `1px solid ${activeTab === tab.id ? 'rgba(13,148,136,0.3)' : 'var(--border)'}`,
            color: activeTab === tab.id ? 'var(--accent-light)' : 'var(--text-secondary)',
            fontSize: '0.82rem', fontWeight: activeTab === tab.id ? 600 : 400,
            transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: 6,
            whiteSpace: 'nowrap',
          }}>
            <span>{tab.icon}</span> {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div>
          {/* KPI Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
            <KPICard icon="🧠" label="Skills" value={analytics.accessibleSkills} change={12} changeDir="up" color="#0d9488" sparkData={sparkSkills} />
            <KPICard icon="🤖" label="Agents" value={analytics.totalAgents} change={8} changeDir="up" color="#14b8a6" sparkData={sparkAgents} />
            <KPICard icon="🌐" label="AI Projects" value={analytics.aiDirStats.totalProjects} change={15} changeDir="up" color="#ec4899" sparkData={sparkProjects} />
            <KPICard icon="📂" label="Categories" value={analytics.totalCategories} color="#10b981" sparkData={[]} />
            {(role === 'admin' || role === 'manager') && (
              <KPICard icon="👥" label="Users" value={analytics.users} change={5} changeDir="up" color="#f59e0b" sparkData={[]} />
            )}
          </div>

          {/* Charts Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20, marginBottom: 28 }}>
            {/* Skills Distribution Donut */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
              <SectionHeader title="Skills Distribution" icon="🧠" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <DonutChart data={skillsDonutData} centerLabel={analytics.accessibleSkills} centerSub="Skills" />
                <div style={{ flex: 1, minWidth: 150 }}>
                  {skillsDonutData.slice(0, 6).map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flexShrink: 0 }} />
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', flex: 1 }}>{d.label}</div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>{d.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Platform Gauges */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
              <SectionHeader title="Platform Coverage" icon="📈" />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 16, justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <RadialGauge value={analytics.accessibleSkills} max={analytics.totalSkills} color="#0d9488" label="Skills Access" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <RadialGauge value={analytics.totalAgents} max={9} color="#14b8a6" label="Agents" />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <RadialGauge value={analytics.aiDirStats.totalCategories} max={14} color="#ec4899" label="AI Categories" />
                </div>
              </div>
            </div>
          </div>

          {/* Infographic Banner */}
          <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 28, position: 'relative', border: '1px solid var(--border)' }}>
            <img src="/images/platform-overview.png" alt="Platform Overview" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(10,10,15,0.85) 0%, rgba(10,10,15,0.4) 60%, transparent 100%)', display: 'flex', alignItems: 'center', padding: '0 32px' }}>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>Marq AI Ecosystem</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: 360 }}>An integrated platform of {analytics.totalSkills}+ skills, {analytics.totalAgents} AI agents, and {analytics.aiDirStats.totalProjects} curated AI projects — all accessible through a role-based interface.</div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <SectionHeader title="Recent Activity" icon="⚡" />
            <ActivityItem icon="🧠" text="Skills Library updated with new categories" time="2 hours ago" color="#0d9488" />
            <ActivityItem icon="🤖" text="Agent response simulator improved" time="5 hours ago" color="#14b8a6" />
            <ActivityItem icon="🌐" text="AI Directory expanded to 931 projects" time="1 day ago" color="#ec4899" />
            <ActivityItem icon="🔒" text="RBAC permissions reviewed" time="2 days ago" color="#10b981" />
            <ActivityItem icon="📊" text="Dashboard analytics module launched" time="3 days ago" color="#f59e0b" />
          </div>
        </div>
      )}

      {/* ── SKILLS ANALYTICS TAB ── */}
      {activeTab === 'skills' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
            <KPICard icon="🧠" label="Total Skills" value={analytics.accessibleSkills} color="#0d9488" />
            <KPICard icon="📂" label="Categories" value={Object.keys(analytics.skillsByCategory).length} color="#14b8a6" />
            <KPICard icon="📊" label="Avg per Category" value={Math.round(analytics.accessibleSkills / (Object.keys(analytics.skillsByCategory).length || 1))} color="#ec4899" />
            <KPICard icon="🎯" label="Access Rate" value={`${Math.round((analytics.accessibleSkills / analytics.totalSkills) * 100)}%`} color="#10b981" />
          </div>

          {/* Skills Bar Chart */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24, marginBottom: 28 }}>
            <SectionHeader title="Skills by Category" icon="📊" />
            <BarChart data={skillsBarData} height={220} />
          </div>

          {/* Category Detail Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16, marginBottom: 28 }}>
            {Object.entries(analytics.skillsByCategory).map(([cat, skills], i) => (
              <div key={cat} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 20, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '3px', background: COLORS[i % COLORS.length] }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                  <span style={{ fontSize: '1.3rem' }}>{skills[0]?.icon || '📁'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.92rem', fontWeight: 600, color: 'var(--text-primary)' }}>{cat}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{skills.length} skills</div>
                  </div>
                  <RadialGauge value={skills.length} max={30} size={50} color={COLORS[i % COLORS.length]} />
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                  {skills.slice(0, 5).map(s => (
                    <span key={s.slug} style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', background: 'rgba(13,148,136,0.06)', padding: '2px 6px', borderRadius: 4 }}>{s.name}</span>
                  ))}
                  {skills.length > 5 && <span style={{ fontSize: '0.65rem', color: 'var(--accent-light)', padding: '2px 6px' }}>+{skills.length - 5} more</span>}
                </div>
              </div>
            ))}
          </div>

          {/* Infographic */}
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img src="/images/skills-library.png" alt="Skills Library" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', display: 'none' }} />
          </div>
        </div>
      )}

      {/* ── AGENTS ANALYTICS TAB ── */}
      {activeTab === 'agents' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
            <KPICard icon="🤖" label="Total Agents" value={analytics.totalAgents} color="#14b8a6" />
            <KPICard icon="⚡" label="Execution" value={(analytics.agentsByCategory['Execution'] || []).length} color="#ef4444" />
            <KPICard icon="🔗" label="Coordination" value={(analytics.agentsByCategory['Coordination'] || []).length} color="#0d9488" />
            <KPICard icon="🎨" label="Design" value={(analytics.agentsByCategory['Design'] || []).length} color="#ec4899" />
            <KPICard icon="🧭" label="Navigation" value={(analytics.agentsByCategory['Navigation'] || []).length} color="#14b8a6" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20, marginBottom: 28 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
              <SectionHeader title="Agent Distribution" icon="🤖" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <DonutChart data={agentDonutData} centerLabel={analytics.totalAgents} centerSub="Agents" />
                <div>
                  {agentDonutData.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{d.label}</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{d.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
              <SectionHeader title="Agent Capabilities" icon="⚡" />
              {Object.entries(analytics.agentsByCategory).map(([cat, agents]) => (
                <div key={cat} style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 8 }}>{cat}</div>
                  {agents.map(agent => (
                    <div key={agent.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                      <span style={{ fontSize: '0.8rem' }}>{agent.icon}</span>
                      <div style={{ flex: 1, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{agent.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', background: agent.color + '12', padding: '2px 6px', borderRadius: 4 }}>{agent.capabilities?.length || 0} caps</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Infographic */}
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img src="/images/ai-agents.png" alt="AI Agents" style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      )}

      {/* ── AI DIRECTORY TAB ── */}
      {activeTab === 'directory' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
            <KPICard icon="🌐" label="Total Projects" value={analytics.aiDirStats.totalProjects} color="#ec4899" />
            <KPICard icon="📂" label="Categories" value={analytics.aiDirStats.totalCategories} color="#0d9488" />
            <KPICard icon="🏷️" label="Subcategories" value={analytics.aiDirStats.totalSubcategories} color="#14b8a6" />
          </div>

          <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 28, position: 'relative', border: '1px solid var(--border)' }}>
            <img src="/images/ai-directory.png" alt="AI Directory" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(10,10,15,0.85) 0%, rgba(10,10,15,0.4) 60%, transparent 100%)', display: 'flex', alignItems: 'center', padding: '0 32px' }}>
              <div>
                <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4 }}>AI Project Directory</div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', maxWidth: 360 }}>Browse {analytics.aiDirStats.totalProjects} curated AI projects across {analytics.aiDirStats.totalCategories} categories — from core frameworks to specialized domain tools.</div>
              </div>
            </div>
          </div>

          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
            <SectionHeader title="Projects by Category" icon="📊" />
            <BarChart data={Object.entries(analytics.aiDirStats.categories || {}).map(([cat, count], i) => ({
              label: cat.replace(/^\d+\.\s/, '').split(' & ')[0].split(' / ')[0],
              value: count,
              color: COLORS[i % COLORS.length],
            })).sort((a, b) => b.value - a.value)} height={200} />
          </div>
        </div>
      )}

      {/* ── USER ANALYTICS TAB ── */}
      {activeTab === 'users' && (role === 'admin' || role === 'manager') && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 28 }}>
            <KPICard icon="👥" label="Total Users" value={analytics.users} color="#f59e0b" />
            <KPICard icon="🔴" label="Admins" value={analytics.userRoles.admin || 0} color="#ef4444" />
            <KPICard icon="🟡" label="Managers" value={analytics.userRoles.manager || 0} color="#f59e0b" />
            <KPICard icon="🔵" label="Editors" value={analytics.userRoles.editor || 0} color="#3b82f6" />
            <KPICard icon="🟢" label="Viewers" value={analytics.userRoles.viewer || 0} color="#10b981" />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 20, marginBottom: 28 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
              <SectionHeader title="Users by Role" icon="👥" />
              <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <DonutChart data={roleDonutData} centerLabel={analytics.users} centerSub="Users" />
                <div>
                  {roleDonutData.map((d, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: d.color }} />
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>{d.label}</div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>{d.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
              <SectionHeader title="Role Permissions Matrix" icon="🔒" />
              {['admin', 'manager', 'editor', 'viewer'].map(r => (
                <div key={r} style={{ marginBottom: 12, padding: '10px 14px', background: 'var(--bg-primary)', borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 600, color: ROLE_COLORS[r] }}>{ROLE_LABELS[r]}</span>
                    <RadialGauge value={r === 'admin' ? 12 : r === 'manager' ? 6 : r === 'editor' ? 5 : 3} max={12} size={36} color={ROLE_COLORS[r]} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Infographic */}
          <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img src="/images/role-access.png" alt="Role Access" style={{ width: '100%', height: 200, objectFit: 'cover', display: 'block' }} />
          </div>
        </div>
      )}

      {/* ── REPORTS TAB ── */}
      {activeTab === 'reports' && (
        <div>
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 28, marginBottom: 28 }}>
            <SectionHeader title="Generate Report" icon="📄" action={<ReportDownloader analytics={analytics} userRole={role} />} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: 20, lineHeight: 1.6 }}>
              Download a comprehensive report of your Marq AI Skills Platform analytics. Reports include skills distribution, agent capabilities, AI directory statistics, and user metrics based on your current role access.
            </p>

            {/* Report Preview */}
            <div style={{ background: 'var(--bg-primary)', borderRadius: 12, border: '1px solid var(--border)', padding: 20 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Report Preview</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
                <div style={{ padding: 12, background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Platform</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>Marq AI Skills</div>
                </div>
                <div style={{ padding: 12, background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Role</div>
                  <div style={{ fontSize: '0.85rem', color: ROLE_COLORS[role] }}>{ROLE_LABELS[role]}</div>
                </div>
                <div style={{ padding: 12, background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Skills</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{analytics.accessibleSkills} of {analytics.totalSkills}</div>
                </div>
                <div style={{ padding: 12, background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Agents</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{analytics.totalAgents}</div>
                </div>
                <div style={{ padding: 12, background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>AI Projects</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{analytics.aiDirStats.totalProjects}</div>
                </div>
                <div style={{ padding: 12, background: 'var(--bg-card)', borderRadius: 8, border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4 }}>Generated</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats Summary for Report */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Skills Summary</div>
              {Object.entries(analytics.skillsByCategory).sort((a, b) => b[1].length - a[1].length).map(([cat, skills], i) => (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 0', borderBottom: '1px solid var(--border)' }}>
                  <div style={{ width: 8, height: 8, borderRadius: 2, background: COLORS[i % COLORS.length], flexShrink: 0 }} />
                  <div style={{ flex: 1, fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{cat}</div>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-primary)' }}>{skills.length}</div>
                </div>
              ))}
            </div>

            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: 24 }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: 16 }}>Agent Summary</div>
              {Object.entries(analytics.agentsByCategory).map(([cat, agents]) => (
                <div key={cat} style={{ marginBottom: 12 }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 6 }}>{cat} ({agents.length})</div>
                  {agents.map(a => (
                    <div key={a.id} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '4px 0 4px 12px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      <span>{a.icon}</span> {a.name}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
