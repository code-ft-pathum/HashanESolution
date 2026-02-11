import React from 'react';
import type { Metadata } from 'next';
import WorkGallery from '@/components/WorkGallery';

export const metadata: Metadata = {
    title: "Our Work & Repairs Gallery",
    description: "Watch our expert electronics repair videos. From LED TV panel bonding to digital meter restorations in Polonnaruwa. see our precision and quality work.",
    keywords: [
        "TV repair videos Sri Lanka",
        "Digital meter repair gallery",
        "Hashan e solution projects",
        "Electronics repair showcase Polonnaruwa",
        "LED TV panel repair demonstration",
        "Welikanda electronics workshop"
    ]
};

const WorkPage = () => {
    return (
        <div className="bg-primary-dark pt-32 pb-24 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-20">
                    <h1 className="text-primary font-bold tracking-wider uppercase text-sm mb-4">Portfolio</h1>
                    <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 font-poppins">Our Expertise in Action</h2>
                    <p className="max-w-2xl mx-auto text-gray-400 text-lg">
                        We don't just fix electronics; we restore them to factory standards. Browse our latest repair projects and see the precision we bring to every job.
                    </p>
                </div>

                <WorkGallery />
            </div>
        </div>
    );
};

export default WorkPage;
