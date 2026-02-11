"use client";

import React from 'react';
import { workGallery } from '@/data/work';
import { Play, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const WorkPreview = () => {
    // Take the first 3 items for the preview
    const previewItems = workGallery.filter(item => item.type === 'video').slice(0, 3);

    return (
        <section id="work-preview" className="py-24 bg-primary-dark">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-4">Portfolio</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-white font-poppins">Our Recent Work</h3>
                    </div>
                    <Link
                        href="/work"
                        className="flex items-center gap-2 text-primary font-bold group hover:underline underline-offset-8 transition-all"
                    >
                        View Full Gallery
                        <ArrowRight size={20} className="transition-transform group-hover:translate-x-2" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {previewItems.map((item) => (
                        <Link
                            key={item.id}
                            href="/work"
                            className="group relative bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 shadow-2xl"
                        >
                            <div className="aspect-video relative overflow-hidden">
                                <video
                                    src={item.url}
                                    className="w-full h-full object-cover"
                                    muted
                                    loop
                                    playsInline
                                    autoPlay
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-transparent to-transparent opacity-60" />

                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-md border border-primary/50 flex items-center justify-center text-primary">
                                        <Play fill="currentColor" size={20} />
                                    </div>
                                </div>

                                <div className="absolute bottom-4 left-6">
                                    <div className="text-xs text-primary font-black uppercase tracking-widest mb-1">{item.category}</div>
                                    <h4 className="text-lg font-bold text-white">{item.title}</h4>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default WorkPreview;
