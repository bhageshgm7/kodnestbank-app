import React from 'react';

interface StatsCardProps {
    label: string;
    value: string;
    sub?: string;
    icon: string;
    gradient?: string;
}

const StatsCard: React.FC<StatsCardProps> = ({
    label,
    value,
    sub,
    icon,
    gradient = 'from-primary-600 to-primary-800',
}) => {
    return (
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 hover:bg-white/8 transition-all duration-300 group animate-slide-up">
            {/* Background glow */}
            <div className={`absolute -top-8 -right-8 w-32 h-32 rounded-full bg-gradient-to-br ${gradient} opacity-10 group-hover:opacity-20 transition-opacity blur-2xl`} />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-slate-400 text-sm font-medium">{label}</span>
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-xl shadow-lg`}>
                        {icon}
                    </div>
                </div>
                <p className="text-white text-2xl font-bold tracking-tight">{value}</p>
                {sub && <p className="text-slate-500 text-xs mt-1 font-mono">{sub}</p>}
            </div>
        </div>
    );
};

export default StatsCard;
