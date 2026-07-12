import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const SKILLS_DIR = process.cwd();

const CATEGORIES = {
  'AI Agent Architecture': ['agent-army', 'agent-to-agent', 'agent-swarm-deployer', 'agent-team-builder', 'sub-agent-orchestrator', 'scout', 'scout-pro', 'skill-navigator', 'skill-composer-studio'],
  'Marq AI Products': ['overnight-repo-auditor', 'multi-agent-client-onboarding', 'cowork-deal-room', 'gmail-to-crm-pipeline', 'full-codebase-migrator', 'marq-design-system-architect', 'marq-landing-composer', 'marq-design-critic'],
  'Sales and Revenue': ['deal-closer-playbook', 'renewal-predictor', 'expansion-revenue-finder', 'pipeline-health-analyzer', 'deal-review-framework', 'deal-momentum-analyzer', 'sales-forecast-builder', 'sales-call-prep-assistant', 'sales-methodology-implementer', 'lead-scoring-model', 'inbound-lead-qualifier', 'cold-email-sequence-generator', 'personalization-at-scale', 'champion-identifier', 'intent-signal-aggregator', 'objection-pattern-detector', 'lookalike-customer-finder', 'quota-setting-calculator', 'sales-comp-plan-designer', 'sales-coaching-plan-generator', 'ramping-rep-tracker', 'rep-performance-scorecard', 'territory-planning-optimizer', 'icp-deep-scanner', 'customer-panel-of-experts', 'prospect-panel-simulator', 'pricing-change-strategist'],
  'Consulting': ['client-proposal-generator', 'sow-generator', 'client-health-dashboard', 'churn-autopsy', 'onboarding-checklist', 'ai-readiness-assessment', 'saas-replacement-planner', 'roi-calculator', 'meeting-intelligence', 'meeting-to-tasks', 'weekly-business-report'],
  'Engineering & DevOps': ['code-review-pro', 'api-load-tester', 'database-migrator', 'incident-responder', 'runbook-generator', 'data-pipeline-builder', 'dependency-auditor', 'test-coverage-improver', 'docker-debugger', 'env-setup-wizard', 'error-boundary-creator', 'git-pr-reviewer', 'regex-debugger', 'performance-profiler', 'api-endpoint-scaffolder', 'responsive-layout-builder', 'react-component-generator', 'design-system-generator', 'css-animation-creator', 'database-schema-designer', 'screenshot-to-code', 'landing-page-optimizer'],
  'Security & Compliance': ['compliance-checker', 'security-pentest-planner', 'tech-due-diligence', 'contract-analyzer', 'contract-redliner'],
  'Marketing & Content': ['seo-optimizer', 'seo-keyword-cluster-builder', 'landing-page-copywriter', 'brand-voice-analyzer', 'content-repurposer', 'social-repurposer', 'social-selling-content-generator', 'linkedin-post-optimizer', 'utm-parameter-generator', 'competitor-content-analyzer', 'competitor-price-tracker', 'competitor-intel-agent', 'customer-review-aggregator', 'podcast-content-suite', 'webinar-content-repurposer', 'email-template-generator', 'email-subject-line-optimizer', 'product-launch-war-room'],
  'Strategy & Finance': ['pricing-strategy', 'market-sizing', 'pitch-deck-reviewer', 'board-deck-generator', 'investor-update-writer', 'executive-dashboard-generator', 'financial-parser', 'portfolio-analyzer', 'budget-optimizer', 'financial-goal-planner', 'tax-strategy-optimizer'],
  'Operations & People': ['workflow-automator', 'okr-generator', 'customer-journey-mapper', 'hiring-scorecard', 'knowledge-base-builder', 'technical-writer', 'job-application-optimizer', 'raise-negotiation-prep'],
  'Sports & Entertainment': ['bracket-predictor', 'fantasy-lineup-optimizer', 'game-recap-generator', 'game-strategy-simulator', 'highlight-reel-scripter', 'injury-report-tracker', 'play-by-play-generator', 'player-comparison-tool', 'podcast-studio', 'post-game-press-conference-simulator', 'practice-plan-creator', 'scouting-report-builder', 'sports-betting-analyzer', 'sports-meme-creator', 'sports-podcast-outline-generator', 'sports-trivia-builder', 'team-chemistry-evaluator', 'training-log-analyzer', 'trash-talk-generator', 'workout-program-designer'],
};

