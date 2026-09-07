import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';

const router = Router();

// GET platform overview statistics for Admin Panel using Prisma
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const [
      totalTalents,
      totalBookings,
      completedBookings,
      pendingBookings,
      inProgressBookings,
      revenueResult,
      totalReviews,
      recentBookings,
    ] = await Promise.all([
      prisma.talent.count(),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: 'completed' } }),
      prisma.booking.count({ where: { status: 'pending' } }),
      prisma.booking.count({ where: { status: 'in_progress' } }),
      prisma.booking.aggregate({
        where: { status: { not: 'declined' } },
        _sum: { total_price: true },
      }),
      prisma.review.count(),
      prisma.booking.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        include: {
          talent: {
            select: {
              name: true,
              avatar_url: true,
            },
          },
        },
      }),
    ]);

    res.json({
      totalTalents,
      totalBookings,
      completedBookings,
      pendingBookings,
      inProgressBookings,
      totalRevenue: revenueResult._sum.total_price || 0,
      totalReviews,
      recentBookings: recentBookings.map((b) => ({
        ...b,
        talent_name: b.talent?.name,
        talent_avatar: b.talent?.avatar_url,
      })),
    });
  } catch (error: any) {
    console.error('Error fetching admin stats with Prisma:', error);
    res.status(500).json({ error: 'Failed to fetch admin stats' });
  }
});

// DELETE a booking using Prisma
router.delete('/bookings/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.booking.delete({
      where: { id },
    });
    res.json({ message: 'Booking deleted successfully', id });
  } catch (error: any) {
    console.error('Error deleting booking with Prisma:', error);
    res.status(500).json({ error: 'Failed to delete booking' });
  }
});

// DELETE a review using Prisma
router.delete('/reviews/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.review.delete({
      where: { id },
    });
    res.json({ message: 'Review deleted successfully', id });
  } catch (error: any) {
    console.error('Error deleting review with Prisma:', error);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;
