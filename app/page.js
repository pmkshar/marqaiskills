import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { getAllSkills } from '../lib/skills';
import { getAccessibleCategories, hasPermission } from '../lib/rbac';
import HomeClient from './HomeClient';

export default async function Home() {
  const session = await getServerSession(authOptions);
  const allSkills = getAllSkills();
  
  let filteredSkills = allSkills;
  let userRole = null;
  let permissions = {};
  
  if (session?.user?.role) {
    userRole = session.user.role;
    const accessibleCategories = getAccessibleCategories(userRole);
    filteredSkills = allSkills.filter(s => accessibleCategories.includes(s.category));
    permissions = {
      canWrite: hasPermission(userRole, 'skills:write'),
      canDelete: hasPermission(userRole, 'skills:delete'),
      canManageUsers: hasPermission(userRole, 'users:read'),
    };
  }
  
  return (
    <HomeClient 
      skills={filteredSkills} 
      totalSkills={allSkills.length}
      userRole={userRole}
      permissions={permissions}
      session={session}
    />
  );
}
