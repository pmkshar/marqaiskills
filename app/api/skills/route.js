import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getAllSkills } from '../../../lib/skills';
import { getAccessibleCategories, hasPermission } from '../../../lib/rbac';

// GET /api/skills - Get skills based on user role
export async function GET(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || 'marq-ai-skills-platform-secret-key-2025' });
    if (!token) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }
    
    const allSkills = getAllSkills();
    const accessibleCategories = getAccessibleCategories(token.role);
    
    // Filter skills based on role
    const filteredSkills = allSkills.filter(skill => accessibleCategories.includes(skill.category));
    
    // Add permission metadata
    const skillsWithPermissions = filteredSkills.map(skill => ({
      ...skill,
      canEdit: hasPermission(token.role, 'skills:write'),
      canDelete: hasPermission(token.role, 'skills:delete'),
    }));
    
    return NextResponse.json({ 
      skills: skillsWithPermissions,
      total: allSkills.length,
      accessible: filteredSkills.length,
      role: token.role,
      accessibleCategories,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
