import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
    return (
        <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4">
            <div className="text-center animate-fade-in">
                <div className="text-9xl font-extrabold text-primary-500/20 mb-4">404</div>
                <h1 className="text-3xl font-bold text-white mb-3">Page not found</h1>
                <p className="text-slate-400 mb-8 max-w-sm mx-auto">
                    The page you're looking for doesn't exist or has been moved.
                </p>
                <Link
                    to="/"
                    className="inline-block px-6 py-3 rounded-xl bg-primary-600 hover:bg-primary-500 text-white font-semibold transition-colors"
                >
                    ← Back to Home
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
