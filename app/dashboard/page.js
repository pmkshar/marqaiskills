import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { getAllSkills } from '../../lib/skills';
import { getAccessibleCategories, hasPermission, ROLES } from '../../lib/rbac';
import { getAgentsByCategory, getAccessibleAgentCategories } from '../../lib/agents';
import { getStats as getAIDirStats } from '../../lib/ai-directory';
import { getAllUsers } from '../../lib/users';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.role) {
    redirect('/auth/login');
  }
  
  const role = session.user.role;
  const allSkills = getAllSkills();
  const accessibleCategories = getAccessibleCategories(role);
  const filteredSkills = allSkills.filter(s => accessibleCategories.includes(s.category));
  const agentCategories = getAccessibleAgentCategories(role);
  const aiDirStats = getAIDirStats(role);
  let users = [];
  
  if (hasPermission(role, 'users:read')) {
    users = await getAllUsers();
  }
  
  // Compute analytics
  const skillsByCategory = {};
  for (const s of filteredSkills) {
    if (!skillsByCategory[s.category]) skillsByCategory[s.category] = [];
    skillsByCategory[s.category].push(s);
  }
  
  const agentsByCategory = {};
  const agentCats = getAgentsByCategory();
  for (const [cat, agents] of Object.entries(agentCats)) {
    if (agentCategories.includes(cat)) {
      agentsByCategory[cat] = agents;
    }
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
    userRoles: users.reduce((acc, u) => { acc[u.role] = (acc[u.role] || 0) + 1; return acc; }, {}),
    role,
    permissions: Object.keys(ROLES[role]?.permissions || {}).filter(p => hasPermission(role, p)),
  };
  
  return <DashboardClient analytics={analytics} userRole={role} />;
}
