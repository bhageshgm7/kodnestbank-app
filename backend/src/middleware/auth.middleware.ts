import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email: string;
        accountNumber: string;
    };
}

const authMiddleware = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ success: false, message: 'Access token missing or malformed' });
        return;
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.ACCESS_TOKEN_SECRET;

    if (!secret) {
        res.status(500).json({ success: false, message: 'Server configuration error' });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret) as {
            userId: string;
            email: string;
            accountNumber: string;
        };
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ success: false, message: 'Access token expired' });
        } else {
            res.status(401).json({ success: false, message: 'Invalid access token' });
        }
    }
};

export default authMiddleware;
