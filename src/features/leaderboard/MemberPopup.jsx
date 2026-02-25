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
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ 
          type: "spring", 
          damping: 25, 
          stiffness: 300,
          exit: { duration: 0.15 } 
        }}
        className="relative w-full max-w-md bg-bg-card border border-border/10 rounded-2xl p-6 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Background Highlight */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
        
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
            className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-card-hover text-text-muted hover:text-text-main transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
          {memberList.length > 0 ? (
            memberList.map((member, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="p-3 rounded-lg bg-bg-card-hover border border-border/50 text-text-main font-medium flex items-center gap-3"
              >
                <span className="w-6 h-6 rounded-full bg-primary/20 text-primary text-[10px] flex items-center justify-center font-bold">
                  {idx + 1}
                </span>
                {member}
              </motion.div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-text-muted italic">No members listed for this team.</p>
            </div>
          )}
        </div>

        <div className="mt-8">
          <button 
            onClick={onClose}
            className="w-full py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary-hover transition-colors shadow-lg shadow-primary/20"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default MemberPopup;
