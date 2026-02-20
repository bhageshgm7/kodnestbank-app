import React from 'react';

interface AlertProps {
    type: 'success' | 'error' | 'info' | 'warning';
    message: string;
    onClose?: () => void;
}

const alertStyles = {
    success: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    error: 'bg-red-500/10 border-red-500/30 text-red-300',
    info: 'bg-primary-500/10 border-primary-500/30 text-primary-300',
    warning: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
};

const alertIcons = {
    success: '✓',
    error: '✕',
    info: 'ℹ',
    warning: '⚠',
};

const Alert: React.FC<AlertProps> = ({ type, message, onClose }) => {
    return (
        <div
            className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm font-medium animate-slide-up ${alertStyles[type]}`}
            role="alert"
        >
            <span className="flex-shrink-0 font-bold">{alertIcons[type]}</span>
            <span className="flex-1">{message}</span>
            {onClose && (
                <button
                    onClick={onClose}
                    className="flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
                    aria-label="Close"
                >
                    ✕
                </button>
            )}
        </div>
    );
};

export default Alert;
