import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { hasPermission } from '../../lib/rbac';
import AgentsClient from './AgentsClient';

export const dynamic = 'force-dynamic';

export default async function AgentsPage() {
  let session = null;
  
  try {
    session = await getServerSession(authOptions);
  } catch (e) {
    console.error('Agents session error:', e.message);
    redirect('/auth/login');
  }
  
  if (!session?.user?.role) {
    redirect('/auth/login');
  }
  
  const canEdit = hasPermission(session.user.role, 'skills:write');
  
  return <AgentsClient userRole={session.user.role} canEdit={canEdit} />;
}
