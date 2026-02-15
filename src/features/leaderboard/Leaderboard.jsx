import React from 'react';
import { useLeaderboard } from '../../context/LeaderboardContext';
import RankCard from './RankCard';
import LeaderboardTable from './LeaderboardTable';
import { motion } from 'framer-motion';
import { Trophy } from 'lucide-react';

import LeaderboardSkeleton from './LeaderboardSkeleton';

const Leaderboard = () => {
  const { rankedTeams, visibility, isLoading } = useLeaderboard();

  if (isLoading) {
    return <LeaderboardSkeleton />;
  }

  // Separate top 3 for cards
  const topThree = rankedTeams.slice(0, 3);

  return (
    <div className="space-y-8 relative pb-12">
      {/* Full Width Header Container - Breaking out of parent padding */}
      <div className="-mt-20 md:-mt-8 -mx-4 md:-mx-8 relative">
          
          {/* Dynamic Background with Wave */}
          {/* Dynamic Background with Wave */}
          <div className="absolute top-0 left-0 right-0 h-[500px] md:h-[600px] overflow-hidden -z-0">
              {/* Main Gradient Background - Dynamic Theme Variables */}
              <div 
                className="absolute inset-0 opacity-100 transition-colors duration-500"
                style={{ background: 'linear-gradient(to bottom right, var(--header-gradient-from), var(--header-gradient-via), var(--header-gradient-to))' }}
              />
              
              {/* Grain/Noise Texture Overlay */}
              <div className="absolute inset-0 opacity-30 pointer-events-none mix-blend-multiply" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
              
              {/* Decorative Blobs - Subtle Warmth */}
              <div className="absolute w-96 h-96 rounded-full bg-primary/20 blur-3xl -top-20 -right-20 mix-blend-screen" />
              <div className="absolute w-64 h-64 rounded-full bg-primary/10 blur-3xl top-40 -left-20 mix-blend-screen" />

              {/* The Wave SVG */}
              <svg 
                viewBox="0 0 1440 320" 
                className="absolute bottom-0 w-full h-auto text-bg-dark fill-current transition-colors duration-300"
                preserveAspectRatio="none"
              >
                <path d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
              </svg>
          </div>

          {/* Header Content - Dynamic Text for Theme */}
          <div className="relative z-10 p-4 md:p-8 pt-24 md:pt-12 text-center md:text-left max-w-7xl mx-auto">
            <h1 
                className="text-4xl md:text-6xl font-extrabold drop-shadow-sm mb-2 tracking-tight transition-colors duration-300"
                style={{ color: 'var(--header-text)' }}
            >
              Leaderboard
            </h1>
            <p 
                className="font-medium text-lg md:text-xl transition-colors duration-300"
                style={{ color: 'var(--header-text-dim)' }}
            >
                VITB GOT LATENT - Season 2
            </p>

            {/* Podium Section integrated into the header for nice overlap effect */}
            {visibility.masterToggle && topThree.length > 0 && (
                <div className="grid grid-cols-2 md:flex md:flex-row items-end justify-center gap-4 md:gap-8 mt-8 pb-12">
                     {/* 2nd Place */}
                     {topThree[1] && (
                         <div className="col-span-1 order-2 md:order-1 w-full md:w-auto transform md:translate-y-4">
                            <RankCard team={topThree[1]} rank={2} delay={0} />
                         </div>
                     )}

                     {/* 1st Place */}
                     {topThree[0] && (
                         <div className="col-span-2 md:col-span-1 order-1 md:order-2 w-full md:w-auto flex justify-center mb-6 md:mb-0 z-10 transform scale-110 md:scale-125 origin-bottom">
                             <div className="w-full max-w-[70%] md:max-w-none">
                                <RankCard team={topThree[0]} rank={1} delay={0} />
                             </div>
                         </div>
                     )}
                     
                     {/* 3rd Place */}
                     {topThree[2] && (
                         <div className="col-span-1 order-3 md:order-3 w-full md:w-auto transform md:translate-y-8">
                            <RankCard team={topThree[2]} rank={3} delay={0} />
                         </div>
                     )}
                </div>
            )}
          </div>
      </div>
      
      {/* Main Content Area */}
      {!visibility.masterToggle ? (
         <div className="flex flex-col items-center justify-center h-64 glass-panel rounded-2xl mx-auto max-w-2xl bg-bg-card/90 backdrop-blur border border-white/20 shadow-xl relative z-10">
             <Trophy size={48} className="text-text-muted mb-4 opacity-50" />
             <h2 className="text-2xl font-bold text-text-muted">Leaderboard Revealed Soon</h2>
             <p className="text-text-dim mt-2">Check back later for updates!</p>
         </div>
      ) : (
        <>
            {/* List Section - Now separated from podium */}
             <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0, duration: 0.2 }}
                className="bg-white/80 dark:bg-bg-card/40 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 dark:border-white/10 shadow-2xl md:mx-4 relative z-10 -mt-8"
             >
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-bold text-text-main flex items-center gap-3">
                        <span className="inline-block w-4 h-8 bg-primary rounded-full shadow-lg shadow-primary/30"></span>
                        All Participants
                    </h2>
                    <span className="text-sm font-bold text-text-main bg-bg-card px-4 py-2 rounded-full border border-border shadow-sm">
                        Total: {rankedTeams.length}
                    </span>
                </div>
                <LeaderboardTable teams={rankedTeams} visibility={visibility} />
            </motion.div>
        </>
      )}
    </div>
  );
};

export default Leaderboard;
