import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { hasPermission } from '../../lib/rbac';
import { getAllUsers } from '../../lib/users';
import { redirect } from 'next/navigation';
import AdminClient from './AdminClient';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user?.role || !hasPermission(session.user.role, 'users:read')) {
    redirect('/?error=unauthorized');
  }
  
  const users = await getAllUsers();
  
  return <AdminClient users={users} currentRole={session.user.role} currentUserId={session.user.id} />;
}
