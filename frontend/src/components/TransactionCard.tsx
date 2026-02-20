import React from 'react';
import { Transaction } from '../types';

interface TransactionCardProps {
    transaction: Transaction;
}

const typeConfig = {
    credit: {
        label: 'Credit',
        icon: '↓',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10',
        border: 'border-emerald-500/20',
        sign: '+',
    },
    debit: {
        label: 'Debit',
        icon: '↑',
        color: 'text-red-400',
        bg: 'bg-red-500/10',
        border: 'border-red-500/20',
        sign: '-',
    },
    transfer: {
        label: 'Transfer',
        icon: '→',
        color: 'text-primary-400',
        bg: 'bg-primary-500/10',
        border: 'border-primary-500/20',
        sign: '-',
    },
};

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction }) => {
    const config = typeConfig[transaction.type];
    const date = new Date(transaction.createdAt);
    const formattedDate = date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
    const formattedTime = date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
    });

    return (
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10 hover:bg-white/8 transition-all duration-200 animate-fade-in">
            {/* Icon */}
            <div className={`w-10 h-10 rounded-xl ${config.bg} border ${config.border} flex items-center justify-center flex-shrink-0`}>
                <span className={`${config.color} font-bold text-lg`}>{config.icon}</span>
            </div>

            {/* Details */}
            <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">{transaction.description}</p>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-xs font-medium px-1.5 py-0.5 rounded-md ${config.bg} ${config.color}`}>
                        {config.label}
                    </span>
                    {transaction.recipientAccountNumber && (
                        <span className="text-slate-500 text-xs font-mono truncate">
                            → {transaction.recipientAccountNumber}
                        </span>
                    )}
                </div>
            </div>

            {/* Amount + Date */}
            <div className="flex flex-col items-end flex-shrink-0">
                <span className={`text-base font-bold ${config.color}`}>
                    {config.sign}${transaction.amount.toFixed(2)}
                </span>
                <span className="text-slate-500 text-xs mt-0.5">{formattedDate}</span>
                <span className="text-slate-600 text-xs">{formattedTime}</span>
            </div>
        </div>
    );
};

export default TransactionCard;
