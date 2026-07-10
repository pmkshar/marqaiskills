import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { hasPermission } from '../../lib/rbac';
import AgentsClient from './AgentsClient';

export default async function AgentsPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.role) {
    redirect('/auth/login');
  }
  
  const canEdit = hasPermission(session.user.role, 'skills:write');
  
  return <AgentsClient userRole={session.user.role} canEdit={canEdit} />;
}
