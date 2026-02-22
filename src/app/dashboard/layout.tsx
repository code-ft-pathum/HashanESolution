"use client";

import React, { useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Home, LogOut, User, Clock } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-primary-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: Home },
        { name: 'Book Appointment', href: '/dashboard/book', icon: Calendar },
        { name: 'My Appointments', href: '/dashboard/appointments', icon: Clock },
        { name: 'Profile', href: '/dashboard/profile', icon: User },
    ];

    return (
        <div className="min-h-screen bg-primary-dark">
            {/* Top Navigation */}
            <nav className="glass-morphism sticky top-0 z-50 border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <Link href="/" className="flex items-center gap-2">
                                <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-white/10 flex items-center justify-center">
                                    <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="object-cover" />
                                </div>
                                <span className="text-lg font-bold text-white hidden sm:block">
                                    Hashan <span className="text-primary">E Solution</span>
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Nav */}
                        <div className="hidden md:flex items-center gap-1">
                            {navItems.map(item => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${pathname === item.href
                                        ? 'bg-primary/10 text-primary border border-primary/20'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <item.icon size={16} />
                                    {item.name}
                                </Link>
                            ))}
                        </div>

                        {/* User menu */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                {user.photoURL && (
                                    <Image
                                        src={user.photoURL}
                                        alt={user.displayName || 'User'}
                                        width={36}
                                        height={36}
                                        className="rounded-full border-2 border-primary/30"
                                    />
                                )}
                                <span className="text-sm font-medium hidden sm:block">{user.displayName?.split(' ')[0]}</span>
                            </div>
                            <button
                                onClick={async () => { await logout(); router.push('/'); }}
                                className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Nav */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 glass-morphism border-t border-white/5">
                <div className="flex justify-around items-center py-2">
                    {navItems.map(item => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex flex-col items-center gap-1 px-3 py-2 rounded-xl text-xs transition-all ${pathname === item.href
                                ? 'text-primary'
                                : 'text-gray-500'
                                }`}
                        >
                            <item.icon size={20} />
                            <span>{item.name.split(' ').pop()}</span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
                {children}
            </main>
        </div>
    );
}
