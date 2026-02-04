import express from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

router.post('/request/:userId', authenticate, async (req: AuthRequest, res) => {
  try {
    const senderId = req.user.userId;
    const receiverId = req.params.userId;
    
    if (senderId === receiverId) {
      return res.status(400).json({ error: 'Cannot friend yourself' });
    }
    
    const existing = await prisma.friendship.findUnique({
      where: {
        senderId_receiverId: { senderId, receiverId }
      }
    });
    
    if (existing) {
      return res.status(400).json({ error: 'Request already exists' });
    }
    
    const friendship = await prisma.friendship.create({
      data: {
        senderId,
        receiverId,
        status: 'PENDING'
      }
    });
    
    res.json(friendship);
  } catch (error) {
    res.status(500).json({ error: 'Failed to send request' });
  }
});

router.post('/accept/:friendshipId', authenticate, async (req: AuthRequest, res) => {
  try {
    const { friendshipId } = req.params;
    const userId = req.user.userId;
    
    const friendship = await prisma.friendship.update({
      where: {
        id: friendshipId,
        receiverId: userId,
        status: 'PENDING'
      },
      data: { status: 'ACCEPTED' }
    });
    
    res.json(friendship);
  } catch (error) {
    res.status(500).json({ error: 'Failed to accept request' });
  }
});

router.get('/list', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user.userId;
    
    const friends = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: userId, status: 'ACCEPTED' },
          { receiverId: userId, status: 'ACCEPTED' }
        ]
      },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true, avatar: true }
        },
        receiver: {
          select: { id: true, firstName: true, lastName: true, avatar: true }
        }
      }
    });
    
    const friendList = friends.map(f => 
      f.senderId === userId ? f.receiver : f.sender
    );
    
    res.json(friendList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

router.get('/requests', authenticate, async (req: AuthRequest, res) => {
  try {
    const userId = req.user.userId;
    
    const requests = await prisma.friendship.findMany({
      where: {
        receiverId: userId,
        status: 'PENDING'
      },
      include: {
        sender: {
          select: { id: true, firstName: true, lastName: true, avatar: true }
        }
      }
    });
    
    res.json(requests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch requests' });
  }
});

export default router;