const CATEGORY_ICONS = {
  'AI Agent Architecture': '🤖',
  'Marq AI Products': '⚡',
  'Sales and Revenue': '💰',
  'Consulting': '📋',
  'Engineering & DevOps': '⚙️',
  'Security & Compliance': '🔒',
  'Marketing & Content': '📢',
  'Strategy & Finance': '📊',
  'Operations & People': '👥',
  'Sports & Entertainment': '🏆',
};

const CATEGORY_COLORS = {
  'AI Agent Architecture': '#6366f1',
  'Marq AI Products': '#8b5cf6',
  'Sales and Revenue': '#10b981',
  'Consulting': '#3b82f6',
  'Engineering & DevOps': '#f59e0b',
  'Security & Compliance': '#ef4444',
  'Marketing & Content': '#ec4899',
  'Strategy & Finance': '#14b8a6',
  'Operations & People': '#64748b',
  'Sports & Entertainment': '#f97316',
};

// Cache for skills data
let _skillsCache = null;

function loadSkillsFromFiles() {
  const skills = [];
  let loadedCount = 0;
  
  for (const [category, skillNames] of Object.entries(CATEGORIES)) {
    for (const skillName of skillNames) {
      const skillPath = path.join(SKILLS_DIR, skillName, 'SKILL.md');
      try {
        if (fs.existsSync(skillPath)) {
          const fileContent = fs.readFileSync(skillPath, 'utf8');
          const { data, content } = matter(fileContent);
          skills.push({
            name: data.name || skillName,
            description: data.description || '',
            content: content.trim(),
            category,
            slug: skillName,
            icon: CATEGORY_ICONS[category] || '📦',
            color: CATEGORY_COLORS[category] || '#6366f1',
          });
          loadedCount++;
        }
      } catch (e) {
        // Skip unreadable skills
      }
    }
  }
  
  return { skills, loadedCount };
}

function loadSkillsFromPrebuilt() {
  try {
    const dataFile = path.join(SKILLS_DIR, 'data', 'skills-data.json');
    if (fs.existsSync(dataFile)) {
      const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
      return Array.isArray(data) ? data : [];
    }
  } catch (e) {
    console.error('Failed to load skills-data.json:', e.message);
  }
  return null;
}

function loadSkillsFromImport() {
  // Final fallback: try to import the JSON directly
  try {
    // eslint-disable-next-line @next/next/no-assign-module-variable
    const data = require('../data/skills-data.json');
    return Array.isArray(data) ? data : [];
  } catch (e) {
    // Ignore
  }
  return null;
}

export function getAllSkills() {
  if (_skillsCache) return _skillsCache;
  
  // Strategy 1: Try reading SKILL.md files directly (local dev)
  const { skills: fileSkills, loadedCount } = loadSkillsFromFiles();
  if (loadedCount > 50) {
    // Successfully loaded most skills from files
    _skillsCache = fileSkills;
    return _skillsCache;
  }
  
  // Strategy 2: Try pre-built JSON data file (Vercel build time)
  const prebuilt = loadSkillsFromPrebuilt();
  if (prebuilt && prebuilt.length > 50) {
    _skillsCache = prebuilt;
    return _skillsCache;
  }
  
  // Strategy 3: Try require import
  const imported = loadSkillsFromImport();
  if (imported && imported.length > 50) {
    _skillsCache = imported;
    return _skillsCache;
  }
  
  // Strategy 4: Use whatever we have (even if partial)
  if (fileSkills.length > 0) {
    _skillsCache = fileSkills;
    return _skillsCache;
  }
  
  // Strategy 5: Generate minimal skill list from CATEGORIES (no content, just metadata)
  _skillsCache = Object.entries(CATEGORIES).flatMap(([category, skillNames]) =>
    skillNames.map(skillName => ({
      name: skillName.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      description: `${skillName} skill in ${category}`,
      content: `# ${skillName}\n\nSkill details available in the full platform.`,
      category,
      slug: skillName,
      icon: CATEGORY_ICONS[category] || '📦',
      color: CATEGORY_COLORS[category] || '#6366f1',
    }))
  );
  
  return _skillsCache;
}

export function getSkillsByCategory() {
  const skills = getAllSkills();
  const grouped = {};
  
  for (const skill of skills) {
    if (!grouped[skill.category]) {
      grouped[skill.category] = [];
    }
    grouped[skill.category].push(skill);
  }
  
  return grouped;
}

export { CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS };
