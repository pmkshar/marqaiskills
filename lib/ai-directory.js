// Marq AI Directory - Curated AI Projects & Resources
// Part of the Marq AI Skills Platform

import fs from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'ai-directory.json');

const CATEGORY_META = {
  '1. Core Frameworks & Libraries': { icon: '🧱', color: '#6366f1', shortName: 'Core Frameworks' },
  '2. Model Codebases & Model Families': { icon: '🤖', color: '#8b5cf6', shortName: 'Model Families' },
  '3. Inference Engines & Serving': { icon: '⚡', color: '#f59e0b', shortName: 'Inference & Serving' },
  '4. Agentic AI & Multi-Agent Systems': { icon: '🤝', color: '#ef4444', shortName: 'Agentic AI' },
  '5. Retrieval-Augmented Generation (RAG) & Knowledge': { icon: '📚', color: '#14b8a6', shortName: 'RAG & Knowledge' },
  '6. Generative Media Tools': { icon: '🎨', color: '#ec4899', shortName: 'Generative Media' },
  '7. Training & Fine-tuning Ecosystem': { icon: '🏋️', color: '#f97316', shortName: 'Training & Fine-tuning' },
  '8. MLOps / LLMOps & Production': { icon: '🔧', color: '#64748b', shortName: 'MLOps & Production' },
  '9. Evaluation, Benchmarks & Datasets': { icon: '📊', color: '#3b82f6', shortName: 'Evaluation & Benchmarks' },
  '10. AI Safety, Alignment & Interpretability': { icon: '🛡️', color: '#dc2626', shortName: 'AI Safety' },
  '11. Specialized Domains': { icon: '🔬', color: '#059669', shortName: 'Specialized Domains' },
  '12. User Interfaces & Self-hosted Platforms': { icon: '🖥️', color: '#7c3aed', shortName: 'UIs & Platforms' },
  '13. Developer Tools & Integrations': { icon: '🛠️', color: '#0284c7', shortName: 'Developer Tools' },
  '14. Resources & Learning': { icon: '📖', color: '#a21caf', shortName: 'Resources & Learning' },
};

// Role-based access to categories
const CATEGORY_ACCESS = {
  admin: Object.keys(CATEGORY_META),
  manager: Object.keys(CATEGORY_META),
  editor: [
    '1. Core Frameworks & Libraries',
    '2. Model Codebases & Model Families',
    '3. Inference Engines & Serving',
    '7. Training & Fine-tuning Ecosystem',
    '8. MLOps / LLMOps & Production',
    '11. Specialized Domains',
    '13. Developer Tools & Integrations',
    '14. Resources & Learning',
  ],
  viewer: [
    '1. Core Frameworks & Libraries',
    '2. Model Codebases & Model Families',
    '14. Resources & Learning',
  ],
};

function loadProjects() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error loading AI directory data:', e);
  }
  return [];
}

export function getAllProjects() {
  return loadProjects();
}

export function getProjectsByCategory(role) {
  const projects = loadProjects();
  const accessibleCategories = CATEGORY_ACCESS[role] || CATEGORY_ACCESS.viewer;
  
  const filtered = projects.filter(p => accessibleCategories.includes(p.category));
  const grouped = {};
  
  for (const project of filtered) {
    if (!grouped[project.category]) {
      grouped[project.category] = {};
    }
    if (!grouped[project.category][project.subcategory]) {
      grouped[project.category][project.subcategory] = [];
    }
    grouped[project.category][project.subcategory].push(project);
  }
  
  return grouped;
}

export function getCategories(role) {
  const accessibleCategories = CATEGORY_ACCESS[role] || CATEGORY_ACCESS.viewer;
  const categories = {};
  const projects = loadProjects();
  
  for (const cat of accessibleCategories) {
    const meta = CATEGORY_META[cat];
    if (meta) {
      const count = projects.filter(p => p.category === cat).length;
      categories[cat] = { ...meta, count };
    }
  }
  
  return categories;
}

export function searchProjects(query, role, industry) {
  const projects = loadProjects();
  const accessibleCategories = CATEGORY_ACCESS[role] || CATEGORY_ACCESS.viewer;
  let filtered = projects.filter(p => accessibleCategories.includes(p.category));
  
  // Filter by industry if specified
  if (industry && industry !== 'all') {
    filtered = filtered.filter(p => p.industry && p.industry.includes(industry));
  }
  
  if (!query.trim()) return filtered;
  
  const q = query.toLowerCase();
  return filtered.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.subcategory.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.url.toLowerCase().includes(q) ||
    (p.industry && p.industry.some(i => i.toLowerCase().includes(q)))
  );
}

export function getStats(role) {
  const projects = loadProjects();
  const accessibleCategories = CATEGORY_ACCESS[role] || CATEGORY_ACCESS.viewer;
  const accessible = projects.filter(p => accessibleCategories.includes(p.category));
  
  const categories = {};
  let subcategories = new Set();
  for (const p of accessible) {
    if (!categories[p.category]) categories[p.category] = 0;
    categories[p.category]++;
    subcategories.add(p.subcategory);
  }
  
  return {
    totalProjects: accessible.length,
    totalCategories: Object.keys(categories).length,
    totalSubcategories: subcategories.size,
    categories,
  };
}

// Industry configuration
const INDUSTRY_META = {
  'Technology & Software': { icon: '💻', color: '#10B981', shortName: 'Technology' },
  'Healthcare & Life Sciences': { icon: '🏥', color: '#EC4899', shortName: 'Healthcare' },
  'Finance & Banking': { icon: '🏦', color: '#F59E0B', shortName: 'Finance' },
  'Retail & E-Commerce': { icon: '🛒', color: '#EF4444', shortName: 'Retail' },
  'Manufacturing & Supply Chain': { icon: '🏭', color: '#06B6D4', shortName: 'Manufacturing' },
  'Education & Training': { icon: '🎓', color: '#8B5CF6', shortName: 'Education' },
  'Telecommunications': { icon: '📡', color: '#3B82F6', shortName: 'Telecom' },
  'Energy & Utilities': { icon: '⚡', color: '#F97316', shortName: 'Energy' },
  'Media & Entertainment': { icon: '🎬', color: '#A21CAF', shortName: 'Media' },
  'Legal & Compliance': { icon: '⚖️', color: '#64748B', shortName: 'Legal' },
};

export function getIndustries(role) {
  const projects = loadProjects();
  const accessibleCategories = CATEGORY_ACCESS[role] || CATEGORY_ACCESS.viewer;
  const accessible = projects.filter(p => accessibleCategories.includes(p.category));
  
  const industries = {};
  for (const p of accessible) {
    if (p.industry) {
      for (const ind of p.industry) {
        if (!industries[ind]) industries[ind] = 0;
        industries[ind]++;
      }
    }
  }
  
  const result = {};
  for (const [ind, count] of Object.entries(industries)) {
    const meta = INDUSTRY_META[ind];
    if (meta) {
      result[ind] = { ...meta, count };
    }
  }
  
  return result;
}

export { CATEGORY_META, CATEGORY_ACCESS, INDUSTRY_META };
