import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const items = await prisma.item.findMany();
      return res.status(200).json(items);
    } catch (error) {
      console.error('Error fetching items:', error);
      return res.status(500).json({ error: 'Internal server error while fetching items' });
    }
  }

  if (req.method === 'POST') {
    const { title, description, createdBy } = req.body;

    if (!title || !description || !createdBy) {
      return res.status(400).json({ error: 'Title, description, and createdBy are required' });
    }

    try {
      const newItem = await prisma.item.create({
        data: {
          title,
          description,
          createdBy,
        },
      });
      return res.status(201).json(newItem);
    } catch (error) {
      console.error('Error creating item:', error);
      return res.status(500).json({ error: 'Internal server error while creating item' });
    }
  }
  if (req.method === 'DELETE') {
    const { id, createdBy } = req.body;

    if (!id || !createdBy) {
      return res.status(400).json({ error: 'Item ID and createdBy are required' });
    }

    try {
      const item = await prisma.item.findUnique({ where: { id } });

      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      if (item.createdBy !== createdBy) {
        return res.status(403).json({ error: 'Unauthorized to delete this item' });
      }

      await prisma.item.delete({ where: { id } });
      return res.status(204).end();
    } catch (error) {
      console.error('Error deleting item:', error);
      return res.status(500).json({ error: 'Internal server error while deleting item' });
    }
  }

  res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
  return res.status(405).json({ error: `Method ${req.method} Not Allowed` });
}
