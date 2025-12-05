import { PrismaClient } from '@prisma/client';
import jsonwebtoken from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export const createFeedback = async (req, res) => {
  const { feedback } = req.body;

  if (!feedback || feedback.trim() === '') {
    return res.status(400).json({ error: 'Feedback message cannot be empty.' });
  }

  let userId = null;
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        const decoded = jsonwebtoken.verify(token, JWT_SECRET);
        userId = decoded.userId;
      } catch (err) {
        console.warn('Invalid token for optional auth:', err.message);
      }
    }
  }

  try {
    await prisma.feedback.create({
      data: {
        user_id: userId,
        feedback: feedback.trim()
      }
    });

    return res.status(201).json({ message: 'Feedback submitted successfully!' });

  } catch (err) {
    console.error('Server error submitting feedback:', err);
    res.status(500).json({ error: 'Server error submitting feedback.' });
  }
};