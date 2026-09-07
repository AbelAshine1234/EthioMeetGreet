import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const router = Router();

const bookingSchema = z.object({
  talent_id: z.string().min(1),
  customer_name: z.string().min(2),
  customer_email: z.string().email(),
  recipient_name: z.string().min(2),
  booking_type: z.enum(['video_shoutout', 'live_meet']),
  occasion: z.string().min(1),
  instructions: z.string().min(10),
  delivery_speed: z.enum(['standard', 'rush_24h']).default('standard'),
  scheduled_date: z.string().optional(),
});

// Create booking using Prisma
router.post('/', async (req: Request, res: Response) => {
  try {
    const data = bookingSchema.parse(req.body);

    // Fetch talent to calculate price
    const talent = await prisma.talent.findUnique({
      where: { id: data.talent_id },
      select: { id: true, name: true, price_video: true, price_live_call: true },
    });

    if (!talent) {
      return res.status(404).json({ error: 'Talent not found' });
    }

    let basePrice = data.booking_type === 'video_shoutout' ? talent.price_video : talent.price_live_call;
    if (data.delivery_speed === 'rush_24h') {
      basePrice += 20;
    }

    const bookingId = `book_${uuidv4().substring(0, 8)}`;

    const booking = await prisma.booking.create({
      data: {
        id: bookingId,
        talent_id: data.talent_id,
        customer_name: data.customer_name,
        customer_email: data.customer_email,
        recipient_name: data.recipient_name,
        booking_type: data.booking_type,
        occasion: data.occasion,
        instructions: data.instructions,
        delivery_speed: data.delivery_speed,
        status: 'pending',
        total_price: basePrice,
        scheduled_date: data.scheduled_date,
      },
      include: {
        talent: {
          select: {
            name: true,
            avatar_url: true,
            handle: true,
          },
        },
      },
    });

    res.status(201).json({
      ...booking,
      talent_name: booking.talent?.name,
      talent_avatar: booking.talent?.avatar_url,
      talent_handle: booking.talent?.handle,
    });
  } catch (error: any) {
    console.error('Error creating booking with Prisma:', error);
    res.status(400).json({ error: error.message || 'Invalid booking request' });
  }
});

// GET bookings list using Prisma
router.get('/', async (req: Request, res: Response) => {
  try {
    const { email, talent_id, status } = req.query;

    const where: any = {};
    if (email) {
      where.customer_email = {
        contains: String(email),
        mode: 'insensitive',
      };
    }
    if (talent_id) {
      where.talent_id = String(talent_id);
    }
    if (status && status !== 'all') {
      where.status = String(status);
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        talent: {
          select: {
            name: true,
            avatar_url: true,
            handle: true,
          },
        },
      },
      orderBy: { created_at: 'desc' },
    });

    const formatted = bookings.map((b) => ({
      ...b,
      talent_name: b.talent?.name,
      talent_avatar: b.talent?.avatar_url,
      talent_handle: b.talent?.handle,
    }));

    res.json(formatted);
  } catch (error: any) {
    console.error('Error fetching bookings with Prisma:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// GET single booking using Prisma
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        talent: {
          select: {
            name: true,
            avatar_url: true,
            handle: true,
          },
        },
      },
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      ...booking,
      talent_name: booking.talent?.name,
      talent_avatar: booking.talent?.avatar_url,
      talent_handle: booking.talent?.handle,
    });
  } catch (error: any) {
    console.error('Error fetching booking detail with Prisma:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
});

// PATCH booking status using Prisma
router.patch('/:id/status', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, completed_video_url, talent_message } = req.body;

    const validStatuses = ['pending', 'accepted', 'in_progress', 'completed', 'declined'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const data: any = { status };
    if (completed_video_url !== undefined) data.completed_video_url = completed_video_url;
    if (talent_message !== undefined) data.talent_message = talent_message;

    const updated = await prisma.booking.update({
      where: { id },
      data,
      include: {
        talent: {
          select: {
            name: true,
            avatar_url: true,
            handle: true,
          },
        },
      },
    });

    res.json({
      ...updated,
      talent_name: updated.talent?.name,
      talent_avatar: updated.talent?.avatar_url,
      talent_handle: updated.talent?.handle,
    });
  } catch (error: any) {
    console.error('Error updating booking status with Prisma:', error);
    res.status(500).json({ error: 'Failed to update booking status' });
  }
});

// DELETE booking using Prisma
router.delete('/:id', async (req: Request, res: Response) => {
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

export default router;
