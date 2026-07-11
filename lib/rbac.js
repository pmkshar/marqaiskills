// Role-Based Access Control Configuration
// Roles: admin, manager, editor, viewer

export const ROLES = {
  admin: {
    label: 'Administrator',
    color: '#ef4444',
    description: 'Full access to all features, user management, and system configuration',
    permissions: [
      'skills:read', 'skills:write', 'skills:delete',
      'users:read', 'users:write', 'users:delete',
      'admin:dashboard', 'admin:settings',
      'categories:read', 'categories:write',
      'profile:read', 'profile:write',
    ],
  },
  manager: {
    label: 'Manager',
    color: '#f59e0b',
    description: 'Manage skills and users, view analytics, moderate content',
    permissions: [
      'skills:read', 'skills:write',
      'users:read',
      'categories:read',
      'profile:read', 'profile:write',
    ],
  },
  editor: {
    label: 'Editor',
    color: '#3b82f6',
    description: 'Create and edit skills, limited user visibility',
    permissions: [
      'skills:read', 'skills:write',
      'categories:read',
      'profile:read', 'profile:write',
    ],
  },
  viewer: {
    label: 'Viewer',
    color: '#10b981',
    description: 'Read-only access to skills and categories',
    permissions: [
      'skills:read',
      'categories:read',
      'profile:read',
    ],
  },
};

// Skill categories visible per role
export const CATEGORY_ACCESS = {
  admin: [
    'AI Agent Architecture', 'Marq AI Products', 'Sales and Revenue', 'Consulting',
    'Engineering & DevOps', 'Security & Compliance', 'Marketing & Content',
    'Strategy & Finance', 'Operations & People', 'Sports & Entertainment',
  ],
  manager: [
    'AI Agent Architecture', 'Marq AI Products', 'Sales and Revenue', 'Consulting',
    'Engineering & DevOps', 'Security & Compliance', 'Marketing & Content',
    'Strategy & Finance', 'Operations & People',
  ],
  editor: [
    'Engineering & DevOps', 'Marketing & Content', 'Operations & People',
  ],
  viewer: [
    'Engineering & DevOps', 'Marketing & Content',
  ],
};

export function hasPermission(role, permission) {
  if (!ROLES[role]) return false;
  return ROLES[role].permissions.includes(permission);
}

export function canAccessCategory(role, category) {
  if (!CATEGORY_ACCESS[role]) return false;
  return CATEGORY_ACCESS[role].includes(category);
}

export function getAccessibleCategories(role) {
  return CATEGORY_ACCESS[role] || [];
}
