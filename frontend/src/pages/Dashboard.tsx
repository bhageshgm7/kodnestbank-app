import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useTransactions from '../hooks/useTransactions';
import StatsCard from '../components/StatsCard';
import TransactionCard from '../components/TransactionCard';
import Loader from '../components/Loader';

const Dashboard: React.FC = () => {
    const { user } = useAuth();
    const { transactions, loading, load } = useTransactions();

    useEffect(() => {
        load(1);
    }, [load]);

    const recentTransactions = transactions.slice(0, 5);

    return (
        <div className="min-h-screen bg-surface-950 text-white pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
                {/* Greeting */}
                <div className="mb-8 animate-fade-in">
                    <h1 className="text-3xl font-bold text-white">
                        Good day, <span className="text-primary-400">{user?.name?.split(' ')[0]}</span> 👋
                    </h1>
                    <p className="text-slate-400 mt-1">Here's your financial overview.</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
                    <StatsCard
                        label="Current Balance"
                        value={`$${user?.balance.toFixed(2) ?? '0.00'}`}
                        icon="💰"
                        gradient="from-emerald-600 to-emerald-800"
                    />
                    <StatsCard
                        label="Account Number"
                        value={user?.accountNumber ?? '—'}
                        icon="🏦"
                        gradient="from-primary-600 to-primary-800"
                    />
                    <StatsCard
                        label="Account Holder"
                        value={user?.name ?? '—'}
                        sub={user?.email}
                        icon="👤"
                        gradient="from-purple-600 to-purple-800"
                    />
                    <StatsCard
                        label="Transactions"
                        value={transactions.length.toString()}
                        sub="Recent activity"
                        icon="📄"
                        gradient="from-sky-600 to-sky-800"
                    />
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
                    {[
                        { to: '/transfer?type=deposit', label: 'Deposit', icon: '↓', color: 'emerald' },
                        { to: '/transfer?type=withdraw', label: 'Withdraw', icon: '↑', color: 'red' },
                        { to: '/transfer', label: 'Transfer', icon: '→', color: 'indigo' },
                    ].map(({ to, label, icon, color }) => (
                        <Link
                            key={label}
                            to={to}
                            className={`flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all duration-300 hover:-translate-y-0.5 group ${color === 'emerald'
                                    ? 'bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/15'
                                    : color === 'red'
                                        ? 'bg-red-500/10 border-red-500/20 hover:bg-red-500/15'
                                        : 'bg-primary-500/10 border-primary-500/20 hover:bg-primary-500/15'
                                }`}
                        >
                            <span
                                className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold ${color === 'emerald'
                                        ? 'bg-emerald-500/20 text-emerald-400'
                                        : color === 'red'
                                            ? 'bg-red-500/20 text-red-400'
                                            : 'bg-primary-500/20 text-primary-400'
                                    }`}
                            >
                                {icon}
                            </span>
                            <div>
                                <p className="text-white font-semibold">{label}</p>
                                <p className="text-slate-500 text-xs">Quick action</p>
                            </div>
                            <span className="ml-auto text-slate-600 group-hover:text-slate-400 transition-colors">→</span>
                        </Link>
                    ))}
                </div>

                {/* Recent Transactions */}
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white">Recent Activity</h2>
                        <Link to="/transactions" className="text-primary-400 text-sm hover:text-primary-300 transition-colors">
                            View all →
                        </Link>
                    </div>

                    {loading ? (
                        <Loader />
                    ) : recentTransactions.length === 0 ? (
                        <div className="py-12 text-center">
                            <p className="text-4xl mb-3">📭</p>
                            <p className="text-slate-400">No transactions yet.</p>
                            <Link to="/transfer" className="text-primary-400 text-sm mt-2 inline-block hover:text-primary-300">
                                Make your first deposit →
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {recentTransactions.map((tx) => (
                                <TransactionCard key={tx._id} transaction={tx} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
