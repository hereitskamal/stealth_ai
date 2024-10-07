import { PrismaClient } from '@prisma/client'; 

const prisma = new PrismaClient();

export async function GET(req) {
  try {
    const items = await prisma.item.findMany();
    return new Response(JSON.stringify(items), { status: 200 });
  } catch (error) {
    console.error('Error fetching items:', error);
    return new Response(JSON.stringify({ error: 'Internal server error while fetching items' }), { status: 500 });
  }
}

export async function POST(req) {
  const { title, description, createdBy } = await req.json();

  if (!title || !description || !createdBy) {
    return new Response(JSON.stringify({ error: 'Title, description, and createdBy are required' }), { status: 400 });
  }

  try {
    const newItem = await prisma.item.create({
      data: {
        title,
        description,
        createdBy,
      },
    });
    return new Response(JSON.stringify(newItem), { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return new Response(JSON.stringify({ error: 'Internal server error while creating item' }), { status: 500 });
  }
}

export async function DELETE(req) {
  const { id, createdBy } = await req.json();

  if (!id || !createdBy) {
    return new Response(JSON.stringify({ error: 'Item ID and createdBy are required' }), { status: 400 });
  }

  try {
    const item = await prisma.item.findUnique({ where: { id } });

    if (!item) {
      return new Response(JSON.stringify({ error: 'Item not found' }), { status: 404 });
    }

    if (item.createdBy !== createdBy) {
      return new Response(JSON.stringify({ error: 'Unauthorized to delete this item' }), { status: 403 });
    }

    await prisma.item.delete({ where: { id } });
    return new Response(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting item:', error);
    return new Response(JSON.stringify({ error: 'Internal server error while deleting item' }), { status: 500 });
  }
}
