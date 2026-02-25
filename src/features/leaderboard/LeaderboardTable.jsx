import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { ArrowUpDown, Crown } from 'lucide-react';
import { useLeaderboard } from '../../context/LeaderboardContext';

const LeaderboardTable = ({ teams, visibility }) => {
  const { setSelectedTeam } = useLeaderboard();
  const [sortConfig, setSortConfig] = useState({ key: 'rank', direction: 'asc' });

  const handleSort = (key) => {
    let direction = 'desc';
    if (sortConfig.key === key && sortConfig.direction === 'desc') {
      direction = 'asc';
    }
    setSortConfig({ key, direction });
  };

  const sortedTeams = useMemo(() => {
    let sortableTeams = [...teams];
    if (sortConfig.key !== 'rank') {
      sortableTeams.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    } else {
        // Reset to original rank if sorting by rank (which is default)
        sortableTeams.sort((a, b) => a.rank - b.rank);
    }
    return sortableTeams;
  }, [teams, sortConfig]);

  const SortIcon = ({ column }) => {
      if (sortConfig.key !== column) return <ArrowUpDown size={14} className="opacity-30" />;
      return <ArrowUpDown size={14} className={sortConfig.direction === 'asc' ? "opacity-100 rotate-180" : "opacity-100"} />;
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="text-xs text-text-muted uppercase border-b border-border">
            <th className="p-4 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('rank')}>
                <div className="flex items-center gap-1">Rank <SortIcon column="rank" /></div>
            </th>
            <th className="p-4 cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">Team <SortIcon column="name" /></div>
            </th>
            {visibility.iceCream && (
                <th className="p-4 text-center cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('iceCreamScore')}>
                   <div className="flex items-center justify-center gap-1">Ice Cream <SortIcon column="iceCreamScore" /></div>
                </th>
            )}
            {visibility.dart && (
                <th className="p-4 text-center cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('dartScore')}>
                   <div className="flex items-center justify-center gap-1">Dart <SortIcon column="dartScore" /></div>
                </th>
            )}
            {visibility.balloon && (
                <th className="p-4 text-center cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('balloonScore')}>
                   <div className="flex items-center justify-center gap-1">Balloon <SortIcon column="balloonScore" /></div>
                </th>
            )}
            {visibility.facePainting && (
                <th className="p-4 text-center cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('facePaintingScore')}>
                   <div className="flex items-center justify-center gap-1">Face Painting <SortIcon column="facePaintingScore" /></div>
                </th>
            )}
            {visibility.total && (
                <th className="p-4 text-right cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('finalPercent')}>
                   <div className="flex items-center justify-end gap-1">Overall % <SortIcon column="finalPercent" /></div>
                </th>
            )}
          </tr>
        </thead>
        <tbody>
            <AnimatePresence>
          {sortedTeams.map((team, index) => (
            <motion.tr
              key={team.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
              className={cn(
                  "border-b border-border last:border-0 hover:bg-bg-card-hover/50 transition-colors group",
                  team.rank === 1 ? "bg-yellow-500/5 hover:bg-yellow-500/10" : 
                  team.rank === 2 ? "bg-gray-400/5 hover:bg-gray-400/10" :
                  team.rank === 3 ? "bg-orange-500/5 hover:bg-orange-500/10" : ""
              )}
            >
              <td className="p-4">
                  <div className={cn(
                     "w-8 h-8 flex items-center justify-center rounded-full font-bold text-sm",
                     team.rank === 1 ? "bg-yellow-500 text-bg-dark" :
                     team.rank === 2 ? "bg-gray-300 text-bg-dark" :
                     team.rank === 3 ? "bg-orange-500 text-bg-dark" : "text-text-muted bg-bg-card border border-border"
                  )}>
                      {team.rank}
                  </div>
              </td>
              <td className="p-4">
                  <div 
                    className={cn(
                        "flex items-center gap-3",
                        visibility.members && "cursor-pointer group"
                    )}
                    onClick={() => visibility.members && setSelectedTeam(team)}
                  >
                      <img src={team.avatar} alt={team.name} className="w-10 h-10 rounded-full border border-border object-cover bg-bg-card transition-transform group-hover:scale-110" />
                      <span className="font-bold text-text-main group-hover:text-primary transition-colors">{team.name}</span>
                  </div>
              </td>
              
              {visibility.iceCream && (
                  <td className="p-4 text-center">
                      {team.gamesPlaying === 3 ? (
                          <span className="text-text-dim/30 italic text-xs">Excluded</span>
                      ) : (
                          <span className={cn(
                              "font-mono font-medium",
                              team.iceRank === 1 && team.iceCreamScore > 0 && "text-yellow-500 font-bold drop-shadow-sm scale-110 inline-block"
                          )}>
                              {team.iceCreamScore}
                              {team.iceRank === 1 && team.iceCreamScore > 0 && <Crown size={12} className="inline ml-1 -mt-1 text-yellow-500" />}
                          </span>
                      )}
                  </td>
              )}
               {visibility.dart && (
                  <td className="p-4 text-center">
                       <span className={cn(
                          "font-mono font-medium",
                          team.dartRank === 1 && team.dartScore > 0 && "text-yellow-500 font-bold drop-shadow-sm scale-110 inline-block"
                      )}>
                          {team.dartScore}
                          {team.dartRank === 1 && team.dartScore > 0 && <Crown size={12} className="inline ml-1 -mt-1 text-yellow-500" />}
                      </span>
                  </td>
              )}
               {visibility.balloon && (
                  <td className="p-4 text-center">
                       <span className={cn(
                          "font-mono font-medium",
                          team.balloonRank === 1 && team.balloonScore > 0 && "text-yellow-500 font-bold drop-shadow-sm scale-110 inline-block"
                      )}>
                          {team.balloonScore}
                          {team.balloonRank === 1 && team.balloonScore > 0 && <Crown size={12} className="inline ml-1 -mt-1 text-yellow-500" />}
                      </span>
                  </td>
              )}
               {visibility.facePainting && (
                  <td className="p-4 text-center">
                       <span className={cn(
                          "font-mono font-medium",
                          team.faceRank === 1 && team.facePaintingScore > 0 && "text-yellow-500 font-bold drop-shadow-sm scale-110 inline-block"
                      )}>
                          {team.facePaintingScore}
                          {team.faceRank === 1 && team.facePaintingScore > 0 && <Crown size={12} className="inline ml-1 -mt-1 text-yellow-500" />}
                      </span>
                  </td>
              )}
              
               {visibility.total && (
                  <td className="p-4 text-right">
                      <span className="font-bold text-xl text-primary">{team.finalPercent}%</span>
                  </td>
              )}
            </motion.tr>
          ))}
          </AnimatePresence>
        </tbody>
      </table>
      
      {teams.length === 0 && (
          <div className="p-12 text-center text-text-muted bg-bg-card/50 rounded-xl border border-border backdrop-blur-sm mt-4">
             <p className="text-lg">No teams found.</p>
          </div>
      )}
    </div>
  );
};

export default LeaderboardTable;
