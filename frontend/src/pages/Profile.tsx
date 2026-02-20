import React from 'react';
import useAuth from '../hooks/useAuth';
import StatsCard from '../components/StatsCard';

const Profile: React.FC = () => {
    const { user } = useAuth();

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString('en-IN', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        })
        : '—';

    return (
        <div className="min-h-screen bg-surface-950 text-white pt-20">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-white">My Profile</h1>
                    <p className="text-slate-400 mt-1">Your account details and preferences.</p>
                </div>

                {/* Avatar Card */}
                <div className="rounded-2xl bg-white/5 border border-white/10 p-8 mb-6 flex items-center gap-6 animate-fade-in">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-3xl font-bold text-white shadow-lg shadow-primary-500/20 flex-shrink-0">
                        {user?.name?.charAt(0).toUpperCase() ?? '?'}
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                        <p className="text-slate-400 mt-0.5">{user?.email}</p>
                        <p className="text-slate-500 text-sm mt-1 font-mono">Member since {memberSince}</p>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
                    <StatsCard
                        label="Account Balance"
                        value={`$${user?.balance.toFixed(2) ?? '0.00'}`}
                        icon="💰"
                        gradient="from-emerald-600 to-emerald-800"
                    />
                    <StatsCard
                        label="Account Number"
                        value={user?.accountNumber ?? '—'}
                        sub="12-digit unique identifier"
                        icon="🏦"
                        gradient="from-primary-600 to-primary-800"
                    />
                </div>

                {/* Details Table */}
                <div className="rounded-2xl bg-white/5 border border-white/10 divide-y divide-white/5 overflow-hidden">
                    {[
                        { label: 'Full Name', value: user?.name ?? '—' },
                        { label: 'Email Address', value: user?.email ?? '—' },
                        { label: 'Account Number', value: user?.accountNumber ?? '—', mono: true },
                        { label: 'Current Balance', value: `$${user?.balance.toFixed(2) ?? '0.00'}` },
                        { label: 'Member Since', value: memberSince },
                    ].map(({ label, value, mono }) => (
                        <div key={label} className="flex items-center justify-between px-6 py-4 hover:bg-white/3 transition-colors">
                            <span className="text-slate-400 text-sm">{label}</span>
                            <span className={`text-white text-sm font-medium ${mono ? 'font-mono' : ''}`}>{value}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Profile;
