import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';
import { ArrowUpDown, Crown } from 'lucide-react';

const LeaderboardTable = ({ teams, visibility, maxScores }) => {
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

  const isHighScore = (score, category) => {
      return score > 0 && maxScores && score === maxScores[category];
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
            {visibility.cupStack && (
                <th className="p-4 text-center cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('cupStackScore')}>
                   <div className="flex items-center justify-center gap-1">Cup Stack <SortIcon column="cupStackScore" /></div>
                </th>
            )}
            {visibility.total && (
                <th className="p-4 text-right cursor-pointer hover:text-primary transition-colors" onClick={() => handleSort('totalScore')}>
                   <div className="flex items-center justify-end gap-1">Total <SortIcon column="totalScore" /></div>
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
                  <div className="flex items-center gap-3">
                      <img src={team.avatar} alt={team.name} className="w-10 h-10 rounded-full border border-border object-cover bg-bg-card" />
                      <span className="font-bold text-text-main group-hover:text-primary transition-colors">{team.name}</span>
                  </div>
              </td>
              
              {visibility.iceCream && (
                  <td className="p-4 text-center">
                      <span className={cn(
                          "font-mono font-medium",
                          isHighScore(team.iceCreamScore, 'iceCream') && "text-yellow-500 font-bold drop-shadow-sm scale-110 inline-block"
                      )}>
                          {team.iceCreamScore}
                          {isHighScore(team.iceCreamScore, 'iceCream') && <Crown size={12} className="inline ml-1 -mt-1 text-yellow-500" />}
                      </span>
                  </td>
              )}
               {visibility.dart && (
                  <td className="p-4 text-center">
                       <span className={cn(
                          "font-mono font-medium",
                          isHighScore(team.dartScore, 'dart') && "text-yellow-500 font-bold drop-shadow-sm scale-110 inline-block"
                      )}>
                          {team.dartScore}
                          {isHighScore(team.dartScore, 'dart') && <Crown size={12} className="inline ml-1 -mt-1 text-yellow-500" />}
                      </span>
                  </td>
              )}
               {visibility.balloon && (
                  <td className="p-4 text-center">
                       <span className={cn(
                          "font-mono font-medium",
                          isHighScore(team.balloonScore, 'balloon') && "text-yellow-500 font-bold drop-shadow-sm scale-110 inline-block"
                      )}>
                          {team.balloonScore}
                          {isHighScore(team.balloonScore, 'balloon') && <Crown size={12} className="inline ml-1 -mt-1 text-yellow-500" />}
                      </span>
                  </td>
              )}
               {visibility.cupStack && (
                  <td className="p-4 text-center">
                       <span className={cn(
                          "font-mono font-medium",
                          isHighScore(team.cupStackScore, 'cupStack') && "text-yellow-500 font-bold drop-shadow-sm scale-110 inline-block"
                      )}>
                          {team.cupStackScore}
                          {isHighScore(team.cupStackScore, 'cupStack') && <Crown size={12} className="inline ml-1 -mt-1 text-yellow-500" />}
                      </span>
                  </td>
              )}
              
               {visibility.total && (
                  <td className="p-4 text-right">
                      <span className="font-bold text-xl text-primary">{team.totalScore}</span>
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
