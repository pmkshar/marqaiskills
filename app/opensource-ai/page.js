import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import OpenSourceAIClient from './OpenSourceAIClient';
import { getStats, getCategories } from '../../lib/opensource-ai';

export default async function OpenSourceAIPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.role) {
    redirect('/auth/login');
  }
  
  const role = session.user.role;
  const stats = getStats(role);
  const categories = getCategories(role);
  
  return <OpenSourceAIClient stats={stats} categories={categories} userRole={role} />;
}
