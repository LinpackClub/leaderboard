import React, { useState } from 'react';
import { useLeaderboard } from '../../context/LeaderboardContext';
import { useAdminLeaderboard } from '../../context/AdminLeaderboardContext';
import { Plus, Trash2, RotateCcw, Save, Eye, EyeOff } from 'lucide-react';
import BulkUpload from './BulkUpload';
import { cn } from '../../utils/cn';

const Toggle = ({ label, checked, onChange }) => (
  <div className="flex items-center justify-between p-4 bg-bg-card border border-border rounded-lg shadow-sm">
    <span className="text-sm font-medium text-text-main">{label}</span>
    <button
      onClick={onChange}
      className={cn(
        "relative w-12 h-6 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary/50",
        checked ? "bg-primary" : "bg-bg-card-hover border border-border"
      )}
    >
      <span
        className={cn(
          "absolute left-1 top-1 w-4 h-4 rounded-full bg-white shadow-sm transition-transform duration-200 ease-in-out",
          checked ? "translate-x-6" : "translate-x-0"
        )}
      />
    </button>
  </div>
);

const AdminPanel = () => {
  const { 
    // teams, // Replaced by localTeams
    addTeam, 
    // updateScore, // Replaced by updateScoreOptimistic
    resetScores, 
    visibility, 
    toggleVisibility,
    resetData 
  } = useLeaderboard();

  // Use the new Optimistic Context
  const { localTeams, updateScoreOptimistic, isSyncing } = useAdminLeaderboard();

  const [newTeamName, setNewTeamName] = useState('');

  const handleAddTeam = (e) => {
    e.preventDefault();
    if (newTeamName.trim()) {
      addTeam(newTeamName);
      setNewTeamName('');
    }
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-text-main">Admin Dashboard</h1>
           <p className="text-text-muted">Manage teams, scores, and visibility</p>
        </div>
        
        <div className="flex gap-2 items-center">
            {isSyncing && (
                <span className="text-sm text-text-muted animate-pulse flex items-center gap-2 mr-4">
                     <Save size={16} /> Saving...
                </span>
            )}
           <button onClick={resetScores} className="btn bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20">
               <RotateCcw size={16} className="mr-2" />
               Reset All Scores
           </button>
           <button onClick={resetData} className="btn bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20">
               <Trash2 size={16} className="mr-2" />
               Reset Database
           </button>
        </div>
      </div>

      {/* Bulk Upload */}
      <BulkUpload />

      {/* Visibility Controls */}
      <section className="glass-panel p-6 rounded-xl border border-border">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-text-main">
              <Eye size={20} className="text-primary" />
              Visibility Controls
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Toggle 
                  label="Master Leaderboard" 
                  checked={visibility.masterToggle} 
                  onChange={() => toggleVisibility('masterToggle')} 
              />
               <Toggle 
                  label="Total Score" 
                  checked={visibility.total} 
                  onChange={() => toggleVisibility('total')} 
              />
              <Toggle 
                  label="Ice Cream Score" 
                  checked={visibility.iceCream} 
                  onChange={() => toggleVisibility('iceCream')} 
              />
              <Toggle 
                  label="Dart Score" 
                  checked={visibility.dart} 
                  onChange={() => toggleVisibility('dart')} 
              />
              <Toggle 
                  label="Balloon Score" 
                  checked={visibility.balloon} 
                  onChange={() => toggleVisibility('balloon')} 
              />
              <Toggle 
                  label="Cup Stack Score" 
                  checked={visibility.cupStack} 
                  onChange={() => toggleVisibility('cupStack')} 
              />
          </div>
      </section>

      {/* Add New Team */}
       <section className="glass-panel p-6 rounded-xl border border-border">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2 text-text-main">
              <Plus size={20} className="text-primary" />
              Add New Team
          </h2>
          <form onSubmit={handleAddTeam} className="flex gap-4">
              <input
                  type="text"
                  placeholder="Enter team name..."
                  className="flex-1 bg-bg-card-hover border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-text-main placeholder:text-text-muted"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                  Add Team
              </button>
          </form>
      </section>

      {/* Score Management */}
      <section className="glass-panel p-6 rounded-xl overflow-hidden border border-border">
          <h2 className="text-xl font-semibold mb-6 flex items-center gap-2 text-text-main">
              <Save size={20} className="text-primary" />
              Manage Scores
          </h2>
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead className="bg-bg-card-hover text-text-muted uppercase text-sm font-semibold">
                      <tr>
                          <th className="p-4 rounded-tl-lg">Rank</th>
                          <th className="p-4">Team Name</th>
                          <th className="p-4 text-center">Ice Cream</th>
                          <th className="p-4 text-center">Dart</th>
                          <th className="p-4 text-center">Balloon</th>
                          <th className="p-4 text-center">Cup Stack</th>
                          <th className="p-4 text-right rounded-tr-lg">Total</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                      {localTeams.map((team, index) => (
                          <tr key={team.id} className="hover:bg-bg-card-hover/50 transition-colors">
                              <td className="p-4 font-bold text-text-muted">#{team.rank}</td>
                              <td className="p-4 font-medium text-text-main">{team.name}</td>
                              
                              {/* Score Columns with +/- buttons */}
                              {['iceCreamScore', 'dartScore', 'balloonScore', 'cupStackScore'].map((field) => (
                                  <td key={field} className="p-4">
                                      <div className="flex items-center justify-center gap-2">
                                          <button 
                                            onClick={() => updateScoreOptimistic(team.id, field, -1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-card border border-border hover:border-red-500/50 hover:text-red-500 transition-colors"
                                          >
                                              -
                                          </button>
                                          <span className="w-8 text-center font-bold text-text-main">{team[field]}</span>
                                          <button 
                                            onClick={() => updateScoreOptimistic(team.id, field, 1)}
                                            className="w-8 h-8 flex items-center justify-center rounded-full bg-bg-card border border-border hover:border-green-500/50 hover:text-green-500 transition-colors"
                                          >
                                              +
                                          </button>
                                      </div>
                                  </td>
                              ))}

                              <td className="p-4 text-right font-bold text-primary text-lg">
                                  {team.totalScore}
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          {localTeams.length === 0 && (
              <div className="p-8 text-center text-text-muted">
                  No teams found. Add a team above to get started.
              </div>
          )}
      </section>

    </div>
  );
};

export default AdminPanel;
