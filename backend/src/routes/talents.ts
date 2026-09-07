import { Router, Request, Response } from 'express';
import { prisma } from '../db/prisma';
import { v4 as uuidv4 } from 'uuid';
import { z } from 'zod';

const router = Router();

// GET all talents with filtering and sorting using Prisma
router.get('/', async (req: Request, res: Response) => {
  try {
    const { category, search, sort, minPrice, maxPrice, featured, trending } = req.query;

    const where: any = {};

    // Category filter
    if (category && category !== 'all') {
      const catStr = String(category);
      const isNum = !isNaN(Number(catStr));
      where.OR = [
        { category: { slug: catStr } },
        ...(isNum ? [{ category_id: Number(catStr) }] : []),
      ];
    }

    // Search filter across name, title, bio, and tags
    if (search) {
      const q = String(search);
      where.AND = where.AND || [];
      where.AND.push({
        OR: [
          { name: { contains: q, mode: 'insensitive' } },
          { title: { contains: q, mode: 'insensitive' } },
          { bio: { contains: q, mode: 'insensitive' } },
          { tags: { has: q } },
        ],
      });
    }

    // Price filters
    if (minPrice || maxPrice) {
      where.price_video = {};
      if (minPrice) where.price_video.gte = Number(minPrice);
      if (maxPrice) where.price_video.lte = Number(maxPrice);
    }

    // Featured & Trending flags
    if (featured === 'true') {
      where.featured = true;
    }
    if (trending === 'true') {
      where.trending = true;
    }

    // Sorting
    let orderBy: any = [{ featured: 'desc' }, { rating: 'desc' }, { review_count: 'desc' }];
    if (sort === 'rating') {
      orderBy = [{ rating: 'desc' }, { review_count: 'desc' }];
    } else if (sort === 'price_asc') {
      orderBy = [{ price_video: 'asc' }];
    } else if (sort === 'price_desc') {
      orderBy = [{ price_video: 'desc' }];
    } else if (sort === 'trending') {
      orderBy = [{ trending: 'desc' }, { rating: 'desc' }];
    }

    const talents = await prisma.talent.findMany({
      where,
      include: {
        category: true,
      },
      orderBy,
    });

    const formatted = talents.map((t) => ({
      ...t,
      rating: t.rating ? Number(t.rating) : 5.0,
      category_name: t.category?.name,
      category_slug: t.category?.slug,
    }));

    res.json(formatted);
  } catch (error: any) {
    console.error('Error fetching talents with Prisma:', error);
    res.status(500).json({ error: 'Failed to fetch talents' });
  }
});

// GET single talent with reviews
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const talent = await prisma.talent.findFirst({
      where: {
        OR: [{ id }, { handle: id }],
      },
      include: {
        category: true,
        reviews: {
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!talent) {
      return res.status(404).json({ error: 'Talent not found' });
    }

    res.json({
      ...talent,
      rating: talent.rating ? Number(talent.rating) : 5.0,
      category_name: talent.category?.name,
      category_slug: talent.category?.slug,
    });
  } catch (error: any) {
    console.error('Error fetching talent details with Prisma:', error);
    res.status(500).json({ error: 'Failed to fetch talent details' });
  }
});

// POST register / enroll talent
const talentSchema = z.object({
  name: z.string().min(2),
  handle: z.string().min(2),
  title: z.string().min(2).default('Creator & Influencer'),
  category_id: z.number().int().positive().default(1),
  bio: z.string().min(3),
  avatar_url: z.string().optional(),
  hero_video_url: z.string().optional(),
  price_video: z.number().min(1).default(50),
  price_live_call: z.number().optional(),
  response_time: z.string().optional(),
  languages: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
  verified: z.boolean().optional(),
  featured: z.boolean().optional(),
});

