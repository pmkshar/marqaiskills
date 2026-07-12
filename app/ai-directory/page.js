import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import AIDirectoryClient from './AIDirectoryClient';
import { getStats, getCategories } from '../../lib/ai-directory';

export const dynamic = 'force-dynamic';

export default async function AIDirectoryPage() {
  let session = null;
  
  try {
    session = await getServerSession(authOptions);
  } catch (e) {
    console.error('AI Directory session error:', e.message);
    redirect('/auth/login');
  }
  
  if (!session?.user?.role) {
    redirect('/auth/login');
  }
  
  const role = session.user.role;
  let stats = { totalProjects: 0, totalCategories: 0, totalSubcategories: 0, categories: {} };
  let categories = {};
  
  try {
    stats = getStats(role);
  } catch (e) {
    console.error('AI Directory stats error:', e.message);
  }
  
  try {
    categories = getCategories(role);
  } catch (e) {
    console.error('AI Directory categories error:', e.message);
  }
  
  return <AIDirectoryClient stats={stats} categories={categories} userRole={role} />;
}
