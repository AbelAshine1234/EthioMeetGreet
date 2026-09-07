import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';

const router = Router();

// GET all categories with talent counts using Prisma
router.get('/', async (_req: Request, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { talents: true },
        },
      },
      orderBy: { id: 'asc' },
    });

    const formatted = categories.map((c) => ({
      id: c.id,
      name: c.name,
      slug: c.slug,
      icon: c.icon,
      description: c.description,
      talent_count: c._count.talents,
    }));

    res.json(formatted);
  } catch (error: any) {
    console.error('Error fetching categories with Prisma:', error);
    res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

// GET all occasions using Prisma
router.get('/occasions', async (_req: Request, res: Response) => {
  try {
    const occasions = await prisma.occasion.findMany({
      orderBy: { id: 'asc' },
    });
    res.json(occasions);
  } catch (error: any) {
    console.error('Error fetching occasions with Prisma:', error);
    res.status(500).json({ error: 'Failed to fetch occasions' });
  }
});

export default router;
