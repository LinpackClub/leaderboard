import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

const AdminLeaderboardContext = createContext();

export const useAdminLeaderboard = () => {
  const context = useContext(AdminLeaderboardContext);
  if (!context) {
    throw new Error('useAdminLeaderboard must be used within a AdminLeaderboardProvider');
  }
  return context;
};

export const AdminLeaderboardProvider = ({ children }) => {
  const [localTeams, setLocalTeams] = useState([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSynced, setLastSynced] = useState(null);
  
  // Pending updates map: { teamId: { ice_cream: delta, ... } }
  const pendingUpdates = useRef({});
  const timeoutRef = useRef(null);
  
  // Generate a unique client ID for this session to ignore own events
  const clientId = useRef(`client-${Math.random().toString(36).substr(2, 9)}`).current;

  // --- Fetch Data ---
  const fetchAdminData = useCallback(async () => {
    try {
      // Fetch fresh data from view
      const { data, error } = await supabase
        .from('leaderboard_view')
        .select('*')
        .order('rank', { ascending: true });

      if (error) {
        console.error('Error fetching admin leaderboard:', error);
      } else {
        setLocalTeams(data.map(transformData));
      }
    } catch (err) {
      console.error("Unexpected error in Admin Context:", err);
    }
  }, []);

  // Helper to map DB columns
  const transformData = (team) => ({
      id: team.id,
      name: team.team_name,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${team.team_name}`,
      gamesPlaying: team.games_playing,
      iceCreamScore: team.ice_cream,
      dartScore: team.dart,
      balloonScore: team.balloon,
      facePaintingScore: team.face_painting,
      finalPercent: team.final_percentage,
      members: team.members || '',
      rank: team.rank
  });

  // --- Realtime Subscription (filtered) ---
  useEffect(() => {
    fetchAdminData();

    const channel = supabase
      .channel('admin_leaderboard_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'teams' },
        (payload) => {
             // 1. Check if this update was triggered by US
             if (payload.new && payload.new.last_updated_by === clientId) {
                 // Ignore our own updates to prevent flickering / race conditions
                 return;
             }
             
             // 2. Ideally we just update the specific row, but for simplicity/safety we refetch keys
             console.log("External update received, refreshing...");
             fetchAdminData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchAdminData, clientId]);


  // --- Optimistic Update Logic ---
  const updateScoreOptimistic = (teamId, field, delta) => {
      // 1. Update Local State Immediately
      setLocalTeams(prev => prev.map(team => {
          if (team.id === teamId) {
              const newScore = Math.max((team[field] || 0) + delta, 0); // Prevent negative locally
              
              const oldScore = team[field] || 0;
              const diff = newScore - oldScore; // Actual applied delta
              
              return {
                  ...team,
                  [field]: newScore,
                  finalPercent: team.finalPercent + (diff * (team.gamesPlaying === 4 ? 0.25 : 0.33)) // Rough estimate for UI feel
              };
          }
          return team;
      }));

      // 2. Queue the Delta
      const columnMap = {
         'iceCreamScore': 'ice_cream',
         'dartScore': 'dart',
         'balloonScore': 'balloon',
         'facePaintingScore': 'face_painting'
      };
      const dbColumn = columnMap[field];
      
      if (!pendingUpdates.current[teamId]) {
          pendingUpdates.current[teamId] = {};
      }
      
      // Accumulate delta
      pendingUpdates.current[teamId][dbColumn] = (pendingUpdates.current[teamId][dbColumn] || 0) + delta;

      // 3. Debounce Sync
      if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(syncUpdates, 600);
      setIsSyncing(true);
  };

  const updateMembers = (teamId, membersText) => {
      // 1. Update Local State Immediately
      setLocalTeams(prev => prev.map(team => {
          if (team.id === teamId) {
              return { ...team, members: membersText };
          }
          return team;
      }));

      // 2. Queue the Update
      if (!pendingUpdates.current[teamId]) {
          pendingUpdates.current[teamId] = {};
      }
      
      // Overwrite members (not delta)
      pendingUpdates.current[teamId]['members'] = membersText;

      // 3. Debounce Sync
      if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(syncUpdates, 800);
      setIsSyncing(true);
  };

  // --- Sync to Server ---
  const syncUpdates = async () => {
      const updatesToSync = pendingUpdates.current;
      pendingUpdates.current = {}; // Clear queue
      
      const payload = Object.entries(updatesToSync).map(([id, changes]) => ({
          id,
          ...changes
      }));
      
      if (payload.length === 0) {
          setIsSyncing(false);
          return;
      }

      try {
          const { error } = await supabase.rpc('update_score_batch', {
              updates: payload,
              client_id: clientId
          });
          
          if (error) {
              console.error("Batch update failed:", error);
              fetchAdminData(); 
          } else {
              setLastSynced(new Date());
          }
      } catch (err) {
          console.error("Sync error:", err);
      } finally {
          setIsSyncing(false);
      }
  };


  const value = {
      localTeams,
      updateScoreOptimistic,
      updateMembers,
      isSyncing,
      lastSynced,
      refresh: fetchAdminData
  };

  return (
    <AdminLeaderboardContext.Provider value={value}>
      {children}
    </AdminLeaderboardContext.Provider>
  );
};
