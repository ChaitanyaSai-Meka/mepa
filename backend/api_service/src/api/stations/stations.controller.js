import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const searchStations = async (req, res) => {
  const { query } = req.query;

  try {
    const whereClause = query
      ? {
          name: {
            contains: query,
            mode: 'insensitive'
          }
        }
      : {};

    const data = await prisma.stations.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        line_name: true
      },
      take: 10
    });

    return res.json(data);
  } catch (err) {
    console.error('Server error searching stations:', err);
    res.status(500).json({ error: 'Server error' });
  }
};