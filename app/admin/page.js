import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { hasPermission } from '../../lib/rbac';
import { getAllUsers } from '../../lib/users';
import { redirect } from 'next/navigation';
import AdminClient from './AdminClient';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  let session = null;
  
  try {
    session = await getServerSession(authOptions);
  } catch (e) {
    console.error('Admin session error:', e.message);
    redirect('/auth/login');
  }
  
  if (!session?.user?.role || !hasPermission(session.user.role, 'users:read')) {
    redirect('/?error=unauthorized');
  }
  
  let users = [];
  try {
    users = await getAllUsers();
  } catch (e) {
    console.error('Admin users error:', e.message);
  }
  
  return <AdminClient users={users} currentRole={session.user.role} currentUserId={session.user.id} />;
}
