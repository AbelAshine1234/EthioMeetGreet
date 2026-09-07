import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const router = Router();

// GET reviews using Prisma (platform-wide or filtered by talent_id)
router.get('/', async (req: Request, res: Response) => {
  try {
    const { talent_id, limit } = req.query;
    const where: any = {};
    if (talent_id) {
      where.talent_id = String(talent_id);
    }

    const reviews = await prisma.review.findMany({
      where,
      take: limit ? Math.min(Number(limit), 50) : 20,
      orderBy: { created_at: 'desc' },
      include: {
        talent: {
          select: {
            id: true,
            name: true,
            avatar_url: true,
            handle: true,
          },
        },
      },
    });

    const formatted = reviews.map((r) => ({
      ...r,
      talent_name: r.talent?.name,
      talent_avatar: r.talent?.avatar_url,
      talent_handle: r.talent?.handle,
    }));

    res.json(formatted);
  } catch (error: any) {
    console.error('Error fetching reviews with Prisma:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

const reviewSchema = z.object({
  talent_id: z.string().min(1),
  booking_id: z.string().optional(),
  customer_name: z.string().min(2),
  rating: z.number().int().min(1).max(5),
  comment: z.string().min(5),
  occasion: z.string().optional(),
});

// POST submit review using Prisma
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = reviewSchema.parse(req.body);
    const id = `rev_${uuidv4().substring(0, 8)}`;

    const review = await prisma.review.create({
      data: {
        id,
        talent_id: data.talent_id,
        booking_id: data.booking_id,
        customer_name: data.customer_name,
        rating: data.rating,
        comment: data.comment,
        occasion: data.occasion || 'Shoutout',
      },
    });

    // Update talent average rating and review_count using Prisma
    const aggregations = await prisma.review.aggregate({
      where: { talent_id: data.talent_id },
      _count: { id: true },
      _avg: { rating: true },
    });

    const newCount = aggregations._count.id;
    const newRating = aggregations._avg.rating ? Number(aggregations._avg.rating.toFixed(2)) : 5.0;

    await prisma.talent.update({
      where: { id: data.talent_id },
      data: {
        review_count: newCount,
        rating: newRating,
      },
    });

    res.status(201).json(review);
  } catch (error: any) {
    console.error('Error submitting review with Prisma:', error);
    res.status(400).json({ error: error.message || 'Invalid review data' });
  }
});

export default router;
