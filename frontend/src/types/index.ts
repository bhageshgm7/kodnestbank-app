// ─── User ────────────────────────────────────────────────────────────────────
export interface User {
    id: string;
    name: string;
    email: string;
    accountNumber: string;
    balance: number;
    createdAt?: string;
}

// ─── Transactions ─────────────────────────────────────────────────────────────
export type TransactionType = 'credit' | 'debit' | 'transfer';

export interface Transaction {
    _id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    description: string;
    recipientAccountNumber?: string;
    createdAt: string;
}

export interface Pagination {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface TransactionsResponse {
    transactions: Transaction[];
    pagination: Pagination;
}

// ─── Auth ────────────────────────────────────────────────────────────────────
export interface AuthResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}

export interface RegisterPayload {
    name: string;
    email: string;
    password: string;
}

export interface LoginPayload {
    email: string;
    password: string;
}

// ─── API ─────────────────────────────────────────────────────────────────────
export interface ApiSuccess<T> {
    success: true;
    message?: string;
    data: T;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: { field: string; message: string }[];
}

// ─── Transaction Payloads ─────────────────────────────────────────────────────
export interface DepositPayload {
    amount: number;
    description?: string;
}

export interface WithdrawPayload {
    amount: number;
    description?: string;
}

export interface TransferPayload {
    amount: number;
    recipientAccountNumber: string;
    description?: string;
}
