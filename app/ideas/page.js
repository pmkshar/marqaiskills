import { getServerSession } from 'next-auth';
import { authOptions } from '../api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import IdeasClient from './IdeasClient';

export const dynamic = 'force-dynamic';

export default async function IdeasPage() {
  let session = null;
  try {
    session = await getServerSession(authOptions);
  } catch (e) {
    console.error('Ideas session error:', e.message);
    redirect('/auth/login');
  }

  if (!session?.user?.role) {
    redirect('/auth/login');
  }

  const role = session.user.role;
  const userName = session.user.name || 'User';

  return <IdeasClient userRole={role} userName={userName} />;
}
