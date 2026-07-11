import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import AIDirectoryClient from './AIDirectoryClient';
import { getStats, getCategories } from '../../lib/ai-directory';

export default async function AIDirectoryPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.role) {
    redirect('/auth/login');
  }
  
  const role = session.user.role;
  const stats = getStats(role);
  const categories = getCategories(role);
  
  return <AIDirectoryClient stats={stats} categories={categories} userRole={role} />;
}
