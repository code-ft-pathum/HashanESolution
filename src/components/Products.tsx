"use client";

import React from 'react';
import Image from 'next/image';
import { MessageCircle } from 'lucide-react';

const products = [
    {
        name: "TV Power IC",
        description: "High-quality genuine power ICs for multiple TV brands.",
        image: "https://images.unsplash.com/photo-1555664424-778a1e5e1b48?auto=format&fit=crop&q=80&w=800",
    },
    {
        name: "Digital Meter Display",
        description: "Replacement displays for various digital vehicle meters.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=800",
    },
    {
        name: "LCD Panel COF",
        description: "Essential components for professional panel bonding.",
        image: "https://images.unsplash.com/photo-1591405351990-4726e33df484?auto=format&fit=crop&q=80&w=800",
    },
    {
        name: "Universal Mainboard",
        description: "Versatile mainboards for LED/LCD TV conversions.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
    }
];

const Products = () => {
    return (
        <section id="products" className="py-24 bg-surface">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div className="max-w-2xl">
                        <h2 className="text-primary font-bold tracking-wider uppercase text-sm mb-4 text-left">Inventory</h2>
                        <h3 className="text-4xl md:text-5xl font-bold text-white font-poppins text-left">Quality Electronic Spare Parts</h3>
                    </div>
                    <p className="text-gray-400 max-w-md text-left md:text-right">
                        We stock a wide range of genuine and reliable spare parts for your electronic repair needs.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {products.map((product, index) => (
                        <div
                            key={index}
                            className="bg-white/5 rounded-3xl p-4 border border-white/10 shadow-sm hover:shadow-xl transition-all group overflow-hidden"
                        >
                            <div className="aspect-square relative rounded-2xl overflow-hidden mb-6">
                                <Image
                                    src={product.image}
                                    alt={product.name}
                                    fill
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                    className="object-cover transition-transform group-hover:scale-110"
                                />
                            </div>

                            <h4 className="text-lg font-bold text-white mb-2">{product.name}</h4>
                            <p className="text-sm text-gray-400 mb-6 line-clamp-2">{product.description}</p>

                            <a
                                href={`https://wa.me/94742409092?text=Hi,%20I'm%20interested%20in%20the%20${encodeURIComponent(product.name)}.`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-primary-dark border border-primary/20 font-bold text-sm hover:bg-whatsapp hover:text-white transition-all"
                            >
                                <MessageCircle size={16} />
                                Inquire
                            </a>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Products;
