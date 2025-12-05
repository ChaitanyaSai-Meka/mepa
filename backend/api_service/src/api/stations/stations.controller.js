import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const searchStations = async (req, res) => {
  const { query } = req.query;

  try {
    const whereClause = query
      ? {
          OR: [
            {
              name: {
                contains: query
              }
            },
            {
              id: {
                contains: query
              }
            }
          ],
          parent_station_id: {
            not: null
          },
          id: {
            not: {
              contains: 'ENT'
            }
          }
        }
      : {
          parent_station_id: {
            not: null
          },
          id: {
            not: {
              contains: 'ENT'
            }
          }
        };

    const data = await prisma.stations.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        line_name: true
      },
      take: 10,
      orderBy: {
        id: 'asc'
      }
    });

    const formatted = data.map(station => {
      const platformMatch = station.id.match(/\d+$/);
      const platformNumber = platformMatch ? platformMatch[0] : '';
      return {
        ...station,
        name: platformNumber ? `${station.name} - Platform ${platformNumber}` : station.name
      };
    });

    return res.json(formatted);
  } catch (err) {
    console.error('Server error searching stations:', err);
    res.status(500).json({ error: 'Server error' });
  }
};