import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const LeaderboardTable = ({ teams, visibility }) => {
  return (
    <div className="w-full">
      {/* Unified Card View (1 column mobile, 3 columns desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {teams.map((team, index) => (
          <motion.div
            key={team.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="glass-panel border border-border rounded-xl p-4 flex flex-col gap-4 shadow-sm hover:bg-bg-card-hover/50 transition-colors group relative overflow-hidden"
          >
             {/* Gradient Overlay for high ranks */}
             {team.rank <= 3 && (
                <div className={cn(
                    "absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl opacity-10 rounded-bl-full pointer-events-none",
                    team.rank === 1 ? "from-yellow-500 to-transparent" :
                    team.rank === 2 ? "from-gray-400 to-transparent" :
                    "from-orange-500 to-transparent"
                )} />
             )}

            {/* Header: Rank + Avatar + Name */}
            <div className="flex items-center gap-3 relative z-10">
                 <div className={cn(
                   "flex items-center justify-center w-10 h-10 rounded-full font-bold text-lg border border-border transition-colors shadow-sm",
                   team.rank === 1 ? "bg-yellow-500 text-bg-dark border-yellow-500" :
                   team.rank === 2 ? "bg-gray-300 text-bg-dark border-gray-300" :
                   team.rank === 3 ? "bg-orange-500 text-bg-dark border-orange-500" : 
                   "bg-bg-card-hover text-text-muted"
                 )}>
                    #{team.rank}
                 </div>
                 <img src={team.avatar} alt={team.name} className="w-12 h-12 rounded-full border border-border object-cover bg-bg-card" />
                 <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg text-text-main truncate group-hover:text-primary transition-colors">{team.name}</h3>
                    <p className="text-xs text-text-muted">Rank {team.rank}</p>
                 </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-4 gap-2 border-t border-border pt-3">
               {visibility.iceCream && (
                   <div className="text-center">
                       <div className="text-lg font-bold text-text-main">{team.iceCreamScore}</div>
                       <div className="text-[10px] text-text-muted uppercase tracking-wider truncate">Ice</div>
                   </div>
               )}
               {visibility.dart && (
                   <div className="text-center">
                       <div className="text-lg font-bold text-text-main">{team.dartScore}</div>
                       <div className="text-[10px] text-text-muted uppercase tracking-wider truncate">Dart</div>
                   </div>
               )}
               {visibility.balloon && (
                   <div className="text-center">
                       <div className="text-lg font-bold text-text-main">{team.balloonScore}</div>
                       <div className="text-[10px] text-text-muted uppercase tracking-wider truncate">Bal</div>
                   </div>
               )}
               {visibility.cupStack && (
                   <div className="text-center">
                       <div className="text-lg font-bold text-text-main">{team.cupStackScore}</div>
                       <div className="text-[10px] text-text-muted uppercase tracking-wider truncate">Cup</div>
                   </div>
               )}
            </div>

            {/* Total Score Footer */}
            {visibility.total && (
              <div className="flex items-center justify-between border-t border-border pt-3 mt-auto">
                 <span className="text-xs text-text-muted uppercase font-medium">Total Score</span>
                 <div className="text-2xl font-bold text-primary">{team.totalScore}</div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
      
      {teams.length === 0 && (
          <div className="p-12 text-center text-text-muted bg-bg-card/50 rounded-xl border border-border backdrop-blur-sm">
             <p className="text-lg">No teams found.</p>
          </div>
      )}
    </div>
  );
};

export default LeaderboardTable;
