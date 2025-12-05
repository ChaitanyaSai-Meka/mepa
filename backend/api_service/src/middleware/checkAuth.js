import jsonwebtoken from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export const checkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Authorization header missing.' });
  }

  const tokenParts = authHeader.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(401).json({ error: 'Malformed Authorization header. Format is "Bearer <token>".' });
  }

  const token = tokenParts[1];
  if (!token) {
    return res.status(401).json({ error: 'Token missing from Authorization header.' });
  }

  try {
    const decoded = jsonwebtoken.verify(token, JWT_SECRET);
    
    const user = await prisma.users.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, username: true }
    });

    if (!user) {
      console.warn('Token valid but no user found.');
      return res.status(401).json({ error: 'Unauthorized: User not found for this token.' });
    }

    req.user = user;
    next();

  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      console.warn('JWT verification error:', err.message);
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired.' });
    }
    console.error('Server error during authentication middleware:', err);
    res.status(500).json({ error: 'Server error during authentication.' });
  }
};