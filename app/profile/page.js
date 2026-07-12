import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { ROLES, getAccessibleCategories, hasPermission } from '../../lib/rbac';
import { getAllSkills } from '../../lib/skills';
import ProfileClient from './ProfileClient';

export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  let session = null;
  
  try {
    session = await getServerSession(authOptions);
  } catch (e) {
    console.error('Profile session error:', e.message);
    redirect('/auth/login');
  }
  
  if (!session?.user) {
    redirect('/auth/login');
  }
  
  const role = session.user.role;
  const roleInfo = ROLES[role] || ROLES.viewer;
  let accessibleCategories = [];
  let allSkills = [];
  let accessibleSkills = [];
  
  try {
    accessibleCategories = getAccessibleCategories(role);
  } catch (e) {
    console.error('Profile categories error:', e.message);
  }
  
  try {
    allSkills = getAllSkills();
    accessibleSkills = allSkills.filter(s => accessibleCategories.includes(s.category));
  } catch (e) {
    console.error('Profile skills error:', e.message);
  }
  
  const permissions = {};
  const allPerms = ['skills:read', 'skills:write', 'skills:delete', 'users:read', 'users:write', 'users:delete', 'admin:dashboard', 'admin:settings', 'categories:read', 'categories:write', 'profile:read', 'profile:write'];
  for (const p of allPerms) {
    permissions[p] = hasPermission(role, p);
  }
  
  return (
    <ProfileClient
      user={session.user}
      roleInfo={roleInfo}
      accessibleCategories={accessibleCategories}
      accessibleSkillsCount={accessibleSkills.length}
      totalSkillsCount={allSkills.length}
      permissions={permissions}
    />
  );
}
