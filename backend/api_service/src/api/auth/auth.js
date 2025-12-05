import jsonwebtoken from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

/* Signup */
export const signup = async (req, res) => {
    const { email, password, username } = req.body;

    /* Validation */
    if (!email || !password || !username) {
        return res.status(400).json({ error: 'Email, password, and username are required' });
    }

    if (password.length < 6) {
        return res.status(400).json({ error: 'Password length should be more than 6 characters' });
    }
    /* Validation - End */

    try {
        const existingUser = await prisma.users.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ error: 'User already exists with this email.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.users.create({
            data: {
                email,
                username,
                password: hashedPassword,
            },
        });

        const token = jsonwebtoken.sign(
            { userId: newUser.id, email: newUser.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: 'Signup successful and user logged in!',
            user: {
                id: newUser.id,
                email: newUser.email,
                username: newUser.username
            },
            token
        });

    } catch (err) {
        console.error('Server error during signup:', err);
        res.status(500).json({ error: 'Server error during signup.' });
    }
};

/* Login */
export const login = async (req, res) => {
    const { email, password } = req.body;

    /* Validation */
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    /* Validation - End */

    try {
        const user = await prisma.users.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ error: 'Invalid login credentials.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid login credentials.' });
        }

        const token = jsonwebtoken.sign(
            { userId: user.id, email: user.email },
            JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(200).json({
            message: 'Login successful!',
            user: {
                id: user.id,
                email: user.email,
                username: user.username
            },
            token
        });

    } catch (err) {
        console.error('Server error during login:', err);
        res.status(500).json({ error: 'Server error during login.' });
    }
};

/* Logout */
export const logout = async (req, res) => {
    return res.status(200).json({ message: 'Logout successful!' });
};
  