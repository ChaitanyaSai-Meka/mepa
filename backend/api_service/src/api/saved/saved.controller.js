import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMySavedRoutes = async (req, res) => {
  const userId = req.user.id;

  try {
    const data = await prisma.saved_routes.findMany({
      where: { user_id: userId },
      select: {
        saved_at: true,
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
            },
            shortest_path: true
          }
        }
      },
      orderBy: { saved_at: 'desc' }
    });

    return res.status(200).json(data || []);

  } catch (err) {
    console.error('Server error getting saved routes:', err);
    res.status(500).json({ error: 'Server error retrieving saved routes.' });
  }
};

export const saveRoute = async (req, res) => {
  const userId = req.user.id;
  const { route_id } = req.body;

  if (!route_id) {
    return res.status(400).json({ error: 'route_id is required in the request body.' });
  }

  try {
    const data = await prisma.saved_routes.create({
      data: {
        user_id: userId,
        route_id: route_id
      }
    });

    return res.status(201).json({ message: 'Route saved successfully!', saved_record: data });

  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Route already saved.' });
    }
    if (err.code === 'P2003') {
      return res.status(404).json({ error: 'Route not found. Cannot save a non-existent route.' });
    }
    console.error('Server error saving route:', err);
    res.status(500).json({ error: 'Server error saving route.' });
  }
};

export const unsaveRoute = async (req, res) => {
  const userId = req.user.id;
  const { route_id } = req.params;

  if (!route_id) {
    return res.status(400).json({ error: 'route_id parameter is required in the URL.' });
  }

  try {
    const result = await prisma.saved_routes.deleteMany({
      where: {
        user_id: userId,
        route_id: parseInt(route_id)
      }
    });

    if (result.count === 0) {
      return res.status(404).json({ error: 'Saved route not found or you do not have permission to unsave it.' });
    }

    return res.status(200).json({ message: 'Route unsaved successfully.' });

  } catch (err) {
    console.error('Server error unsaving route:', err);
    res.status(500).json({ error: 'Server error unsaving route.' });
  }
};