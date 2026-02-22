"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Shield, Eye, EyeOff, Lock, User } from 'lucide-react';

const ADMIN_USERNAME = 'hashanesolution';
const ADMIN_PASSWORD = 'hashanEsolution@123';

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate a slight delay for UX
        await new Promise(resolve => setTimeout(resolve, 800));

        if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
            // Store admin session
            localStorage.setItem('adminAuth', JSON.stringify({
                isAdmin: true,
                username: ADMIN_USERNAME,
                loginTime: new Date().toISOString(),
            }));
            router.push('/admin');
        } else {
            setError('Invalid username or password');
        }
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
            {/* Animated background */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-dark via-[#131B2E] to-[#0A1628]" />
            <div className="absolute inset-0">
                <div className="absolute top-10 right-10 w-72 h-72 bg-red-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>

            {/* Grid pattern overlay */}
            <div className="absolute inset-0 opacity-5"
                style={{
                    backgroundImage: 'linear-gradient(rgba(234,179,8,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(234,179,8,0.3) 1px, transparent 1px)',
                    backgroundSize: '60px 60px'
                }}
            />

            <div className="relative z-10 w-full max-w-md mx-4">
                {/* Back to login */}
                <Link href="/login" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-8 group">
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Back to User Login
                </Link>

                {/* Login Card */}
                <div className="glass-morphism rounded-3xl p-8 shadow-2xl shadow-black/30 border border-white/10">
                    {/* Logo & Badge */}
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="relative w-16 h-16 overflow-hidden rounded-2xl bg-white/10 flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/20">
                                <Image
                                    src="/images/logo.png"
                                    alt="Hashan E Solution"
                                    width={64}
                                    height={64}
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-1 -right-1 bg-red-500 rounded-full p-1">
                                <Shield size={12} className="text-white" />
                            </div>
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold text-center mb-2">
                        Admin <span className="text-gradient">Portal</span>
                    </h1>
                    <p className="text-gray-400 text-center mb-8">
                        Authorized personnel only
                    </p>

                    {/* Error message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-center text-sm animate-fade-in-up">
                            {error}
                        </div>
                    )}

                    {/* Login Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Username</label>
                            <div className="relative">
                                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter admin username"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-4 text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                            <div className="relative">
                                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter admin password"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-12 py-4 text-white placeholder-gray-500 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-gradient-to-r from-primary to-yellow-400 text-primary-dark px-6 py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-primary/30 transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-6"
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <div className="w-5 h-5 border-2 border-primary-dark/30 border-t-primary-dark rounded-full animate-spin" />
                                    Authenticating...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <Shield size={20} />
                                    Access Dashboard
                                </div>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
