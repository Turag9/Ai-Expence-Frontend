import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Wallet, Eye, EyeOff, KeyRound } from 'lucide-react';
import AuthHero from '../components/AuthHero.jsx';
import Spinner from '../components/Spinner.jsx';
import api from '../lib/axios.js';

const ResetPassword = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const emailFromUrl = searchParams.get('email') || '';

    const [step, setStep] = useState(1); // 1: enter OTP, 2: enter new password
    const [email, setEmail] = useState(emailFromUrl);
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);

    // Step 1: Verify OTP
    const onVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/auth/verify-otp', { email, otp });
            toast.success('OTP verified! Set your new password.');
            setStep(2);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Invalid or expired OTP');
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Reset Password
    const onResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return toast.error('Passwords do not match');
        }
        if (newPassword.length < 6) {
            return toast.error('Password must be at least 6 characters');
        }
        setLoading(true);
        try {
            await api.post('/auth/reset-password', { email, otp, newPassword });
            toast.success('Password changed successfully!');
            navigate('/login');
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
                    <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-blue-600 to-teal-500 flex items-center justify-center">
                        <Wallet size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-xl text-slate-900">TrackingExpense</span>
                </div>

                <div className="flex-1 flex items-center justify-center py-10">
                    <div className="w-full max-w-md">
                        <div className="mb-6 w-14 h-14 rounded-2xl bg-teal-50 flex items-center justify-center">
                            <KeyRound size={24} className="text-teal-600" />
                        </div>

                        {/* Step indicator */}
                        <div className="flex items-center gap-3 mb-8">
                            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition ${step >= 1 ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
                            <div className={`flex-1 h-0.5 rounded transition ${step >= 2 ? 'bg-blue-700' : 'bg-slate-200'}`} />
                            <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold transition ${step >= 2 ? 'bg-blue-700 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
                        </div>

                        {step === 1 ? (
                            <>
                                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">Verify OTP</h2>
                                <p className="text-slate-500 mb-8">Enter the 6-digit OTP sent to your email.</p>

                                <form onSubmit={onVerifyOtp} className="space-y-5">
                                    {!emailFromUrl && (
                                        <div className="space-y-2">
                                            <label className="text-sm font-semibold text-slate-700">Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={email}
                                                onChange={(e) => setEmail(e.target.value)}
                                                className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-teal-500 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none transition"
                                                placeholder="you@example.com"
                                            />
                                        </div>
                                    )}

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">OTP Code</label>
                                        <input
                                            type="text"
                                            required
                                            maxLength={6}
                                            value={otp}
                                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                                            className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-teal-500 rounded-2xl px-5 py-4 text-slate-900 text-sm focus:outline-none transition tracking-[0.4em] text-center text-xl font-bold"
                                            placeholder="● ● ● ● ● ●"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading || otp.length !== 6}
                                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-teal-500 text-white font-semibold py-4 rounded-2xl transition shadow-lg shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner size="sm" />
                                                Verifying...
                                            </>
                                        ) : (
                                            'Verify OTP'
                                        )}
                                    </button>
                                </form>
                            </>
                        ) : (
                            <>
                                <h2 className="text-3xl font-bold text-slate-900 tracking-tight mb-2">New Password</h2>
                                <p className="text-slate-500 mb-8">Create a strong new password.</p>

                                <form onSubmit={onResetPassword} className="space-y-5">
                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">New Password</label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                required
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-teal-500 rounded-2xl px-5 py-4 pr-12 text-slate-900 text-sm focus:outline-none transition"
                                                placeholder="At least 6 characters"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword((v) => !v)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                                tabIndex={-1}
                                            >
                                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-semibold text-slate-700">Confirm Password</label>
                                        <div className="relative">
                                            <input
                                                type={showConfirm ? 'text' : 'password'}
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                className="w-full bg-slate-100/80 hover:bg-slate-100 focus:bg-white border-2 border-transparent focus:border-teal-500 rounded-2xl px-5 py-4 pr-12 text-slate-900 text-sm focus:outline-none transition"
                                                placeholder="Repeat password"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowConfirm((v) => !v)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
                                                tabIndex={-1}
                                            >
                                                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                                            </button>
                                        </div>
                                        {confirmPassword && newPassword !== confirmPassword && (
                                            <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-br from-blue-600 to-teal-500 text-white font-semibold py-4 rounded-2xl transition shadow-lg shadow-blue-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <Spinner size="sm" />
                                                Updating...
                                            </>
                                        ) : (
                                            'Change Password'
                                        )}
                                    </button>
                                </form>
                            </>
                        )}

                        <p className="text-center mt-8 text-sm text-slate-500">
                            <Link to="/forgot-password" className="text-teal-600 font-semibold hover:text-blue-700 transition">
                                ← Resend OTP
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
                <AuthHero headline="Secure" subheadline="Reset your password" />
            </div>
        </div>
    );
};

export default ResetPassword;
