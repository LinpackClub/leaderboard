import React from 'react';
import { motion } from 'framer-motion';
import { X, Users } from 'lucide-react';

const MemberPopup = ({ team, onClose }) => {
  if (!team) return null;
  
  const { name: teamName, members } = team;
  const memberList = members ? members.split(',').map(m => m.trim()).filter(m => m) : [];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      // Removed backdrop-blur for performance on mobile
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/75"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="relative w-full max-w-md bg-bg-card border border-border/10 rounded-2xl p-6 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Simple static background accent */}
        <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Users size={20} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-text-main line-clamp-1">{teamName}</h3>
              <p className="text-xs text-text-muted uppercase tracking-wider font-semibold">Team Members</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-bg-card-hover text-text-muted active:scale-95 transition-transform"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
          {memberList.length > 0 ? (
            memberList.map((member, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-bg-card-hover border border-border/5 text-text-main font-medium flex items-center gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                  {idx + 1}
                </span>
                <span className="truncate">{member}</span>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-text-muted italic">No members listed.</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <button 
            onClick={onClose}
            className="w-full py-4 rounded-xl bg-primary text-white font-bold active:opacity-90 transition-opacity shadow-lg"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MemberPopup;
