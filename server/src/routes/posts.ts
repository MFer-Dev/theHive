import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/', authenticate, async (req: AuthRequest, res) => {
  try {
    const { content, image } = req.body;
    const userId = req.user.userId;
    
    const post = await prisma.post.create({
      data: {
        content,
        image,
        authorId: userId,
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatar: true }
        },
        _count: { select: { likes: true, comments: true } }
      }
    });
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create post' });
  }
});

router.get('/feed', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user.userId;
    
    // Get accepted friends
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: userId, status: 'ACCEPTED' },
          { receiverId: userId, status: 'ACCEPTED' }
        ]
      }
    });
    
    const friendIds = friendships.map(f => 
      f.senderId === userId ? f.receiverId : f.senderId
    );
    friendIds.push(userId); // Include own posts
    
    const posts = await prisma.post.findMany({
      where: {
        authorId: { in: friendIds }
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatar: true }
        },
        comments: {
          include: {
            author: {
              select: { id: true, firstName: true, lastName: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 3
        },
        likes: {
          where: { userId },
          select: { id: true }
        },
        _count: { select: { likes: true, comments: true } }
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });
    
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feed' });
  }
});

router.post('/:id/like', authenticate, async (req: AuthRequest, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user.userId;
    
    const existing = await prisma.like.findUnique({
      where: {
        postId_userId: { postId, userId }
      }
    });
    
    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      res.json({ liked: false });
    } else {
      await prisma.like.create({
        data: { postId, userId }
      });
      res.json({ liked: true });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to toggle like' });
  }
});

router.post('/:id/comment', authenticate, async (req: AuthRequest, res) => {
  try {
    const { content } = req.body;
    const postId = req.params.id;
    const userId = req.user.userId;
    
    const comment = await prisma.comment.create({
      data: {
        content,
        postId,
        authorId: userId,
      },
      include: {
        author: {
          select: { id: true, firstName: true, lastName: true, avatar: true }
        }
      }
    });
    
    res.json(comment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

export default router;