import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getAllSkills } from '../../lib/skills';
import { getAccessibleCategories, hasPermission } from '../../lib/rbac';
import SkillsClient from './SkillsClient';

export const dynamic = 'force-dynamic';

export default async function SkillsPage() {
  let session = null;
  
  try {
    session = await getServerSession(authOptions);
  } catch (e) {
    console.error('Skills session error:', e.message);
    redirect('/auth/login');
  }
  
  if (!session?.user?.role) {
    redirect('/auth/login');
  }
  
  const role = session.user.role;
  let allSkills = [];
  let filteredSkills = [];
  
  try {
    allSkills = getAllSkills();
  } catch (e) {
    console.error('Skills loading error:', e.message);
  }
  
  try {
    const accessibleCategories = getAccessibleCategories(role);
    filteredSkills = allSkills.filter(s => accessibleCategories.includes(s.category));
  } catch (e) {
    filteredSkills = allSkills;
  }
  
  const permissions = {
    canWrite: hasPermission(role, 'skills:write'),
    canDelete: hasPermission(role, 'skills:delete'),
    canManageUsers: hasPermission(role, 'users:read'),
  };
  
  return (
    <SkillsClient
      skills={filteredSkills}
      totalSkills={allSkills.length}
      userRole={role}
      permissions={permissions}
      session={session}
    />
  );
}
