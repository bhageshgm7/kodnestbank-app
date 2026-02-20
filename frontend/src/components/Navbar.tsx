import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

const Navbar: React.FC = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navLinks = [
        { label: 'Dashboard', to: '/dashboard' },
        { label: 'Transactions', to: '/transactions' },
        { label: 'Transfer', to: '/transfer' },
        { label: 'Profile', to: '/profile' },
    ];

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-surface-900/80 backdrop-blur-xl border-b border-primary-700/30">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/30">
                            <span className="text-white font-bold text-sm">K</span>
                        </div>
                        <span className="font-bold text-white text-lg tracking-tight">
                            Kodnest<span className="text-primary-400">Bank</span>
                        </span>
                    </Link>

                    {/* Navigation Links */}
                    {isAuthenticated && (
                        <div className="hidden md:flex items-center gap-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${location.pathname === link.to
                                            ? 'bg-primary-600/30 text-primary-300'
                                            : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {link.label}
                                </Link>
                            ))}
                        </div>
                    )}

                    {/* Right Side */}
                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <div className="hidden sm:flex flex-col items-end">
                                    <span className="text-white text-sm font-medium leading-tight">{user?.name}</span>
                                    <span className="text-primary-400 text-xs font-mono">{user?.accountNumber}</span>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex items-center gap-2">
                                <Link
                                    to="/login"
                                    className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-1.5 rounded-lg bg-primary-600 hover:bg-primary-500 text-white text-sm font-medium transition-colors"
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
