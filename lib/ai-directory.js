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

// Cache for loaded projects
let _projectsCache = null;

function loadProjects() {
  if (_projectsCache) return _projectsCache;
  
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      _projectsCache = JSON.parse(data);
      return _projectsCache;
    }
  } catch (e) {
    console.error('Error loading AI directory data:', e.message);
  }
  
  // Fallback: try require
  try {
    _projectsCache = require('../data/ai-directory.json');
    return _projectsCache;
  } catch (e2) {
    // Ignore
  }
  
  _projectsCache = [];
  return _projectsCache;
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

export function searchProjects(query, role) {
  const projects = loadProjects();
  const accessibleCategories = CATEGORY_ACCESS[role] || CATEGORY_ACCESS.viewer;
  const filtered = projects.filter(p => accessibleCategories.includes(p.category));
  
  if (!query.trim()) return filtered;
  
  const q = query.toLowerCase();
  return filtered.filter(p =>
    p.name.toLowerCase().includes(q) ||
    p.description.toLowerCase().includes(q) ||
    p.subcategory.toLowerCase().includes(q) ||
    p.category.toLowerCase().includes(q) ||
    p.url.toLowerCase().includes(q)
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

export { CATEGORY_META, CATEGORY_ACCESS };
