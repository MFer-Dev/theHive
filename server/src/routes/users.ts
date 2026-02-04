import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.get('/me', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        createdAt: true,
        _count: {
          select: {
            posts: true,
            sentFriends: { where: { status: 'ACCEPTED' } },
            receivedFriends: { where: { status: 'ACCEPTED' } }
          }
        }
      }
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.get('/:id', authenticate, async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.params.id },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true,
        bio: true,
        posts: {
          orderBy: { createdAt: 'desc' },
          include: {
            _count: { select: { likes: true, comments: true } }
          }
        },
        _count: {
          select: {
            sentFriends: { where: { status: 'ACCEPTED' } },
            receivedFriends: { where: { status: 'ACCEPTED' } }
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // Check friendship status
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: req.user.userId, receiverId: user.id },
          { senderId: user.id, receiverId: req.user.userId }
        ]
      }
    });
    
    res.json({ ...user, friendship });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
});

router.get('/search/:query', authenticate, async (req: AuthRequest, res) => {
  try {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { firstName: { contains: req.params.query, mode: 'insensitive' } },
          { lastName: { contains: req.params.query, mode: 'insensitive' } }
        ],
        NOT: { id: req.user.userId }
      },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        avatar: true
      },
      take: 10
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;