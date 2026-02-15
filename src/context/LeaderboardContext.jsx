import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { INITIAL_TEAMS } from '../data/mockData';
import { calculateRankings } from '../utils/rankingLogic';

const LeaderboardContext = createContext();

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
};

export const LeaderboardProvider = ({ children }) => {
  // --- State ---
  const [teams, setTeams] = useState(() => {
    const saved = localStorage.getItem('leaderboard_teams');
    return saved ? JSON.parse(saved) : INITIAL_TEAMS;
  });

  const [visibility, setVisibility] = useState(() => {
    const saved = localStorage.getItem('leaderboard_visibility');
    return saved ? JSON.parse(saved) : {
      iceCream: true,
      dart: true,
      balloon: true,
      cupStack: true,
      total: true,
      masterToggle: true
    };
  });

  const [isLoading, setIsLoading] = useState(true);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('leaderboard_teams', JSON.stringify(teams));
  }, [teams]);

  useEffect(() => {
    localStorage.setItem('leaderboard_visibility', JSON.stringify(visibility));
  }, [visibility]);

  // --- Simulate Loading ---
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  // --- Derived State ---
  const rankedTeams = useMemo(() => calculateRankings(teams), [teams]);

  // --- Actions ---
  const addTeam = (name) => {
    const newTeam = {
      id: crypto.randomUUID(),
      name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
      iceCreamScore: 0,
      dartScore: 0,
      balloonScore: 0,
      cupStackScore: 0
    };
    setTeams(prev => [...prev, newTeam]);
  };

  const updateScore = (id, field, value) => {
    setTeams(prev => prev.map(team => 
      team.id === id ? { ...team, [field]: Number(value) } : team
    ));
  };

  const resetScores = () => {
    if (confirm('Are you sure you want to reset all scores?')) {
      setTeams(prev => prev.map(team => ({
        ...team,
        iceCreamScore: 0,
        dartScore: 0,
        balloonScore: 0,
        cupStackScore: 0
      })));
    }
  };

  const toggleVisibility = (field) => {
    setVisibility(prev => ({ ...prev, [field]: !prev[field] }));
  };
  
  const resetData = () => {
      if(confirm('Hard Reset to Mock Data? Irreversible.')) {
          setTeams(INITIAL_TEAMS);
      }
  }

  const value = {
    teams,
    rankedTeams,
    visibility,
    addTeam,
    updateScore,
    resetScores,
    toggleVisibility,
    resetData
  };

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  );
};
