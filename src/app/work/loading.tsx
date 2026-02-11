import React from 'react';

const WorkLoading = () => {
    return (
        <div className="bg-primary-dark pt-32 pb-24 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Skeleton */}
                <div className="text-center mb-20 space-y-4">
                    <div className="h-4 w-32 bg-white/5 mx-auto rounded animate-pulse" />
                    <div className="h-12 w-3/4 md:w-1/2 bg-white/5 mx-auto rounded animate-pulse" />
                    <div className="h-6 w-full md:w-2/3 bg-white/5 mx-auto rounded animate-pulse" />
                </div>

                {/* Filter Skeleton */}
                <div className="flex flex-wrap gap-4 justify-center mb-12">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-12 w-32 bg-white/5 rounded-2xl animate-pulse" />
                    ))}
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                        <div key={i} className="bg-white/5 rounded-3xl overflow-hidden border border-white/10 h-80 animate-pulse">
                            <div className="aspect-video bg-white/5" />
                            <div className="p-6 space-y-4">
                                <div className="h-6 w-3/4 bg-white/5 rounded" />
                                <div className="h-4 w-full bg-white/5 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default WorkLoading;
