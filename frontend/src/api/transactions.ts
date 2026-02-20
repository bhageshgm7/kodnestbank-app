import axiosInstance from './axios';
import {
    Transaction,
    TransactionsResponse,
    DepositPayload,
    WithdrawPayload,
    TransferPayload,
} from '../types';

export const fetchTransactions = async (
    page = 1,
    limit = 20
): Promise<TransactionsResponse> => {
    const { data } = await axiosInstance.get<{ success: true; data: TransactionsResponse }>(
        `/transactions?page=${page}&limit=${limit}`
    );
    return data.data;
};

export const depositApi = async (
    payload: DepositPayload
): Promise<{ transaction: Transaction; newBalance: number }> => {
    const { data } = await axiosInstance.post<{
        success: true;
        data: { transaction: Transaction; newBalance: number };
    }>('/transactions/deposit', payload);
    return data.data;
};

export const withdrawApi = async (
    payload: WithdrawPayload
): Promise<{ transaction: Transaction; newBalance: number }> => {
    const { data } = await axiosInstance.post<{
        success: true;
        data: { transaction: Transaction; newBalance: number };
    }>('/transactions/withdraw', payload);
    return data.data;
};

export const transferApi = async (
    payload: TransferPayload
): Promise<{ newBalance: number; recipientName: string; amount: number }> => {
    const { data } = await axiosInstance.post<{
        success: true;
        data: { newBalance: number; recipientName: string; amount: number };
    }>('/transactions/transfer', payload);
    return data.data;
};
