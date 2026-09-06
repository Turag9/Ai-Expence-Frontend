import { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Wallet, Mail } from 'lucide-react';
import AuthHero from '../components/AuthHero.jsx';
import Spinner from '../components/Spinner.jsx';
import api from '../lib/axios.js';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/forgot-password', { email });
            setSent(true);
            toast.success('OTP sent! Please check your email.');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            <div className="flex-1 flex flex-col px-6 sm:px-10 lg:px-14 py-8 order-1">
                <div className="flex justify-start items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-linear-to-br from-violet-400 to-violet-600 flex items-center justify-center">
                        <Wallet size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-xl text-slate-900">ExpenseAI</span>
                </div>

                <div className="flex-1 flex items-center justify-center py-10">
                    <div className="w-full max-w-md">
                        {!sent ? (
                            <>
                                <div className="mb-6 w-14 h-14 rounded-2xl bg-violet-50 flex items-center justify-center">
                                    <Mail size={24} className="text-violet-600" />
                                </div>
                                <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">Forgot Password?</h2>
                                <p className="text-slate-500 mb-10">Enter your email and we'll send you an OTP.</p>

                                <form onSubmit={onSubmit} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Email</label>
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-violet-500 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none transition"
                                            placeholder="you@example.com"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full inline-flex items-center justify-center gap-2 bg-linear-to-br from-violet-400 to-violet-600 text-white font-semibold py-4 rounded-2xl transition shadow-lg shadow-violet-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner size="sm" />
                                                Sending...
                                            </>
                                        ) : (
                                            'Send OTP'
                                        )}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <div className="text-center">
                                <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-green-50 flex items-center justify-center">
                                    <Mail size={36} className="text-green-500" />
                                </div>
                                <h2 className="text-2xl font-bold text-slate-900 mb-2">Email Sent!</h2>
                                <p className="text-slate-500 mb-8">
                                    A 6-digit OTP has been sent to{' '}
                                    <span className="font-semibold text-slate-700">{email}</span>.
                                    Use it to reset your password.
                                </p>
                                <Link
                                    to={`/reset-password?email=${encodeURIComponent(email)}`}
                                    className="inline-flex items-center justify-center w-full bg-linear-to-br from-violet-400 to-violet-600 text-white font-semibold py-4 rounded-2xl transition shadow-lg shadow-violet-500/30"
                                >
                                    Reset Password →
                                </Link>
                            </div>
                        )}

                        <p className="text-center mt-8 text-sm text-slate-500">
                            Remember it?{' '}
                            <Link to="/login" className="text-violet-600 font-semibold hover:text-violet-700 transition">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="flex justify-start gap-6 text-xs text-slate-500">
                    <a className="hover:text-slate-900 transition cursor-pointer">Privacy Policy</a>
                    <a className="hover:text-slate-900 transition cursor-pointer">Terms</a>
                </div>
            </div>

            <div className="hidden lg:flex lg:w-1/2 xl:w-[55%] order-2">
                <AuthHero headline="Recover" subheadline="Your account securely" />
            </div>
        </div>
    );
};

export default ForgotPassword;
