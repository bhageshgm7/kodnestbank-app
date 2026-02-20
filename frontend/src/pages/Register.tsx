import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Alert from '../components/Alert';

interface FormState {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
}

const Register: React.FC = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState<FormState>({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (form.password !== form.confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }

        setLoading(true);
        try {
            await register({ name: form.name, email: form.email, password: form.password });
            navigate('/dashboard');
        } catch (err: unknown) {
            const axiosErr = err as {
                response?: { data?: { message?: string; errors?: { message: string }[] } };
            };
            const apiErrors = axiosErr.response?.data?.errors;
            setError(
                apiErrors?.map((e) => e.message).join(', ') ||
                axiosErr.response?.data?.message ||
                'Registration failed. Please try again.'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-surface-950 flex items-center justify-center px-4 pt-20 pb-12">
            <div className="w-full max-w-md">
                <div className="rounded-3xl bg-white/5 border border-white/10 p-8 animate-fade-in shadow-2xl shadow-black/40">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-2xl shadow-lg shadow-primary-500/30 mx-auto mb-4">
                            ✨
                        </div>
                        <h1 className="text-2xl font-bold text-white">Open your account</h1>
                        <p className="text-slate-400 text-sm mt-1">Free forever. No hidden fees.</p>
                    </div>

                    {error && (
                        <div className="mb-6">
                            <Alert type="error" message={error} onClose={() => setError(null)} />
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
                        <div>
                            <label htmlFor="reg-name" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Full Name
                            </label>
                            <input
                                id="reg-name"
                                name="name"
                                type="text"
                                autoComplete="name"
                                required
                                value={form.name}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                                placeholder="John Doe"
                            />
                        </div>

                        <div>
                            <label htmlFor="reg-email" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Email Address
                            </label>
                            <input
                                id="reg-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                value={form.email}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label htmlFor="reg-password" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Password
                            </label>
                            <input
                                id="reg-password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={form.password}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                                placeholder="Min 8 characters"
                            />
                        </div>

                        <div>
                            <label htmlFor="reg-confirm" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Confirm Password
                            </label>
                            <input
                                id="reg-confirm"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={form.confirmPassword}
                                onChange={handleChange}
                                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold text-base shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </span>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-slate-500 text-sm mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-primary-400 hover:text-primary-300 font-medium transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Register;
