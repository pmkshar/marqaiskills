import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getAllUsers, createUser, updateUser, deleteUser } from '../../../lib/users';
import { hasPermission } from '../../../lib/rbac';

// GET /api/users - List all users (admin only)
export async function GET(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || 'marq-ai-skills-platform-secret-key-2025' });
    if (!token || !hasPermission(token.role, 'users:read')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const users = await getAllUsers();
    return NextResponse.json({ users });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/users - Create user (admin only)
export async function POST(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || 'marq-ai-skills-platform-secret-key-2025' });
    if (!token || !hasPermission(token.role, 'users:write')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const body = await request.json();
    const { name, email, password, role } = body;
    
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Name, email, and password are required' }, { status: 400 });
    }
    
    const user = await createUser({ name, email, password, role: role || 'viewer' });
    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// PUT /api/users - Update user
export async function PUT(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || 'marq-ai-skills-platform-secret-key-2025' });
    if (!token || !hasPermission(token.role, 'users:write')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const body = await request.json();
    const { id, ...updates } = body;
    
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Managers can only update role to viewer/editor, not admin
    if (token.role === 'manager' && updates.role === 'admin') {
      return NextResponse.json({ error: 'Cannot assign admin role' }, { status: 403 });
    }
    
    const user = await updateUser(id, updates);
    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

// DELETE /api/users - Delete user (admin only)
export async function DELETE(request) {
  try {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET || 'marq-ai-skills-platform-secret-key-2025' });
    if (!token || !hasPermission(token.role, 'users:delete')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }
    
    // Prevent self-deletion
    if (id === token.userId) {
      return NextResponse.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }
    
    await deleteUser(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
