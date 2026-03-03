"use client";

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    LayoutDashboard, Calendar, Package, DollarSign, LogOut,
    Shield, ChevronLeft, ChevronRight, Menu, X
} from 'lucide-react';
import ChatBot from '@/components/ChatBot';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    useEffect(() => {
        // Skip auth check for login page
        if (pathname === '/admin/login') {
            setLoading(false);
            setIsAdmin(true);
            return;
        }

        const authData = localStorage.getItem('adminAuth');
        if (authData) {
            try {
                const parsed = JSON.parse(authData);
                if (parsed.isAdmin && parsed.username === 'hashanesolution') {
                    setIsAdmin(true);
                } else {
                    router.push('/admin/login');
                }
            } catch {
                router.push('/admin/login');
            }
        } else {
            router.push('/admin/login');
        }
        setLoading(false);
    }, [pathname, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-primary-dark flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Verifying admin access...</p>
                </div>
            </div>
        );
    }

    // Don't wrap login page with admin UI
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    if (!isAdmin) return null;

    const handleLogout = () => {
        localStorage.removeItem('adminAuth');
        router.push('/admin/login');
    };

    const navItems = [
        { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
        { name: 'Appointments', href: '/admin/appointments', icon: Calendar },
        { name: 'Inventory', href: '/admin/inventory', icon: Package },
        { name: 'Finances', href: '/admin/finances', icon: DollarSign },
    ];

    return (
        <div className="min-h-screen bg-primary-dark flex">
            {/* Mobile Overlay */}
            {mobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 md:hidden"
                    onClick={() => setMobileSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed md:sticky top-0 left-0 h-screen z-50 glass-morphism border-r border-white/5 flex flex-col transition-all duration-300 ${sidebarCollapsed ? 'w-20' : 'w-64'
                } ${mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
                {/* Logo */}
                <div className="p-4 flex items-center gap-3 border-b border-white/5">
                    <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                        <Image src="/images/logo.png" alt="Logo" width={40} height={40} className="object-cover" />
                    </div>
                    {!sidebarCollapsed && (
                        <div className="overflow-hidden">
                            <h2 className="font-bold text-sm whitespace-nowrap">Hashan E Solution</h2>
                            <div className="flex items-center gap-1">
                                <Shield size={10} className="text-red-400" />
                                <span className="text-[10px] text-red-400 font-medium">ADMIN</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-3 space-y-1">
                    {navItems.map(item => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setMobileSidebarOpen(false)}
                                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                                title={sidebarCollapsed ? item.name : undefined}
                            >
                                <item.icon size={20} className="flex-shrink-0" />
                                {!sidebarCollapsed && <span>{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Collapse Button & Logout */}
                <div className="p-3 border-t border-white/5 space-y-2">
                    <button
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                        className="hidden md:flex w-full items-center gap-3 px-3 py-2 rounded-xl text-gray-500 hover:text-white hover:bg-white/5 transition-all text-sm"
                    >
                        {sidebarCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        {!sidebarCollapsed && <span>Collapse</span>}
                    </button>
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm"
                    >
                        <LogOut size={18} className="flex-shrink-0" />
                        {!sidebarCollapsed && <span>Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen">
                {/* Top Bar (Mobile) */}
                <header className="md:hidden glass-morphism sticky top-0 z-30 border-b border-white/5 px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                        className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                    >
                        {mobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                    <div className="flex items-center gap-2">
                        <Shield size={14} className="text-red-400" />
                        <span className="text-sm font-bold">Admin Panel</span>
                    </div>
                    <div className="w-10" />
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 sm:p-6 lg:p-8">
                    {children}
                </main>
            </div>

            {/* Admin AI Chat Agent */}
            <ChatBot isAdmin={true} />
        </div>
    );
}
