"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navLinks = [
        { name: 'Home', href: '/' },
        { name: 'Services', href: '#services' },
        { name: 'Spare Parts', href: '#products' },
        { name: 'Contact', href: '#contact' },
    ];

    return (
        <nav className={cn(
            "fixed top-0 w-full z-50 transition-all duration-300",
            scrolled ? "glass-morphism py-2 shadow-md" : "bg-transparent py-4"
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <div className="flex-shrink-0 flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="relative w-10 h-10 overflow-hidden rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-110">
                                <Image
                                    src="/logo.svg"
                                    alt="Hashan e solution"
                                    width={40}
                                    height={40}
                                    className="object-contain"
                                />
                            </div>
                            <span className={cn(
                                "text-xl font-bold tracking-tight transition-colors",
                                scrolled ? "text-primary-dark" : "text-primary-dark"
                            )}>
                                Hashan <span className="text-primary">e solution</span>
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center space-x-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                className="text-gray-700 hover:text-primary font-medium transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        <a
                            href="tel:0742409092"
                            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-full font-semibold hover:bg-primary-dark transition-all transform hover:scale-105 shadow-lg shadow-blue-500/20"
                        >
                            <Phone size={18} />
                            <span>Call Now</span>
                        </a>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="text-gray-700 hover:text-primary transition-colors focus:outline-none"
                        >
                            {isOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Overlay */}
            <div className={cn(
                "md:hidden absolute top-full left-0 w-full glass-morphism shadow-xl transition-all duration-300 overflow-hidden",
                isOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
            )}>
                <div className="px-4 pt-2 pb-6 space-y-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="block px-3 py-4 text-base font-medium text-gray-700 hover:text-primary hover:bg-blue-50/50 rounded-lg transition-all"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <a
                        href="tel:0742409092"
                        className="flex items-center justify-center gap-2 bg-primary text-white px-3 py-4 rounded-lg font-bold mt-4"
                    >
                        <Phone size={20} />
                        <span>Call Now: 074 240 9092</span>
                    </a>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
