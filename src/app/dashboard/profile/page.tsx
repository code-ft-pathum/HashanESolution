"use client";

import React from 'react';
import { useAuth } from '@/lib/auth-context';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Mail, User, Calendar, Shield } from 'lucide-react';

export default function ProfilePage() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {/* Header */}
            <div>
                <Link href="/dashboard" className="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-colors mb-4 group text-sm">
                    <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    Dashboard
                </Link>
                <h1 className="text-3xl font-bold  text-white">
                    My <span className="text-gradient">Profile</span>
                </h1>
            </div>

            {/* Profile Card */}
            <div className="glass-morphism rounded-3xl border border-white/10 overflow-hidden">
                {/* Banner */}
                <div className="h-32 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent relative">
                    <div className="absolute inset-0 bg-[url('/images/logo.png')] bg-no-repeat bg-right bg-contain opacity-5" />
                </div>

                {/* Avatar and Info */}
                <div className="px-8 pb-8 -mt-12">
                    <div className="flex items-end gap-4 mb-6">
                        {user.photoURL ? (
                            <Image
                                src={user.photoURL}
                                alt={user.displayName || 'User'}
                                width={96}
                                height={96}
                                className="rounded-2xl border-4 border-primary-dark shadow-xl shadow-primary/20"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center border-4 border-primary-dark">
                                <User size={40} className="text-primary" />
                            </div>
                        )}
                        <div className="pb-1">
                            <h2 className="text-2xl font-bold">{user.displayName}</h2>
                            <p className="text-gray-400">{user.email}</p>
                        </div>
                    </div>

                    {/* Info Grid */}
                    <div className="space-y-4">
                        <div className="bg-white/5 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <User size={18} className="text-primary" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Full Name</p>
                                    <p className="font-medium">{user.displayName || 'Not set'}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                                    <Mail size={18} className="text-blue-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Email Address</p>
                                    <p className="font-medium">{user.email}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-5">
                            <div className="flex items-center gap-3 mb-3">
                                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
                                    <Shield size={18} className="text-green-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">Authentication</p>
                                    <p className="font-medium">Google Account</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 rounded-2xl p-5">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
                                    <Calendar size={18} className="text-purple-400" />
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wide">User ID</p>
                                    <p className="font-medium text-sm font-mono text-gray-300">{user.uid}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
