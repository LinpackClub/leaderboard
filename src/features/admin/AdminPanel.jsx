import React, { useState } from 'react';
import { useLeaderboard } from '../../context/LeaderboardContext';
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
    teams, 
    addTeam, 
    updateScore, 
    resetScores, 
    visibility, 
    toggleVisibility,
    resetData 
  } = useLeaderboard();

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
        
        <div className="flex gap-2">
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
               <table className="w-full text-left border-collapse">
                   <thead>
                       <tr className="text-xs text-text-muted uppercase border-b border-border">
                           <th className="p-4">Team</th>
                           <th className="p-4 w-32 text-center">Ice Cream</th>
                           <th className="p-4 w-32 text-center">Dart</th>
                           <th className="p-4 w-32 text-center">Balloon</th>
                           <th className="p-4 w-32 text-center">Cup Stack</th>
                           <th className="p-4 w-24 text-right text-text-main">Total</th>
                       </tr>
                   </thead>
                   <tbody>
                       {teams.map(team => (
                           <tr key={team.id} className="border-b border-border last:border-0 hover:bg-bg-card-hover/50 transition-colors">
                               <td className="p-4 font-medium text-text-main">{team.name}</td>
                               <td className="p-2">
                                   <input
                                       type="number"
                                       className="w-full bg-bg-card-hover border border-border rounded px-2 py-1 text-center focus:border-primary focus:outline-none text-text-main"
                                       value={team.iceCreamScore}
                                       min="0"
                                       onChange={(e) => updateScore(team.id, 'iceCreamScore', e.target.value)}
                                   />
                               </td>
                               <td className="p-2">
                                   <input
                                       type="number"
                                       className="w-full bg-bg-card-hover border border-border rounded px-2 py-1 text-center focus:border-primary focus:outline-none text-text-main"
                                       value={team.dartScore}
                                        min="0"
                                       onChange={(e) => updateScore(team.id, 'dartScore', e.target.value)}
                                   />
                               </td>
                               <td className="p-2">
                                   <input
                                       type="number"
                                       className="w-full bg-bg-card-hover border border-border rounded px-2 py-1 text-center focus:border-primary focus:outline-none text-text-main"
                                       value={team.balloonScore}
                                        min="0"
                                       onChange={(e) => updateScore(team.id, 'balloonScore', e.target.value)}
                                   />
                               </td>
                               <td className="p-2">
                                   <input
                                       type="number"
                                       className="w-full bg-bg-card-hover border border-border rounded px-2 py-1 text-center focus:border-primary focus:outline-none text-text-main"
                                       value={team.cupStackScore}
                                        min="0"
                                       onChange={(e) => updateScore(team.id, 'cupStackScore', e.target.value)}
                                   />
                               </td>
                               <td className="p-4 text-right font-bold text-primary text-xl">
                                   {
                                     (Number(team.iceCreamScore) || 0) + 
                                     (Number(team.dartScore) || 0) + 
                                     (Number(team.balloonScore) || 0) + 
                                     (Number(team.cupStackScore) || 0)
                                   }
                               </td>
                           </tr>
                       ))}
                   </tbody>
               </table>
           </div>
      </section>

    </div>
  );
};

export default AdminPanel;
