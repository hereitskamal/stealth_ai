import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;

export async function POST(req) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: 'User not found' }), { status: 401 });
    }

    if (!(await bcrypt.compare(password, user.password))) {
      return new Response(JSON.stringify({ error: 'Invalid password' }), { status: 401 });
    }

    const { password: _, ...userData } = user;
    const isAdmin = email === ADMIN_EMAIL;

    return new Response(JSON.stringify({ user: { ...userData, isAdmin } }), { status: 200 });
  } catch (error) {
    console.error('Error logging in:', error);
    return new Response(JSON.stringify({ error: 'Internal server error during login' }), { status: 500 });
  }
}

export async function GET(req) {
  return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
}
