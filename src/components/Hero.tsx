"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, ArrowRight } from 'lucide-react';

const Hero = () => {
    const whatsappUrl = "https://wa.me/94742409092?text=Hello%20Hashan%20e%20solution,%20I%20need%20a%20repair%20quote%20for...";

    return (
        <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
            {/* Background with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=2070"
                    alt="Electronics repair background"
                    fill
                    priority
                    className="object-cover transition-transform duration-1000 scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/90 via-primary-dark/70 to-transparent z-10" />
            </div>

            <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
                <div className="max-w-3xl">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-sm font-medium mb-6 border border-white/20 animate-fade-in-up">
                        <span className="flex h-2 w-2 rounded-full bg-whatsapp animate-pulse" />
                        Expert Repairs in Polonnaruwa
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold font-poppins mb-6 leading-tight animate-fade-in-up delay-100">
                        Your Trusted Partner for <span className="text-blue-400">Electronics</span> Repair
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed animate-fade-in-up delay-200">
                        Specializing in LED/LCD TV Chip-Level & Panel Repairs, Digital Meter Diagnostics, and Quality Electronic Spare Parts in Welikanda.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up delay-300">
                        <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 bg-whatsapp text-white px-8 py-5 rounded-2xl font-bold text-lg hover:bg-green-600 transition-all transform hover:scale-105 shadow-2xl shadow-green-500/30"
                        >
                            <MessageCircle size={24} />
                            Get a Free Quote on WhatsApp
                        </a>

                        <Link
                            href="#services"
                            className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md text-white border border-white/30 px-8 py-5 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all"
                        >
                            Our Services
                            <ArrowRight size={20} />
                        </Link>
                    </div>

                    <div className="mt-12 flex items-center gap-8 animate-fade-in-up delay-400">
                        <div className="flex -space-x-4">
                            {[1, 2, 3, 4].map((i) => (
                                <div key={i} className="w-12 h-12 rounded-full border-2 border-primary-dark bg-gray-300 flex items-center justify-center text-primary-dark font-bold text-xs">
                                    {/* Avatar Placeholder */}
                                    <div className="w-full h-full rounded-full bg-blue-100 flex items-center justify-center">
                                        User
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="text-sm">
                            <p className="font-bold">500+ Happy Customers</p>
                            <p className="text-gray-300">Across Polonnaruwa District</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Hero;
