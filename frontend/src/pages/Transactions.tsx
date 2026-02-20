import React, { useEffect, useState } from 'react';
import useTransactions from '../hooks/useTransactions';
import TransactionCard from '../components/TransactionCard';
import Loader from '../components/Loader';

const Transactions: React.FC = () => {
    const { transactions, pagination, loading, error, load } = useTransactions();
    const [page, setPage] = useState(1);

    useEffect(() => {
        load(page);
    }, [load, page]);

    return (
        <div className="min-h-screen bg-surface-950 text-white pt-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Transaction History</h1>
                    <p className="text-slate-400 mt-1">
                        {pagination ? `${pagination.total} total transactions` : 'Loading...'}
                    </p>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                    {loading ? (
                        <Loader />
                    ) : error ? (
                        <div className="py-12 text-center text-red-400">{error}</div>
                    ) : transactions.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-4xl mb-3">📭</p>
                            <p className="text-slate-400">No transactions found.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {transactions.map((tx) => (
                                <TransactionCard key={tx._id} transaction={tx} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {pagination && pagination.totalPages > 1 && (
                        <div className="flex items-center justify-center gap-3 mt-8">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                disabled={page === 1 || loading}
                                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
                            >
                                ← Prev
                            </button>
                            <span className="text-slate-400 text-sm">
                                Page {page} of {pagination.totalPages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                                disabled={page === pagination.totalPages || loading}
                                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 disabled:opacity-40 disabled:cursor-not-allowed transition-all text-sm"
                            >
                                Next →
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Transactions;
