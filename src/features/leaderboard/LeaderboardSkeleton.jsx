import React from 'react';
import { Skeleton } from '../../components/ui/Skeleton';

const LeaderboardSkeleton = () => {
  return (
    <div className="space-y-8 relative pb-12">
      {/* Full Width Header Container Skeleton */}
      <div className="-mt-20 md:-mt-8 -mx-4 md:-mx-8 relative">
          <div className="absolute top-0 left-0 right-0 h-[500px] md:h-[600px] overflow-hidden -z-0 bg-gray-200 dark:bg-bg-card/50" />
          
          <div className="relative z-10 p-4 md:p-8 pt-24 md:pt-12 text-center md:text-left max-w-7xl mx-auto">
             {/* Title Skeletons */}
            <Skeleton className="h-12 w-64 md:w-96 mb-4 mx-auto md:mx-0 bg-gray-400 dark:bg-white/20" />
            <Skeleton className="h-6 w-48 md:w-64 mx-auto md:mx-0 bg-gray-400 dark:bg-white/10" />

            {/* Podium Skeleton */}
            <div className="grid grid-cols-2 md:flex md:flex-row items-end justify-center gap-4 md:gap-8 mt-12 pb-12">
                 {/* 2nd Place */}
                 <div className="col-span-1 order-2 md:order-1 w-full md:w-64 h-80">
                     <Skeleton className="w-full h-full rounded-2xl bg-black/5 dark:bg-white/5" />
                 </div>

                 {/* 1st Place */}
                 <div className="col-span-2 md:col-span-1 order-1 md:order-2 w-full md:w-72 h-96 flex justify-center mb-6 md:mb-0 z-10 transform -translate-y-4">
                      <Skeleton className="w-full h-full rounded-2xl bg-black/10 dark:bg-white/10" />
                 </div>
                 
                 {/* 3rd Place */}
                 <div className="col-span-1 order-3 md:order-3 w-full md:w-64 h-80">
                     <Skeleton className="w-full h-full rounded-2xl bg-black/5 dark:bg-white/5" />
                 </div>
            </div>
          </div>
      </div>
      
      {/* List Skeleton */}
      <div className="bg-white/80 dark:bg-bg-card/40 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-gray-200 dark:border-white/10 shadow-2xl md:mx-4 relative z-10 -mt-8 space-y-4">
        {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-4 border border-black/5 dark:border-white/5 rounded-xl">
                <Skeleton className="w-10 h-10 rounded-full" />
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                </div>
                <div className="hidden md:flex gap-8">
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                    <Skeleton className="h-8 w-16" />
                </div>
            </div>
        ))}
      </div>
    </div>
  );
};

export default LeaderboardSkeleton;
