import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../services/supabaseClient';

const LeaderboardContext = createContext();

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (!context) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
};

export const LeaderboardProvider = ({ children }) => {
  const [rankedTeams, setRankedTeams] = useState([]);
  const [visibility, setVisibility] = useState({
    iceCream: true,
    dart: true,
    balloon: true,
    cupStack: true,
    total: true,
    leaderboard_visible: false, // Default to hidden
    masterToggle: false // Derived from leaderboard_visible for UI compatibility
  });
  const [isLoading, setIsLoading] = useState(true);

  const [realtimeBlocked, setRealtimeBlocked] = useState(false);

  // --- Safe Fetch Data ---
  const getLeaderboard = async () => {
    try {
      // 1. Fetch Settings
      const { data: settingsData, error: settingsError } = await supabase
        .from('leaderboard_settings')
        .select('*')
        .single();
        
      if (settingsError && settingsError.code !== 'PGRST116') {
         console.error('Error fetching settings:', settingsError);
      } else if (settingsData) {
          updateVisibilityState(settingsData);
      }

      // 2. Fetch Leaderboard View
      const { data: leaderboardData, error: leaderboardError } = await supabase
        .from('leaderboard_view')
        .select('*')
        .order('rank', { ascending: true });

      if (leaderboardError) {
        console.error('Error fetching leaderboard:', leaderboardError);
      } else {
        // Always replace state with new array reference
        setRankedTeams([...transformData(leaderboardData)]);
      }

    } catch (err) {
      console.error("Unexpected error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper to map DB columns to frontend expected format
  const transformData = (data) => {
      return data.map(team => ({
          id: team.id,
          name: team.team_name,
          avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${team.team_name}`,
          iceCreamScore: team.ice_cream,
          dartScore: team.dart,
          balloonScore: team.balloon,
          cupStackScore: team.cup_stack,
          totalScore: team.total,
          rank: team.rank
      }));
  };
  
  const updateVisibilityState = (settings) => {
      setVisibility({
          iceCream: settings.show_ice_cream,
          dart: settings.show_dart,
          balloon: settings.show_balloon,
          cupStack: settings.show_cup_stack,
          total: settings.show_total,
          leaderboard_visible: settings.leaderboard_visible,
          masterToggle: settings.leaderboard_visible
      });
  };

  useEffect(() => {
    // Initial fetch
    getLeaderboard();

    // --- Realtime Subscription ---
    const channel = supabase
      .channel('leaderboard_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teams' },
        () => {
             // Instant refresh on any change
             getLeaderboard();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'leaderboard_settings' },
        () => {
             // Instant refresh on settings change
             getLeaderboard();
        }
      )
      .subscribe((status, err) => {
          if (status === 'SUBSCRIBED') {
              console.log('Realtime connected!');
              setRealtimeBlocked(false);
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
              console.warn(`Realtime connection failed: ${status}`, err);
              setRealtimeBlocked(true);
          }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // --- Polling Fallback ---
  useEffect(() => {
    let intervalId;
    if (realtimeBlocked) {
        console.log('Activating polling fallback (4s)...');
        intervalId = setInterval(() => {
            getLeaderboard();
        }, 4000);
    }
    return () => {
        if (intervalId) clearInterval(intervalId);
    };
  }, [realtimeBlocked]);

  // --- Derived State ---
  const maxScores = useMemo(() => {
    return {
      iceCream: Math.max(...rankedTeams.map(t => t.iceCreamScore || 0), 0),
      dart: Math.max(...rankedTeams.map(t => t.dartScore || 0), 0),
      balloon: Math.max(...rankedTeams.map(t => t.balloonScore || 0), 0),
      cupStack: Math.max(...rankedTeams.map(t => t.cupStackScore || 0), 0),
    };
  }, [rankedTeams]);

  // --- Actions ---

  const updateScore = async (id, field, change) => {
     // field mapping: frontend name -> db column
     const columnMap = {
         'iceCreamScore': 'ice_cream',
         'dartScore': 'dart',
         'balloonScore': 'balloon',
         'cupStackScore': 'cup_stack'
     };
     
     const dbColumn = columnMap[field] || field;

     const { error } = await supabase.rpc('update_score', {
         team_id: id,
         column_name: dbColumn,
         delta: change
     });

     if (error) {
         console.error("Error updating score:", error);
         alert("Failed to update score: " + error.message);
     }
  };
  
  const toggleVisibility = async (field) => {
      // field mapping
      const keyMap = {
          'iceCream': 'show_ice_cream',
          'dart': 'show_dart',
          'balloon': 'show_balloon',
          'cupStack': 'show_cup_stack',
          'total': 'show_total',
          'masterToggle': 'leaderboard_visible'
      };
      
      const dbColumn = keyMap[field];
      if (!dbColumn) return;

      // Optimistic update
      const currentValue = visibility[field];
      
      const { error } = await supabase
        .from('leaderboard_settings')
        .update({ [dbColumn]: !currentValue })
        .eq('id', 1);

      if (error) {
          console.error("Error toggling visibility:", error);
          // Revert is handled by next fetch/realtime, but we could add manual revert here
      }
  };
  
  const importTeams = async (teamsData) => {
      // Bulk Upsert handled in BulkUpload.jsx usually, 
      // but we can expose a helper if needed. 
      // For now, removing the logic here as urged by the plan to move it to BulkUpload 
      // or letting BulkUpload handle the Supabase call directly.
      // But preserving the interface for now to not break BulkUpload calling it (yet).
      
      // Actually, plan says: "Update BulkUpload.jsx to parse Excel... Implement UPSERT logic using Supabase client".
      // So I will implement the logic locally in BulkUpload or here.
      // Let's implement a wrapper here to keep Supabase logic centralized? 
      // Or just let BulkUpload do it. The prompt said "Update BulkUpload.jsx... Implement UPSERT logic".
      // I'll leave a placeholder or remove it. Existing BulkUpload calls `importTeams`. 
      // I should probably redirect that call or implement it here.
      
      // Let's implement it here to keep Context as the data layer.
      
      const upsertData = teamsData.map(row => ({
          team_name: row['Team Name'],
          ice_cream: Number(row['Ice Cream']) || 0,
          dart: Number(row['Dart']) || 0,
          balloon: Number(row['Balloon']) || 0,
          cup_stack: Number(row['Cup Stack']) || 0,
          updated_at: new Date()
      })).filter(t => t.team_name); // simple validation

      const { error } = await supabase
        .from('teams')
        .upsert(upsertData, { onConflict: 'team_name' });
        
      if (error) {
          throw error;
      }
  };

  const addTeam = async (name) => {
      const { error } = await supabase
        .from('teams')
        .insert([{ team_name: name }]);
      
      if (error) {
          console.error("Error adding team:", error);
          alert("Error adding team: " + error.message);
      }
  };

  const resetScores = async () => {
    if (confirm('Are you sure you want to reset all scores to 0?')) {
        const { error } = await supabase
            .from('teams')
            .update({ 
                ice_cream: 0, 
                dart: 0, 
                balloon: 0, 
                cup_stack: 0,
                updated_at: new Date()
            })
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Updates all rows
            
        if (error) {
             console.error("Error resetting scores:", error);
             alert("Error resetting scores");
        }
    }
  };
  
  const resetData = async () => {
      if(confirm('DANGER: Delete ALL teams? This cannot be undone.')) {
          const { error } = await supabase
            .from('teams')
            .delete()
            .neq('id', '00000000-0000-0000-0000-000000000000'); // Deletes all rows
            
          if (error) {
              console.error("Error deleting data:", error);
              alert("Error deleting data");
          }
      }
  }

  const value = {
    teams: rankedTeams, // maintain compatibility if any component uses 'teams'
    rankedTeams,
    visibility,
    isLoading,
    maxScores,
    updateScore,
    toggleVisibility,
    importTeams,
    addTeam,
    resetScores,
    resetData,
    realtimeBlocked
  };

  return (
    <LeaderboardContext.Provider value={value}>
      {children}
    </LeaderboardContext.Provider>
  );
};
