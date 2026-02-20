import React from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Home: React.FC = () => {
    const { isAuthenticated } = useAuth();

    const features = [
        {
            icon: '🔐',
            title: 'Bank-Grade Security',
            desc: 'JWT tokens, bcrypt encryption, and secure sessions protect every transaction.',
        },
        {
            icon: '⚡',
            title: 'Instant Transfers',
            desc: 'Send money to any account in seconds with real-time balance updates.',
        },
        {
            icon: '📊',
            title: 'Full History',
            desc: 'Track every deposit, withdrawal, and transfer with detailed records.',
        },
        {
            icon: '🌐',
            title: 'Always Available',
            desc: '24/7 access to your funds from any device, anywhere.',
        },
    ];

    return (
        <div className="min-h-screen bg-surface-950 text-white">
            {/* Hero */}
            <section className="relative pt-32 pb-24 overflow-hidden">
                {/* Radial gradient background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full bg-primary-600/10 blur-3xl" />
                </div>

                <div className="relative max-w-5xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-medium mb-6 animate-fade-in">
                        <span className="w-2 h-2 rounded-full bg-primary-400 animate-pulse" />
                        Enterprise-Grade Banking
                    </div>

                    <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 animate-slide-up">
                        Your money,{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-purple-400">
                            secured.
                        </span>
                    </h1>

                    <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                        KodnestBank delivers a modern banking experience — deposit, withdraw, and transfer
                        funds with enterprise security and a beautifully crafted interface.
                    </p>

                    <div className="flex items-center justify-center gap-4 flex-wrap">
                        {isAuthenticated ? (
                            <Link
                                to="/dashboard"
                                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold text-lg shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-0.5"
                            >
                                Go to Dashboard →
                            </Link>
                        ) : (
                            <>
                                <Link
                                    to="/register"
                                    className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold text-lg shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-300 hover:-translate-y-0.5"
                                >
                                    Open Account Free
                                </Link>
                                <Link
                                    to="/login"
                                    className="px-8 py-3.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-300 hover:text-white font-semibold text-lg transition-all duration-300"
                                >
                                    Sign In
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 px-4 max-w-6xl mx-auto">
                <h2 className="text-center text-3xl font-bold mb-12 text-white">
                    Everything you need to manage your money
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {features.map((f) => (
                        <div
                            key={f.title}
                            className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 hover:-translate-y-1 transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 rounded-xl bg-primary-500/10 border border-primary-500/20 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
                                {f.icon}
                            </div>
                            <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            {!isAuthenticated && (
                <section className="py-20 px-4 text-center">
                    <div className="max-w-lg mx-auto p-8 rounded-3xl bg-gradient-to-br from-primary-600/20 to-purple-600/10 border border-primary-500/20">
                        <h2 className="text-2xl font-bold text-white mb-3">Ready to get started?</h2>
                        <p className="text-slate-400 mb-6">Create your free account in under 60 seconds.</p>
                        <Link
                            to="/register"
                            className="inline-block px-8 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-colors"
                        >
                            Create Free Account
                        </Link>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer className="border-t border-white/5 py-8 text-center text-slate-600 text-sm">
                © {new Date().getFullYear()} KodnestBank. Built with ❤️ for modern banking.
            </footer>
        </div>
    );
};

export default Home;
