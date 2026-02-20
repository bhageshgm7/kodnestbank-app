import mongoose, { Document, Schema } from 'mongoose';

export type TransactionType = 'credit' | 'debit' | 'transfer';

export interface ITransaction extends Document {
    userId: mongoose.Types.ObjectId;
    type: TransactionType;
    amount: number;
    description: string;
    recipientAccountNumber?: string;
    createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        type: {
            type: String,
            enum: ['credit', 'debit', 'transfer'],
            required: true,
        },
        amount: {
            type: Number,
            required: true,
            min: [0.01, 'Amount must be greater than 0'],
        },
        description: {
            type: String,
            required: true,
            trim: true,
        },
        recipientAccountNumber: {
            type: String,
            default: null,
        },
    },
    {
        timestamps: { createdAt: true, updatedAt: false },
    }
);

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);
export default Transaction;
