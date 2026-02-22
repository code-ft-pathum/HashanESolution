"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import WhatsAppButton from '@/components/WhatsAppButton';
import { AuthProvider } from '@/lib/auth-context';

const HIDE_SHELL_ROUTES = ['/dashboard', '/admin', '/login'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const shouldHideShell = HIDE_SHELL_ROUTES.some(route => pathname.startsWith(route));

    return (
        <AuthProvider>
            {shouldHideShell ? (
                <>{children}</>
            ) : (
                <>
                    <Navbar />
                    <main className="min-h-screen">
                        {children}
                    </main>
                    <Footer />
                    <WhatsAppButton />
                </>
            )}
        </AuthProvider>
    );
}
