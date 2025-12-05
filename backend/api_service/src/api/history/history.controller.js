import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMyHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const data = await prisma.history.findMany({
      where: { user_id: userId },
      select: {
        viewed_at: true,
        route: {
          select: {
            id: true,
            route_name: true,
            created_at: true,
            start_station: {
              select: {
                name: true,
                line_name: true
              }
            },
            end_station: {
              select: {
                name: true,
                line_name: true
              }
            }
          }
        }
      },
      orderBy: { viewed_at: 'desc' },
      take: 50
    });

    return res.status(200).json(data || []);

  } catch (err) {
    console.error('Server error getting history:', err);
    res.status(500).json({ error: 'Server error retrieving history.' });
  }
};

export const addRouteToHistory = async (req, res) => {
  const userId = req.user.id;
  const { route_id } = req.body;

  if (!route_id) {
    return res.status(400).json({ error: 'route_id is required in the request body.' });
  }

  try {
    const data = await prisma.history.create({
      data: {
        user_id: userId,
        route_id: route_id
      },
      select: { id: true }
    });

    return res.status(201).json({ message: 'Route added to history successfully.' });

  } catch (err) {
    if (err.code === 'P2003') {
      return res.status(404).json({ error: 'Route not found. Cannot add non-existent route to history.' });
    }
    console.error('Server error adding to history:', err);
    res.status(500).json({ error: 'Server error adding to history.' });
  }
};

export const clearMyHistory = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await prisma.history.deleteMany({
      where: { user_id: userId }
    });

    console.log(`Cleared ${result.count} history entries for user ${userId}`);
    return res.status(200).json({ message: `Successfully cleared ${result.count} history entries.` });

  } catch (err) {
    console.error('Server error clearing history:', err);
    res.status(500).json({ error: 'Server error clearing history.' });
  }
};