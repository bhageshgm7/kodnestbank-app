import { useState, useCallback } from 'react';
import { Transaction, Pagination } from '../types';
import { fetchTransactions } from '../api/transactions';

interface UseTransactionsResult {
    transactions: Transaction[];
    pagination: Pagination | null;
    loading: boolean;
    error: string | null;
    load: (page?: number) => Promise<void>;
}

const useTransactions = (): UseTransactionsResult => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [pagination, setPagination] = useState<Pagination | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchTransactions(page);
            setTransactions(data.transactions);
            setPagination(data.pagination);
        } catch (err: unknown) {
            const msg =
                err instanceof Error ? err.message : 'Failed to load transactions';
            setError(msg);
        } finally {
            setLoading(false);
        }
    }, []);

    return { transactions, pagination, loading, error, load };
};

export default useTransactions;
