import { getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]/route';
import { getAllSkills } from '../lib/skills';
import { getAccessibleCategories, hasPermission } from '../lib/rbac';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';

export default async function Home() {
  let session = null;
  let allSkills = [];
  let filteredSkills = [];
  let userRole = null;
  let permissions = {};
  
  try {
    session = await getServerSession(authOptions);
  } catch (e) {
    console.error('Session error:', e.message);
  }
  
  try {
    allSkills = getAllSkills();
  } catch (e) {
    console.error('Skills loading error:', e.message);
    allSkills = [];
  }
  
  if (session?.user?.role) {
    userRole = session.user.role;
    try {
      const accessibleCategories = getAccessibleCategories(userRole);
      filteredSkills = allSkills.filter(s => accessibleCategories.includes(s.category));
    } catch (e) {
      filteredSkills = allSkills;
    }
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
