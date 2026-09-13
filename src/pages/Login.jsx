import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Wallet, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import AuthHero from '../components/AuthHero.jsx';
import Spinner from '../components/Spinner.jsx';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await login(form.email, form.password);
            toast.success('Welcome back!');
            navigate('/');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white">
            {/* LEFT — Login Form */}
            <div className="flex-1 flex flex-col px-6 sm:px-10 lg:px-14 py-8 order-1">
                {/* Logo */}
                <div className="flex justify-start items-center gap-2">
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <Wallet size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-xl bg-gradient-to-r from-blue-700 to-teal-500 bg-clip-text text-transparent">
                        TrackingExpense
                    </span>
                </div>

                {/* Form Area */}
                <div className="flex-1 flex items-center justify-center py-10">
                    <div className="w-full max-w-md">
                        <p className="text-xs font-bold tracking-widest uppercase text-teal-600 mb-1">
                            Welcome Back 👋
                        </p>
                        <h2 className="text-4xl font-bold text-slate-900 tracking-tight mb-2">
                            Sign In
                        </h2>
                        <p className="text-slate-500 mb-10">
                            Your money,Your control,Your future
                        </p>

                        <form onSubmit={onSubmit} className="space-y-5">
                            {/* Email */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-teal-500 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none transition"
                                    placeholder="you@example.com"
                                />
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                                    Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-teal-500 rounded-2xl px-5 py-4 pr-12 text-slate-900 text-sm focus:outline-none transition"
                                        placeholder="••••••••"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((v) => !v)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-teal-600 transition"
                                        tabIndex={-1}
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>
                                <div className="flex justify-end">
                                    <Link
                                        to="/forgot-password"
                                        className="text-xs text-teal-600 font-semibold hover:text-blue-700 transition"
                                    >
                                        Forgot Password?
                                    </Link>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-teal-500 hover:from-teal-500 hover:to-blue-600 active:scale-[0.98] text-white font-semibold py-4 rounded-2xl transition-all shadow-lg shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <>
                                        <Spinner size="sm" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In to Dashboard'
                                )}
                            </button>
                        </form>

                        <p className="text-center mt-8 text-sm text-slate-500">
                            No Account Yet?{' '}
                            <Link
                                to="/register"
                                className="text-teal-600 font-semibold hover:text-blue-700 transition"
                            >
                                Register Now
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer links */}
                <div className="flex justify-start gap-6 text-xs text-slate-500">
                    <a className="hover:text-slate-900 transition cursor-pointer">Privacy Policy</a>
                    <a className="hover:text-slate-900 transition cursor-pointer">Terms</a>
                    <a className="hover:text-slate-900 transition cursor-pointer">FAQ</a>
                </div>
            </div>

            

        </div>
    );
};

export default Login;
