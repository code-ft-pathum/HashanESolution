"use client";

import React, { useState } from 'react';
import { workGallery, GalleryItem } from '@/data/work';
import { Play, X } from 'lucide-react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const VideoCard = ({ item, onClick }: { item: GalleryItem, onClick: () => void }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="group relative bg-white/5 rounded-3xl overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-500 hover:-translate-y-2 shadow-2xl cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <div className="aspect-video relative overflow-hidden">
                {item.type === 'video' ? (
                    <video
                        src={item.url}
                        className="w-full h-full object-cover"
                        muted
                        loop
                        playsInline
                        autoPlay={isHovered}
                    />
                ) : (
                    <div className="w-full h-full relative">
                        <Image
                            src={item.url}
                            alt={item.title}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-primary-dark/90 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="w-16 h-16 rounded-full bg-primary/20 backdrop-blur-md border border-primary/50 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        {item.type === 'video' ? <Play fill="currentColor" size={24} /> : <X className="rotate-45" size={24} />}
                    </div>
                </div>

                <div className="absolute top-4 right-4 bg-primary text-primary-dark text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider">
                    {item.category}
                </div>
            </div>

            <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{item.description}</p>
            </div>
        </div>
    );
};

const WorkGallery = () => {
    const [filter, setFilter] = useState('All');
    const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
    const categories = ['All', 'TV Repair', 'Meter Repair', 'Electronics'];

    const filteredItems = filter === 'All'
        ? workGallery
        : workGallery.filter(item => item.category === filter || (filter === 'Electronics' && item.category === 'Home Appliances'));

    return (
        <div className="space-y-12">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-4 justify-center">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={cn(
                            "px-8 py-3 rounded-2xl font-bold text-sm transition-all duration-300 border border-white/10",
                            filter === cat
                                ? "bg-primary text-primary-dark shadow-xl shadow-primary/20"
                                : "bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white"
                        )}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredItems.map((item) => (
                    <VideoCard
                        key={item.id}
                        item={item}
                        onClick={() => setSelectedItem(item)}
                    />
                ))}
            </div>

            {/* Modal */}
            {selectedItem && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-300">
                    <div
                        className="absolute inset-0 bg-primary-dark/95 backdrop-blur-xl"
                        onClick={() => setSelectedItem(null)}
                    />

                    <div className="relative w-full max-w-5xl bg-surface rounded-[2.5rem] overflow-hidden border border-white/10 animate-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setSelectedItem(null)}
                            className="absolute top-6 right-6 z-10 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-primary-dark transition-all"
                        >
                            <X size={24} />
                        </button>

                        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
                            <div className="lg:w-2/3 bg-black flex items-center justify-center aspect-video lg:aspect-auto">
                                {selectedItem.type === 'video' ? (
                                    <video
                                        src={selectedItem.url}
                                        controls
                                        autoPlay
                                        className="w-full h-full object-contain"
                                    />
                                ) : (
                                    <div className="relative w-full h-full min-h-[400px]">
                                        <Image
                                            src={selectedItem.url}
                                            alt={selectedItem.title}
                                            fill
                                            className="object-contain"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="lg:w-1/3 p-8 md:p-12 overflow-y-auto">
                                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest mb-6">
                                    {selectedItem.category}
                                </div>
                                <h2 className="text-3xl font-bold text-white mb-6 leading-tight">{selectedItem.title}</h2>
                                <p className="text-gray-400 text-lg leading-relaxed mb-8">{selectedItem.description}</p>

                                <div className="space-y-4 pt-8 border-t border-white/10">
                                    <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">Share Project</p>
                                    <div className="flex gap-4">
                                        <a href={`https://wa.me/94742409092?text=I%20saw%20your%20work%20on%20${encodeURIComponent(selectedItem.title)}%20and%20I'm%20interested...`} target="_blank" className="flex-1 bg-whatsapp text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                                            Inquire on WhatsApp
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WorkGallery;
