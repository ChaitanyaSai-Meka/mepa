import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMyProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const data = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true
      }
    });

    if (!data) {
      return res.status(404).json({ error: 'Your profile data could not be found.' });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('Server error getting own profile:', err);
    res.status(500).json({ error: 'Server error getting your profile.' });
  }
};

export const updateMyProfile = async (req, res) => {
  const userId = req.user.id;
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required.' });
  }

  try {
    const data = await prisma.users.update({
      where: { id: userId },
      data: { username: username },
      select: {
        id: true,
        username: true,
        email: true,
        created_at: true
      }
    });

    return res.status(200).json({ message: 'Profile updated successfully!', profile: data });

  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Username is already taken.' });
    }
    console.error('Server error updating profile:', err);
    res.status(500).json({ error: 'Server error updating profile.' });
  }
};