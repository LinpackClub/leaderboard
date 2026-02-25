import React from 'react';
import { Trophy, Crown } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

const RankCard = ({ team, rank, delay }) => {
  const isFirst = rank === 1;
  const isSecond = rank === 2;
  const isThird = rank === 3;

  const rankColor = isFirst ? 'text-yellow-400' : isSecond ? 'text-gray-300' : 'text-orange-400';
  const glowColor = isFirst ? 'shadow-yellow-500/20' : isSecond ? 'shadow-gray-400/20' : 'shadow-orange-500/20';
  const borderColor = isFirst ? 'border-yellow-500/30' : isSecond ? 'border-gray-400/30' : 'border-orange-500/30';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.2 }}
      className={cn(
        "glass-panel rounded-2xl p-6 md:p-6 relative flex flex-col items-center shadow-lg border overflow-hidden transition-all duration-300",
        glowColor,
        borderColor,
        // Scale up first place slightly on desktop, normal on mobile
        isFirst && "scale-100 md:scale-110 z-10 my-4 md:my-0"
      )}
    >
      {/* Decorative background dots for top 3 */}
      {(isFirst || isSecond || isThird) && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className={cn(
            "absolute w-20 h-20 rounded-full blur-2xl opacity-20",
            isFirst ? "bg-yellow-400 -top-10 -right-10" : isSecond ? "bg-gray-300 -top-10 -right-10" : "bg-orange-400 -top-10 -right-10"
          )} />
          <div className={cn(
            "absolute w-16 h-16 rounded-full blur-xl opacity-10",
            isFirst ? "bg-yellow-400 -bottom-8 -left-8" : isSecond ? "bg-gray-300 -bottom-8 -left-8" : "bg-orange-400 -bottom-8 -left-8"
          )} />
        </div>
      )}

      <div className="absolute top-4 right-4 z-10">
        <Trophy className={cn("w-6 h-6", rankColor)} />
      </div>

      <div className="relative mb-4">
        {/* Crown for 1st place */}
        {isFirst && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-4xl animate-bounce">
            👑
          </div>
        )}
        
        <div className={cn(
          "w-24 h-24 md:w-20 md:h-20 rounded-full border-4 overflow-hidden relative",
          isFirst ? "border-yellow-500" : isSecond ? "border-gray-300" : "border-orange-500"
        )}>
           <img src={team.avatar} alt={team.name} className="w-full h-full object-cover" />
        </div>
        <div className={cn(
            "absolute -bottom-2 -right-2 w-9 h-9 md:w-8 md:h-8 rounded-full flex items-center justify-center font-bold text-sm bg-bg-card border border-border",
            rankColor
        )}>
            #{rank}
        </div>
      </div>

      <h3 className="font-bold text-lg md:text-lg mb-0.5 text-text-main">{team.name}</h3>
      <p className="text-xs md:text-sm text-text-muted mb-3">Overall Percentage</p>
      
      <div className="text-3xl md:text-3xl font-bold text-text-main">
        {team.finalPercent}%
      </div>

      <div className="mt-6 w-full grid grid-cols-2 gap-2 text-xs text-text-muted border-t border-border pt-4">
          <div className="flex flex-col items-center">
              <span>Ice Cream</span>
              <span className="text-text-main font-medium">
                  {team.gamesPlaying === 3 ? '—' : team.iceCreamScore}
                  {team.gamesPlaying === 4 && team.iceRank === 1 && team.iceCreamScore > 0 && <Crown size={10} className="inline ml-1 -mt-1 text-yellow-500" />}
              </span>
          </div>
          <div className="flex flex-col items-center">
              <span>Dart</span>
              <span className="text-text-main font-medium">
                  {team.dartScore}
                  {team.dartRank === 1 && team.dartScore > 0 && <Crown size={10} className="inline ml-1 -mt-1 text-yellow-500" />}
              </span>
          </div>
           <div className="flex flex-col items-center">
              <span>Balloon</span>
              <span className="text-text-main font-medium">
                  {team.balloonScore}
                  {team.balloonRank === 1 && team.balloonScore > 0 && <Crown size={10} className="inline ml-1 -mt-1 text-yellow-500" />}
              </span>
          </div>
          <div className="flex flex-col items-center">
              <span>Face Paint</span>
              <span className="text-text-main font-medium">
                  {team.facePaintingScore}
                  {team.faceRank === 1 && team.facePaintingScore > 0 && <Crown size={10} className="inline ml-1 -mt-1 text-yellow-500" />}
              </span>
          </div>
      </div>
    </motion.div>
  );
};

export default RankCard;
