import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export default async function handler(req, res) {
    if (req.method === 'POST') {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' });
        }

        try {
            const existingUser = await prisma.user.findUnique({ where: { email } });
            if (existingUser) {
                return res.status(409).json({ error: 'User already exists with this email' });
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
            return res.status(201).json({ user: userData });
        } catch (error) {
            console.error('Error registering user:', error);
            return res.status(500).json({ error: 'Internal server error during registration' });
        }
    } else {
        return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
    }
}
