import { NextResponse } from 'next/server';
import { createUser } from '../../../../lib/users';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, password, role } = body;
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }
    
    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters' }, { status: 400 });
    }
    
    // Self-registration always creates viewer role
    const user = await createUser({ name, email, password, role: 'viewer' });
    
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
