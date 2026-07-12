import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { getAllSkills } from '../../lib/skills';
import { getAccessibleCategories, hasPermission, ROLES } from '../../lib/rbac';
import { getAgentsByCategory, getAccessibleAgentCategories } from '../../lib/agents';
import { getStats as getAIDirStats } from '../../lib/ai-directory';
import { getAllUsers } from '../../lib/users';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  let session = null;
  
  try {
    session = await getServerSession(authOptions);
  } catch (e) {
    console.error('Dashboard session error:', e.message);
    redirect('/auth/login');
  }
  
  if (!session?.user?.role) {
    redirect('/auth/login');
  }
  
  const role = session.user.role;
  let allSkills = [];
  let filteredSkills = [];
  let skillsByCategory = {};
  let agentsByCategory = {};
  let agentCategories = [];
  let aiDirStats = { totalProjects: 0, totalCategories: 0, totalSubcategories: 0, categories: {} };
  let users = [];
  let userRoles = {};
  
  try {
    allSkills = getAllSkills();
  } catch (e) {
    console.error('Dashboard skills error:', e.message);
  }
  
  try {
    const accessibleCategories = getAccessibleCategories(role);
    filteredSkills = allSkills.filter(s => accessibleCategories.includes(s.category));
  } catch (e) {
    filteredSkills = allSkills;
  }
  
  try {
    agentCategories = getAccessibleAgentCategories(role);
  } catch (e) {
    agentCategories = [];
  }
  
  try {
    aiDirStats = getAIDirStats(role);
  } catch (e) {
    console.error('Dashboard AI dir stats error:', e.message);
  }
  
  try {
    if (hasPermission(role, 'users:read')) {
      users = await getAllUsers();
    }
  } catch (e) {
    console.error('Dashboard users error:', e.message);
  }
  
  // Compute analytics
  for (const s of filteredSkills) {
    if (!skillsByCategory[s.category]) skillsByCategory[s.category] = [];
    skillsByCategory[s.category].push(s);
  }
  
  try {
    const agentCats = getAgentsByCategory();
    for (const [cat, agents] of Object.entries(agentCats)) {
      if (agentCategories.includes(cat)) {
        agentsByCategory[cat] = agents;
      }
    }
  } catch (e) {
    console.error('Dashboard agents error:', e.message);
  }
  
  try {
    userRoles = users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {});
  } catch (e) {
    userRoles = {};
  }
  
  const analytics = {
    totalSkills: allSkills.length,
    accessibleSkills: filteredSkills.length,
    totalCategories: Object.keys(skillsByCategory).length,
    skillsByCategory,
    agentsByCategory,
    totalAgents: Object.values(agentsByCategory).flat().length,
    aiDirStats,
    users: users.length,
    userRoles,
    role,
    permissions: Object.keys(ROLES[role]?.permissions || {}).filter(p => hasPermission(role, p)),
  };
  
  return <DashboardClient analytics={analytics} userRole={role} />;
}