router.post('/', async (req: Request, res: Response) => {
  try {
    let categoryId = req.body.category_id;
    if (!categoryId && req.body.category) {
      // Find category by slug or name
      const cat = await prisma.category.findFirst({
        where: {
          OR: [
            { slug: String(req.body.category).toLowerCase() },
            { name: { contains: String(req.body.category), mode: 'insensitive' } },
          ],
        },
      });
      categoryId = cat ? cat.id : 1;
    }

    const rawData = {
      ...req.body,
      title: req.body.title || `${req.body.name || 'Featured'} Creator`,
      category_id: Number(categoryId) || 1,
      avatar_url: req.body.avatar_url || req.body.avatar || '/stars/selam_tesfaye.jpg',
      price_live_call: req.body.price_live_call ?? req.body.price_live ?? 120,
    };
    const parsed = talentSchema.parse(rawData);
    const id = `talent_${uuidv4().substring(0, 8)}`;
    const avatar = parsed.avatar_url || '/stars/selam_tesfaye.jpg';
    const hero_video = parsed.hero_video_url || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';
    const responseTime = parsed.response_time || '⚡ Within 24 hours';

    const created = await prisma.talent.create({
      data: {
        id,
        name: parsed.name,
        handle: parsed.handle.replace('@', ''),
        title: parsed.title,
        category_id: parsed.category_id,
        bio: parsed.bio,
        avatar_url: avatar,
        hero_video_url: hero_video,
        price_video: parsed.price_video,
        price_live_call: parsed.price_live_call || 120,
        languages: parsed.languages || ['Amharic', 'English'],
        tags: parsed.tags || ['Creator'],
        verified: parsed.verified ?? true,
        featured: parsed.featured ?? false,
        response_time: responseTime,
      },
      include: {
        category: true,
      },
    });

    res.status(201).json({
      ...created,
      rating: created.rating ? Number(created.rating) : 5.0,
      category_name: created.category?.name,
      category_slug: created.category?.slug,
    });
  } catch (error: any) {
    console.error('Error creating talent with Prisma:', error);
    res.status(400).json({ error: error.message || 'Invalid talent data' });
  }
});

// Update talent handler (supports both PATCH and PUT)
const updateTalentHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      name,
      title,
      bio,
      price_video,
      price_live_call,
      verified,
      featured,
      trending,
      category_id,
      avatar_url,
      hero_video_url,
      response_time,
      languages,
      tags,
    } = req.body;

    const data: any = {};
    if (name !== undefined) data.name = name;
    if (title !== undefined) data.title = title;
    if (bio !== undefined) data.bio = bio;
    if (price_video !== undefined) data.price_video = Number(price_video);
    if (price_live_call !== undefined) data.price_live_call = Number(price_live_call);
    if (verified !== undefined) data.verified = Boolean(verified);
    if (featured !== undefined) data.featured = Boolean(featured);
    if (trending !== undefined) data.trending = Boolean(trending);
    if (category_id !== undefined) data.category_id = Number(category_id);
    if (avatar_url !== undefined) data.avatar_url = avatar_url;
    if (hero_video_url !== undefined) data.hero_video_url = hero_video_url;
    if (response_time !== undefined) data.response_time = response_time;
    if (languages !== undefined) data.languages = languages;
    if (tags !== undefined) data.tags = tags;

    const updated = await prisma.talent.update({
      where: { id },
      data,
      include: {
        category: true,
      },
    });

    res.json({
      ...updated,
      rating: updated.rating ? Number(updated.rating) : 5.0,
      category_name: updated.category?.name,
      category_slug: updated.category?.slug,
    });
  } catch (error: any) {
    console.error('Error updating talent with Prisma:', error);
    res.status(500).json({ error: 'Failed to update talent' });
  }
};

router.patch('/:id', updateTalentHandler);
router.put('/:id', updateTalentHandler);

// DELETE talent
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.talent.delete({
      where: { id },
    });
    res.json({ message: 'Talent deleted successfully', id });
  } catch (error: any) {
    console.error('Error deleting talent with Prisma:', error);
    res.status(500).json({ error: 'Failed to delete talent' });
  }
});

export default router;
