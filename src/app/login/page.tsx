"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Zap, Shield, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
    const { user, signInWithGoogle } = useAuth();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    React.useEffect(() => {
        if (user) {
            router.push('/dashboard');
        }
    }, [user, router]);

    const handleGoogleLogin = async () => {
        // Start the promise immediately before ANY state updates
        // This is crucial for Safari and mobile browsers to not block the popup
        const loginPromise = signInWithGoogle();
        setIsLoading(true);

        try {
            await loginPromise;
            // router.push is handled by the useEffect watching 'user'
        } catch (error: any) {
            console.error("Login failed:", error);
            // Ignore popup-closed-by-user errors
            if (error.code !== 'auth/popup-closed-by-user') {
                toast.error(error?.message || "Login failed. Ensure your Firebase Auth setup is correct.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-[#131B2E] to-[#0A1628]" />
            <div className="absolute inset-0">
                <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-20 right-20 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px]" />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: 'linear-gradient(rgba(234,179,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.3) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="relative z-10 w-full max-w-md mx-4">
                {/* Back to home */}
                <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                {/* Login Card */}
                <div className="glass-morphism rounded-3xl p-8 shadow-2xl shadow-black/30 border border-white/10">
                    {/* Logo */}
                    <div className="flex justify-center mb-6">
                        <div className="relative w-16 h-16 overflow-hidden rounded-2xl bg-white/10 flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/20">
                            <Image
                                src="/images/logo.png"
                                alt="Hashan E Solution"
                                width={64}
                                height={64}
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-center text-white mb-2">
                        Welcome <span className="text-gradient">Back</span>
                    </h1>
                    <p className="text-gray-400 text-center mb-8">
                        Sign in to book appointments & track repairs
                    </p>

                    {/* Google Sign-in Button */}
                    <button
                        onClick={handleGoogleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white text-gray-800 px-6 py-4 rounded-2xl font-semibold text-lg hover:bg-gray-100 transition-all transform hover:scale-[1.02] shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                        {isLoading ? (
                            <div className="w-6 h-6 border-2 border-gray-300 border-t-primary rounded-full animate-spin" />
                        ) : (
                            <svg className="w-6 h-6" viewBox="0 0 24 24">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                        )}
                        {isLoading ? 'Signing in...' : 'Continue with Google'}
                    </button>



                    {/* Features */}
                    <div className="mt-8 grid grid-cols-3 gap-3">
                        <div className="text-center p-3 rounded-xl bg-white/5">
                            <Zap size={20} className="mx-auto text-primary mb-1" />
                            <p className="text-xs text-gray-400">Quick Booking</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-white/5">
                            <Clock size={20} className="mx-auto text-primary mb-1" />
                            <p className="text-xs text-gray-400">Track Status</p>
                        </div>
                        <div className="text-center p-3 rounded-xl bg-white/5">
                            <Shield size={20} className="mx-auto text-primary mb-1" />
                            <p className="text-xs text-gray-400">Secure Login</p>
                        </div>
                    </div>
                </div>

                <p className="text-center text-gray-500 text-sm mt-6">
                    By signing in, you agree to our{' '}
                    <Link href="/terms-of-service" className="text-primary hover:underline">Terms</Link>
                    {' '}&{' '}
                    <Link href="/privacy-policy" className="text-primary hover:underline">Privacy Policy</Link>
                </p>
            </div>
        </div>
    );
}
