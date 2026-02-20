import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import User from '../models/user.model';
import generateAccountNumber from '../utils/generateAccountNumber';
import generateAccessToken from '../utils/generateAccessToken';
import generateRefreshToken from '../utils/generateRefreshToken';
import jwt from 'jsonwebtoken';

// Zod Schemas
export const registerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').trim(),
    email: z.string().email('Invalid email address').toLowerCase(),
    password: z.string().min(8, 'Password must be at least 8 characters'),
});

export const loginSchema = z.object({
    email: z.string().email('Invalid email address').toLowerCase(),
    password: z.string().min(1, 'Password is required'),
});

export const refreshSchema = z.object({
    refreshToken: z.string().min(1, 'Refresh token is required'),
});

// POST /api/auth/register
export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { name, email, password } = req.body as z.infer<typeof registerSchema>;

        // Check if email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            res.status(409).json({ success: false, message: 'Email is already registered' });
            return;
        }

        // Generate unique account number
        const accountNumber = await generateAccountNumber();

        // Create user (password hashed via pre-save hook)
        const user = await User.create({ name, email, password, accountNumber });

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user._id.toString(),
            email: user.email,
            accountNumber: user.accountNumber,
        });
        const refreshToken = generateRefreshToken({ userId: user._id.toString() });

        res.status(201).json({
            success: true,
            message: 'Account created successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    accountNumber: user.accountNumber,
                    balance: user.balance,
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/login
export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { email, password } = req.body as z.infer<typeof loginSchema>;

        // Explicitly select password (excluded by default)
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid email or password' });
            return;
        }

        const accessToken = generateAccessToken({
            userId: user._id.toString(),
            email: user.email,
            accountNumber: user.accountNumber,
        });
        const refreshToken = generateRefreshToken({ userId: user._id.toString() });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    accountNumber: user.accountNumber,
                    balance: user.balance,
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/refresh
export const refresh = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { refreshToken } = req.body as z.infer<typeof refreshSchema>;

        const secret = process.env.REFRESH_TOKEN_SECRET;
        if (!secret) {
            res.status(500).json({ success: false, message: 'Server configuration error' });
            return;
        }

        let decoded: { userId: string };
        try {
            decoded = jwt.verify(refreshToken, secret) as { userId: string };
        } catch {
            res.status(401).json({ success: false, message: 'Invalid or expired refresh token' });
            return;
        }

        const user = await User.findById(decoded.userId);
        if (!user) {
            res.status(401).json({ success: false, message: 'User not found' });
            return;
        }

        const accessToken = generateAccessToken({
            userId: user._id.toString(),
            email: user.email,
            accountNumber: user.accountNumber,
        });

        res.status(200).json({
            success: true,
            message: 'Token refreshed',
            data: { accessToken },
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/auth/logout
export const logout = async (
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Stateless JWT – client should discard tokens.
        // Extend here for token blacklisting / Redis revocation if needed.
        res.status(200).json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        next(error);
    }
};
