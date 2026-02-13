"use client";

import React from 'react';

const brands = [
    "Samsung", "LG", "Sony", "Panasonic", "TCL", "Singer", "Abans",
    "Pulsar", "Apache", "Yamaha", "Hero", "Bajaj", "TVS"
];

const TrustedBrands = () => {
    return (
        <div className="bg-surface py-12 border-y border-white/5">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <p className="text-center text-gray-500 text-sm font-bold uppercase tracking-[0.3em] mb-8">Specialized Repair for Major Brands</p>
                <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
                    {brands.map((brand) => (
                        <span key={brand} className="text-xl md:text-3xl font-black text-white font-poppins ">{brand}</span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrustedBrands;
