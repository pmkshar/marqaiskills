import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { getAllSkills } from '../../lib/skills';
import { getAccessibleCategories, hasPermission } from '../../lib/rbac';
import SkillsClient from './SkillsClient';

export default async function SkillsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.role) {
    redirect('/auth/login');
  }
  
  const role = session.user.role;
  const accessibleCategories = getAccessibleCategories(role);
  const allSkills = getAllSkills();
  const filteredSkills = allSkills.filter(s => accessibleCategories.includes(s.category));
  
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
