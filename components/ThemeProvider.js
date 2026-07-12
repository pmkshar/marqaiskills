'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const ThemeContext = createContext();

export const THEMES = {
  'midnight-purple': {
    name: 'Midnight Purple',
    icon: '🌙',
    preview: ['#6366f1', '#8b5cf6', '#1a1a2e'],
    vars: {
      '--bg-primary': '#0a0a0f',
      '--bg-secondary': '#12121a',
      '--bg-card': '#1a1a2e',
      '--bg-card-hover': '#242445',
      '--text-primary': '#f0f0f5',
      '--text-secondary': '#a0a0b8',
      '--text-muted': '#6b6b80',
      '--accent': '#6366f1',
      '--accent-light': '#818cf8',
      '--border': '#2a2a40',
      '--gradient-1': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
      '--gradient-2': 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
      '--gradient-3': 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
      '--gradient-4': 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
      '--shadow-sm': '0 2px 8px rgba(0,0,0,0.2)',
      '--shadow-md': '0 4px 16px rgba(0,0,0,0.3)',
      '--shadow-lg': '0 8px 32px rgba(0,0,0,0.4)',
      '--shadow-glow': '0 0 20px rgba(99,102,241,0.15)',
      '--nav-bg': 'rgba(10,10,15,0.9)',
    },
  },
  'ocean-blue': {
    name: 'Ocean Blue',
    icon: '🌊',
    preview: ['#0ea5e9', '#06b6d4', '#0c1929'],
    vars: {
      '--bg-primary': '#070d15',
      '--bg-secondary': '#0c1929',
      '--bg-card': '#112240',
      '--bg-card-hover': '#1a3355',
      '--text-primary': '#ccd6f6',
      '--text-secondary': '#8892b0',
      '--text-muted': '#5a6580',
      '--accent': '#0ea5e9',
      '--accent-light': '#38bdf8',
      '--border': '#1e3456',
      '--gradient-1': 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 50%, #22d3ee 100%)',
      '--gradient-2': 'linear-gradient(135deg, #070d15 0%, #112240 100%)',
      '--gradient-3': 'linear-gradient(135deg, #f472b6 0%, #06b6d4 50%, #0ea5e9 100%)',
      '--gradient-4': 'linear-gradient(135deg, #34d399 0%, #06b6d4 50%, #0ea5e9 100%)',
      '--shadow-sm': '0 2px 8px rgba(0,0,0,0.25)',
      '--shadow-md': '0 4px 16px rgba(0,0,0,0.35)',
      '--shadow-lg': '0 8px 32px rgba(0,0,0,0.45)',
      '--shadow-glow': '0 0 20px rgba(14,165,233,0.15)',
      '--nav-bg': 'rgba(7,13,21,0.9)',
    },
  },
  'emerald-dark': {
    name: 'Emerald Dark',
    icon: '💚',
    preview: ['#10b981', '#059669', '#0a1a14'],
    vars: {
      '--bg-primary': '#060f0b',
      '--bg-secondary': '#0a1a14',
      '--bg-card': '#0f2a1f',
      '--bg-card-hover': '#163d2d',
      '--text-primary': '#e0f5ec',
      '--text-secondary': '#8cb8a4',
      '--text-muted': '#5a7d6b',
      '--accent': '#10b981',
      '--accent-light': '#34d399',
      '--border': '#1a4032',
      '--gradient-1': 'linear-gradient(135deg, #10b981 0%, #059669 50%, #34d399 100%)',
      '--gradient-2': 'linear-gradient(135deg, #060f0b 0%, #0f2a1f 100%)',
      '--gradient-3': 'linear-gradient(135deg, #fbbf24 0%, #10b981 50%, #059669 100%)',
      '--gradient-4': 'linear-gradient(135deg, #06b6d4 0%, #10b981 50%, #34d399 100%)',
      '--shadow-sm': '0 2px 8px rgba(0,0,0,0.2)',
      '--shadow-md': '0 4px 16px rgba(0,0,0,0.3)',
      '--shadow-lg': '0 8px 32px rgba(0,0,0,0.4)',
      '--shadow-glow': '0 0 20px rgba(16,185,129,0.15)',
      '--nav-bg': 'rgba(6,15,11,0.9)',
    },
  },
  'sunset-orange': {
    name: 'Sunset Orange',
    icon: '🌅',
    preview: ['#f97316', '#ef4444', '#1a0f0a'],
    vars: {
      '--bg-primary': '#0f0a07',
      '--bg-secondary': '#1a0f0a',
      '--bg-card': '#2d1a10',
      '--bg-card-hover': '#3d2518',
      '--text-primary': '#fde8d8',
      '--text-secondary': '#c4a088',
      '--text-muted': '#7d6050',
      '--accent': '#f97316',
      '--accent-light': '#fb923c',
      '--border': '#3d2518',
      '--gradient-1': 'linear-gradient(135deg, #f97316 0%, #ef4444 50%, #f59e0b 100%)',
      '--gradient-2': 'linear-gradient(135deg, #0f0a07 0%, #2d1a10 100%)',
      '--gradient-3': 'linear-gradient(135deg, #ec4899 0%, #f97316 50%, #ef4444 100%)',
      '--gradient-4': 'linear-gradient(135deg, #10b981 0%, #f59e0b 50%, #f97316 100%)',
      '--shadow-sm': '0 2px 8px rgba(0,0,0,0.25)',
      '--shadow-md': '0 4px 16px rgba(0,0,0,0.35)',
      '--shadow-lg': '0 8px 32px rgba(0,0,0,0.45)',
      '--shadow-glow': '0 0 20px rgba(249,115,22,0.15)',
      '--nav-bg': 'rgba(15,10,7,0.9)',
    },
  },
  'rose-gold': {
    name: 'Rose Gold',
    icon: '🌸',
    preview: ['#ec4899', '#f472b6', '#1a0f18'],
    vars: {
      '--bg-primary': '#0d070b',
      '--bg-secondary': '#1a0f18',
      '--bg-card': '#2d1a2a',
      '--bg-card-hover': '#3d2538',
      '--text-primary': '#fde2f0',
      '--text-secondary': '#c49ab8',
      '--text-muted': '#7d5d70',
      '--accent': '#ec4899',
      '--accent-light': '#f472b6',
      '--border': '#3d2538',
      '--gradient-1': 'linear-gradient(135deg, #ec4899 0%, #f472b6 50%, #fb7185 100%)',
      '--gradient-2': 'linear-gradient(135deg, #0d070b 0%, #2d1a2a 100%)',
      '--gradient-3': 'linear-gradient(135deg, #a78bfa 0%, #ec4899 50%, #f472b6 100%)',
      '--gradient-4': 'linear-gradient(135deg, #06b6d4 0%, #ec4899 50%, #f472b6 100%)',
      '--shadow-sm': '0 2px 8px rgba(0,0,0,0.2)',
      '--shadow-md': '0 4px 16px rgba(0,0,0,0.3)',
      '--shadow-lg': '0 8px 32px rgba(0,0,0,0.4)',
      '--shadow-glow': '0 0 20px rgba(236,72,153,0.15)',
      '--nav-bg': 'rgba(13,7,11,0.9)',
    },
  },
  'light-clinical': {
    name: 'Light',
    icon: '☀️',
    preview: ['#6366f1', '#818cf8', '#f8f9fc'],
    vars: {
      '--bg-primary': '#f5f6fa',
      '--bg-secondary': '#ffffff',
      '--bg-card': '#ffffff',
      '--bg-card-hover': '#f0f1f5',
      '--text-primary': '#1a1a2e',
      '--text-secondary': '#4a4a68',
      '--text-muted': '#8888a0',
      '--accent': '#6366f1',
      '--accent-light': '#818cf8',
      '--border': '#e2e4ee',
      '--gradient-1': 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
      '--gradient-2': 'linear-gradient(135deg, #f5f6fa 0%, #ffffff 100%)',
      '--gradient-3': 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 50%, #6366f1 100%)',
      '--gradient-4': 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
      '--shadow-sm': '0 1px 3px rgba(0,0,0,0.06)',
      '--shadow-md': '0 4px 12px rgba(0,0,0,0.08)',
      '--shadow-lg': '0 8px 24px rgba(0,0,0,0.10)',
      '--shadow-glow': '0 0 12px rgba(99,102,241,0.08)',
      '--nav-bg': 'rgba(255,255,255,0.92)',
    },
  },
  'cyber-neon': {
    name: 'Cyber Neon',
    icon: '⚡',
    preview: ['#00ff88', '#00ccff', '#0a0a0a'],
    vars: {
      '--bg-primary': '#050505',
      '--bg-secondary': '#0a0a0a',
      '--bg-card': '#111111',
      '--bg-card-hover': '#1a1a1a',
      '--text-primary': '#e0ffe0',
      '--text-secondary': '#88cc88',
      '--text-muted': '#448844',
      '--accent': '#00ff88',
      '--accent-light': '#33ff99',
      '--border': '#1a3a1a',
      '--gradient-1': 'linear-gradient(135deg, #00ff88 0%, #00ccff 50%, #00ff88 100%)',
      '--gradient-2': 'linear-gradient(135deg, #050505 0%, #111111 100%)',
      '--gradient-3': 'linear-gradient(135deg, #ff0080 0%, #00ccff 50%, #00ff88 100%)',
      '--gradient-4': 'linear-gradient(135deg, #ffcc00 0%, #00ff88 50%, #00ccff 100%)',
      '--shadow-sm': '0 2px 8px rgba(0,0,0,0.3)',
      '--shadow-md': '0 4px 16px rgba(0,0,0,0.4)',
      '--shadow-lg': '0 8px 32px rgba(0,0,0,0.5)',
      '--shadow-glow': '0 0 20px rgba(0,255,136,0.2)',
      '--nav-bg': 'rgba(5,5,5,0.9)',
    },
  },
  'clean-teal': {
    name: 'Clean Teal',
    icon: '✨',
    preview: ['#0d9488', '#14b8a6', '#ffffff'],
    vars: {
      '--bg-primary': '#ffffff',
      '--bg-secondary': '#f9fafb',
      '--bg-card': '#ffffff',
      '--bg-card-hover': '#f0fdfa',
      '--text-primary': '#111111',
      '--text-secondary': '#6b7280',
      '--text-muted': '#9ca3af',
      '--accent': '#0d9488',
      '--accent-light': '#14b8a6',
      '--border': '#e5e7eb',
      '--gradient-1': 'linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #2dd4bf 100%)',
      '--gradient-2': 'linear-gradient(135deg, #ffffff 0%, #f0fdfa 100%)',
      '--gradient-3': 'linear-gradient(135deg, #ec4899 0%, #0d9488 50%, #14b8a6 100%)',
      '--gradient-4': 'linear-gradient(135deg, #10b981 0%, #14b8a6 50%, #06b6d4 100%)',
      '--shadow-sm': '0 1px 2px rgba(0,0,0,0.05)',
      '--shadow-md': '0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)',
      '--shadow-lg': '0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06)',
      '--shadow-glow': '0 0 12px rgba(13,148,136,0.08)',
      '--nav-bg': 'rgba(255,255,255,0.8)',
    },
  },
  'aurora-nordic': {
    name: 'Aurora Nordic',
    icon: '🌌',
    preview: ['#7dd3fc', '#c4b5fd', '#0e1525'],
    vars: {
      '--bg-primary': '#0b1120',
      '--bg-secondary': '#0e1525',
      '--bg-card': '#162036',
      '--bg-card-hover': '#1e2d48',
      '--text-primary': '#e8f0fe',
      '--text-secondary': '#94a8c4',
      '--text-muted': '#5a7090',
      '--accent': '#7dd3fc',
      '--accent-light': '#a5d8ff',
      '--border': '#1e3050',
      '--gradient-1': 'linear-gradient(135deg, #7dd3fc 0%, #c4b5fd 50%, #f0abfc 100%)',
      '--gradient-2': 'linear-gradient(135deg, #0b1120 0%, #162036 100%)',
      '--gradient-3': 'linear-gradient(135deg, #f0abfc 0%, #c4b5fd 50%, #7dd3fc 100%)',
      '--gradient-4': 'linear-gradient(135deg, #6ee7b7 0%, #7dd3fc 50%, #c4b5fd 100%)',
      '--shadow-sm': '0 2px 8px rgba(0,0,0,0.25)',
      '--shadow-md': '0 4px 16px rgba(0,0,0,0.35)',
      '--shadow-lg': '0 8px 32px rgba(0,0,0,0.45)',
      '--shadow-glow': '0 0 20px rgba(125,211,252,0.12)',
      '--nav-bg': 'rgba(11,17,32,0.9)',
    },
  },
};

const DEFAULT_THEME = 'clean-teal';
const STORAGE_KEY = 'marq-ai-theme';

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(DEFAULT_THEME);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && THEMES[saved]) {
        setThemeState(saved);
      }
    } catch (e) {
      // Ignore localStorage errors
    }
    setMounted(true);
  }, []);

  const applyTheme = useCallback((themeKey) => {
    const themeData = THEMES[themeKey];
    if (!themeData) return;

    const root = document.documentElement;
    for (const [key, value] of Object.entries(themeData.vars)) {
      root.style.setProperty(key, value);
    }
    root.setAttribute('data-theme', themeKey);
  }, []);

  useEffect(() => {
    if (mounted) {
      applyTheme(theme);
    }
  }, [theme, mounted, applyTheme]);

  const setTheme = useCallback((themeKey) => {
    if (!THEMES[themeKey]) return;
    setThemeState(themeKey);
    try {
      localStorage.setItem(STORAGE_KEY, themeKey);
    } catch (e) {
      // Ignore
    }
    applyTheme(themeKey);
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes: THEMES, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    // Return safe defaults for SSR
    return { theme: DEFAULT_THEME, setTheme: () => {}, themes: THEMES, mounted: false };
  }
  return context;
}
