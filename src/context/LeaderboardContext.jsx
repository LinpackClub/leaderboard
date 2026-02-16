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

  const maxScores = useMemo(() => {
    return {
      iceCream: Math.max(...teams.map(t => Number(t.iceCreamScore) || 0), 0),
      dart: Math.max(...teams.map(t => Number(t.dartScore) || 0), 0),
      balloon: Math.max(...teams.map(t => Number(t.balloonScore) || 0), 0),
      cupStack: Math.max(...teams.map(t => Number(t.cupStackScore) || 0), 0),
    };
  }, [teams]);

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

  const importTeams = (teamsData) => {
    
    setTeams(prevTeams => {
      const newTeams = [...prevTeams];
      
      teamsData.forEach(row => {
        const teamName = row['Team Name'];
        if (!teamName) return;

        const existingTeamIndex = newTeams.findIndex(t => t.name.toLowerCase() === teamName.toLowerCase());
        
        const teamStats = {
          iceCreamScore: Number(row['Ice Cream']) || 0,
          dartScore: Number(row['Dart']) || 0,
          balloonScore: Number(row['Balloon']) || 0,
          cupStackScore: Number(row['Cup Stack']) || 0
        };

        if (existingTeamIndex >= 0) {
          // Update existing team
          newTeams[existingTeamIndex] = {
            ...newTeams[existingTeamIndex],
            ...teamStats
          };
        } else {
          // Create new team
          newTeams.push({
            id: crypto.randomUUID(),
            name: teamName,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${teamName}`,
            ...teamStats
          });
        }
      });
      
      return newTeams;
    });
  };

  const value = {
    teams,
    rankedTeams,
    visibility,
    addTeam,
    updateScore,
    resetScores,
    toggleVisibility,
    resetData,
    importTeams,
    maxScores
  };

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  );
};
