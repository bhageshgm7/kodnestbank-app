import { Response, NextFunction } from 'express';
import User from '../models/user.model';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// GET /api/user/me
export const getMe = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const user = await User.findById(req.user?.userId);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        res.status(200).json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                accountNumber: user.accountNumber,
                balance: user.balance,
                createdAt: user.createdAt,
            },
        });
    } catch (error) {
        next(error);
    }
};
