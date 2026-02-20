import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { depositApi, withdrawApi, transferApi } from '../api/transactions';
import Alert from '../components/Alert';

type TabType = 'deposit' | 'withdraw' | 'transfer';

interface DepositWithdrawForm {
    amount: string;
    description: string;
}

interface TransferForm {
    amount: string;
    recipientAccountNumber: string;
    description: string;
}

const Transfer: React.FC = () => {
    const [searchParams] = useSearchParams();
    const { user, updateBalance } = useAuth();
    const [activeTab, setActiveTab] = useState<TabType>('deposit');
    const [loading, setLoading] = useState(false);
    const [alert, setAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    const [txForm, setTxForm] = useState<DepositWithdrawForm>({ amount: '', description: '' });
    const [transferForm, setTransferForm] = useState<TransferForm>({
        amount: '',
        recipientAccountNumber: '',
        description: '',
    });

    // Set tab from query param (?type=deposit)
    useEffect(() => {
        const type = searchParams.get('type') as TabType | null;
        if (type && ['deposit', 'withdraw', 'transfer'].includes(type)) {
            setActiveTab(type);
        }
    }, [searchParams]);

    const clearAlert = () => setAlert(null);

    const handleDepositWithdraw = async (type: 'deposit' | 'withdraw') => {
        const amount = parseFloat(txForm.amount);
        if (isNaN(amount) || amount <= 0) {
            setAlert({ type: 'error', message: 'Please enter a valid amount.' });
            return;
        }

        setLoading(true);
        clearAlert();
        try {
            const api = type === 'deposit' ? depositApi : withdrawApi;
            const result = await api({ amount, description: txForm.description || undefined });
            updateBalance(result.newBalance);
            setAlert({
                type: 'success',
                message: `${type === 'deposit' ? 'Deposit' : 'Withdrawal'} of $${amount.toFixed(2)} successful!`,
            });
            setTxForm({ amount: '', description: '' });
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            setAlert({ type: 'error', message: axiosErr.response?.data?.message || 'Operation failed.' });
        } finally {
            setLoading(false);
        }
    };

    const handleTransfer = async () => {
        const amount = parseFloat(transferForm.amount);
        if (isNaN(amount) || amount <= 0) {
            setAlert({ type: 'error', message: 'Please enter a valid amount.' });
            return;
        }
        if (transferForm.recipientAccountNumber.length !== 12) {
            setAlert({ type: 'error', message: 'Account number must be exactly 12 digits.' });
            return;
        }

        setLoading(true);
        clearAlert();
        try {
            const result = await transferApi({
                amount,
                recipientAccountNumber: transferForm.recipientAccountNumber,
                description: transferForm.description || undefined,
            });
            updateBalance(result.newBalance);
            setAlert({
                type: 'success',
                message: `Transferred $${result.amount.toFixed(2)} to ${result.recipientName} successfully!`,
            });
            setTransferForm({ amount: '', recipientAccountNumber: '', description: '' });
        } catch (err: unknown) {
            const axiosErr = err as { response?: { data?: { message?: string } } };
            setAlert({ type: 'error', message: axiosErr.response?.data?.message || 'Transfer failed.' });
        } finally {
            setLoading(false);
        }
    };

    const tabs: { key: TabType; label: string; icon: string }[] = [
        { key: 'deposit', label: 'Deposit', icon: '↓' },
        { key: 'withdraw', label: 'Withdraw', icon: '↑' },
        { key: 'transfer', label: 'Transfer', icon: '→' },
    ];

    const inputClass =
        'w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all';

    return (
        <div className="min-h-screen bg-surface-950 text-white pt-20">
            <div className="max-w-xl mx-auto px-4 sm:px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">Move Money</h1>
                    <p className="text-slate-400 mt-1">
                        Available: <span className="text-emerald-400 font-semibold">${user?.balance.toFixed(2)}</span>
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 rounded-2xl bg-white/5 border border-white/10 mb-8">
                    {tabs.map((tab) => (
                        <button
                            key={tab.key}
                            id={`tab-${tab.key}`}
                            onClick={() => { setActiveTab(tab.key); clearAlert(); }}
                            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.key
                                    ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/20'
                                    : 'text-slate-400 hover:text-white'
                                }`}
                        >
                            <span>{tab.icon}</span> {tab.label}
                        </button>
                    ))}
                </div>

                {alert && (
                    <div className="mb-6">
                        <Alert type={alert.type} message={alert.message} onClose={clearAlert} />
                    </div>
                )}

                {/* Form Card */}
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6 animate-fade-in">
                    {(activeTab === 'deposit' || activeTab === 'withdraw') && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Amount ($)</label>
                                <input
                                    id={`amount-${activeTab}`}
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={txForm.amount}
                                    onChange={(e) => setTxForm((p) => ({ ...p, amount: e.target.value }))}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Description (optional)</label>
                                <input
                                    id={`description-${activeTab}`}
                                    type="text"
                                    placeholder={activeTab === 'deposit' ? 'Salary, savings…' : 'Grocery, rent…'}
                                    value={txForm.description}
                                    onChange={(e) => setTxForm((p) => ({ ...p, description: e.target.value }))}
                                    className={inputClass}
                                />
                            </div>
                            <button
                                id={`submit-${activeTab}`}
                                onClick={() => handleDepositWithdraw(activeTab)}
                                disabled={loading}
                                className={`w-full py-3.5 rounded-xl font-semibold text-white text-base disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5 ${activeTab === 'deposit'
                                        ? 'bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 shadow-lg shadow-emerald-500/20'
                                        : 'bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 shadow-lg shadow-red-500/20'
                                    }`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    `Confirm ${activeTab === 'deposit' ? 'Deposit' : 'Withdrawal'}`
                                )}
                            </button>
                        </div>
                    )}

                    {activeTab === 'transfer' && (
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Recipient Account Number</label>
                                <input
                                    id="transfer-recipient"
                                    type="text"
                                    maxLength={12}
                                    placeholder="12-digit account number"
                                    value={transferForm.recipientAccountNumber}
                                    onChange={(e) =>
                                        setTransferForm((p) => ({ ...p, recipientAccountNumber: e.target.value.replace(/\D/g, '') }))
                                    }
                                    className={`${inputClass} font-mono`}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Amount ($)</label>
                                <input
                                    id="transfer-amount"
                                    type="number"
                                    min="0.01"
                                    step="0.01"
                                    placeholder="0.00"
                                    value={transferForm.amount}
                                    onChange={(e) => setTransferForm((p) => ({ ...p, amount: e.target.value }))}
                                    className={inputClass}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-300 mb-1.5">Description (optional)</label>
                                <input
                                    id="transfer-description"
                                    type="text"
                                    placeholder="Payment for…"
                                    value={transferForm.description}
                                    onChange={(e) => setTransferForm((p) => ({ ...p, description: e.target.value }))}
                                    className={inputClass}
                                />
                            </div>
                            <button
                                id="submit-transfer"
                                onClick={handleTransfer}
                                disabled={loading}
                                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold text-base shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </span>
                                ) : (
                                    'Send Transfer'
                                )}
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Transfer;
