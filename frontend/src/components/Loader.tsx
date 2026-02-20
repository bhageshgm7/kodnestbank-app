import React from 'react';

interface LoaderProps {
    fullScreen?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const sizeClass = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-2',
    lg: 'w-16 h-16 border-4',
};

const Loader: React.FC<LoaderProps> = ({ fullScreen = false, size = 'md' }) => {
    const spinner = (
        <div
            className={`${sizeClass[size]} rounded-full border-primary-500/30 border-t-primary-500 animate-spin`}
        />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-surface-950 flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-4">
                    {spinner}
                    <p className="text-slate-400 text-sm font-medium animate-pulse-slow">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center py-8">
            {spinner}
        </div>
    );
};

export default Loader;
