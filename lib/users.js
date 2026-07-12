import bcrypt from 'bcryptjs';

// In-memory user store seeded on first access
// For Vercel serverless: users.json is read-only at build time.
// New users are stored in memory for the current function instance.
// For production, swap this with Vercel KV / Postgres / Supabase.

const BCRYPT_ROUNDS = 10;
let DEFAULT_PASSWORD_HASH = null;

function getDefaultPasswordHash() {
  if (!DEFAULT_PASSWORD_HASH) {
    DEFAULT_PASSWORD_HASH = bcrypt.hashSync('password', BCRYPT_ROUNDS);
  }
  return DEFAULT_PASSWORD_HASH;
}

const SEED_USERS = [
  {
    id: 'admin-001',
    name: 'Admin User',
    email: 'admin@marqai.io',
    role: 'admin',
    createdAt: '2025-01-01T00:00:00.000Z',
    status: 'active',
  },
  {
    id: 'manager-001',
    name: 'Manager User',
    email: 'manager@marqai.io',
    role: 'manager',
    createdAt: '2025-01-01T00:00:00.000Z',
    status: 'active',
  },
  {
    id: 'editor-001',
    name: 'Editor User',
    email: 'editor@marqai.io',
    role: 'editor',
    createdAt: '2025-01-01T00:00:00.000Z',
    status: 'active',
  },
  {
    id: 'viewer-001',
    name: 'Viewer User',
    email: 'viewer@marqai.io',
    role: 'viewer',
    createdAt: '2025-01-01T00:00:00.000Z',
    status: 'active',
  },
];

// Runtime user store (persists within a serverless function instance)
let runtimeUsers = null;

function getUsers() {
  if (!runtimeUsers) {
    // Try loading from data/users.json first (for local dev with file persistence)
    try {
      const fs = require('fs');
      const path = require('path');
      const dataFile = path.join(process.cwd(), 'data', 'users.json');
      if (fs.existsSync(dataFile)) {
        const data = JSON.parse(fs.readFileSync(dataFile, 'utf8'));
        // Add password hash to loaded users if missing
        runtimeUsers = data.users.map(u => ({
          ...u,
          password: u.password || getDefaultPasswordHash(),
        }));
        return runtimeUsers;
      }
    } catch (e) {
      // Fall through to seed
      console.error('Failed to load users.json:', e.message);
    }
    // Seed with default users (password hash generated lazily)
    runtimeUsers = SEED_USERS.map(u => ({
      ...u,
      password: getDefaultPasswordHash(),
    }));
  }
  return runtimeUsers;
}

function saveUsers(users) {
  runtimeUsers = users;
  // Try to persist to disk (local dev only)
  try {
    const fs = require('fs');
    const path = require('path');
    const dir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'users.json'), JSON.stringify({ users }, null, 2));
  } catch (e) {
    // Silently fail on Vercel (read-only filesystem)
  }
}

export async function findUserByEmail(email) {
  const users = getUsers();
  return users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
}

export async function findUserById(id) {
  const users = getUsers();
  return users.find(u => u.id === id) || null;
}

export async function getAllUsers() {
  const users = getUsers();
  return users.map(({ password, ...rest }) => rest);
}

export async function createUser({ name, email, password, role = 'viewer' }) {
  const users = getUsers();
  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) throw new Error('Email already exists');
  
  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const newUser = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name,
    email: email.toLowerCase(),
    password: hashedPassword,
    role,
    createdAt: new Date().toISOString(),
    status: 'active',
  };
  users.push(newUser);
  saveUsers(users);
  
  const { password: _, ...userWithoutPassword } = newUser;
  return userWithoutPassword;
}

export async function updateUser(id, updates) {
  const users = getUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) throw new Error('User not found');
  
  if (updates.password) {
    updates.password = await bcrypt.hash(updates.password, BCRYPT_ROUNDS);
  }
  
  users[index] = { ...users[index], ...updates };
  saveUsers(users);
  
  const { password: _, ...userWithoutPassword } = users[index];
  return userWithoutPassword;
}

export async function deleteUser(id) {
  const users = getUsers();
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) throw new Error('User not found');
  saveUsers(filtered);
  return true;
}

export async function verifyPassword(user, password) {
  return bcrypt.compare(password, user.password);
}
