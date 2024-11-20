import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req) {
    const { name, email, password } = await req.json();

    if (!name || !email || !password) {
        return new Response(JSON.stringify({ error: 'Name, email, and password are required' }), { status: 400 });
    }

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return new Response(JSON.stringify({ error: 'User already exists with this email' }), { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        const { password: _, ...userData } = newUser;
        return new Response(JSON.stringify({ user: userData }), { status: 201 });
    } catch (error) {
        console.error('Error registering user:', error);
        return new Response(JSON.stringify({ error: 'Internal server error during registration' }), { status: 500 });
    }
}

export async function GET(req) {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
}
