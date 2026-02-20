import { Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import User from '../models/user.model';
import Transaction from '../models/transaction.model';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

// Zod schemas
export const amountSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    description: z.string().trim().optional(),
});

export const transferSchema = z.object({
    amount: z.number().positive('Amount must be positive'),
    recipientAccountNumber: z.string().length(12, 'Account number must be 12 digits'),
    description: z.string().trim().optional(),
});

// GET /api/transactions
export const getTransactions = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const skip = (page - 1) * limit;

        const [transactions, total] = await Promise.all([
            Transaction.find({ userId: req.user?.userId })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Transaction.countDocuments({ userId: req.user?.userId }),
        ]);

        res.status(200).json({
            success: true,
            data: {
                transactions,
                pagination: {
                    total,
                    page,
                    limit,
                    totalPages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/transactions/deposit
export const deposit = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { amount, description } = req.body as z.infer<typeof amountSchema>;
        const userId = req.user?.userId;

        const user = await User.findByIdAndUpdate(
            userId,
            { $inc: { balance: amount } },
            { new: true }
        );

        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const transaction = await Transaction.create({
            userId,
            type: 'credit',
            amount,
            description: description || 'Deposit',
        });

        res.status(200).json({
            success: true,
            message: 'Deposit successful',
            data: {
                transaction,
                newBalance: user.balance,
            },
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/transactions/withdraw
export const withdraw = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { amount, description } = req.body as z.infer<typeof amountSchema>;
        const userId = req.user?.userId;

        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        if (user.balance < amount) {
            res.status(400).json({
                success: false,
                message: `Insufficient funds. Available balance: $${user.balance.toFixed(2)}`,
            });
            return;
        }

        user.balance -= amount;
        await user.save();

        const transaction = await Transaction.create({
            userId,
            type: 'debit',
            amount,
            description: description || 'Withdrawal',
        });

        res.status(200).json({
            success: true,
            message: 'Withdrawal successful',
            data: {
                transaction,
                newBalance: user.balance,
            },
        });
    } catch (error) {
        next(error);
    }
};

// POST /api/transactions/transfer
export const transfer = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { amount, recipientAccountNumber, description } =
            req.body as z.infer<typeof transferSchema>;
        const userId = req.user?.userId;

        const sender = await User.findById(userId).session(session);
        if (!sender) {
            await session.abortTransaction();
            res.status(404).json({ success: false, message: 'Sender account not found' });
            return;
        }

        // Prevent self-transfer
        if (sender.accountNumber === recipientAccountNumber) {
            await session.abortTransaction();
            res.status(400).json({ success: false, message: 'Cannot transfer to your own account' });
            return;
        }

        const recipient = await User.findOne({ accountNumber: recipientAccountNumber }).session(session);
        if (!recipient) {
            await session.abortTransaction();
            res.status(404).json({
                success: false,
                message: `No account found with number ${recipientAccountNumber}`,
            });
            return;
        }

        if (sender.balance < amount) {
            await session.abortTransaction();
            res.status(400).json({
                success: false,
                message: `Insufficient funds. Available balance: $${sender.balance.toFixed(2)}`,
            });
            return;
        }

        // Atomic balance update
        sender.balance -= amount;
        recipient.balance += amount;

        await sender.save({ session });
        await recipient.save({ session });

        // Two transaction records
        const txDescription = description || `Transfer to ${recipientAccountNumber}`;
        await Transaction.insertMany(
            [
                {
                    userId: sender._id,
                    type: 'transfer',
                    amount,
                    description: txDescription,
                    recipientAccountNumber,
                },
                {
                    userId: recipient._id,
                    type: 'credit',
                    amount,
                    description: `Transfer from ${sender.accountNumber}`,
                    recipientAccountNumber: sender.accountNumber,
                },
            ],
            { session }
        );

        await session.commitTransaction();

        res.status(200).json({
            success: true,
            message: `Transfer of $${amount.toFixed(2)} to ${recipientAccountNumber} successful`,
            data: {
                newBalance: sender.balance,
                recipientName: recipient.name,
                amount,
            },
        });
    } catch (error) {
        await session.abortTransaction();
        next(error);
    } finally {
        session.endSession();
    }
};
