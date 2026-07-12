import IdeasClient from './IdeasClient';

export const dynamic = 'force-dynamic';

export default async function IdeasPage() {
  // Client component handles auth check itself for Vercel resilience
  return <IdeasClient />;
}
