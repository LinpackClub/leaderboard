import React, { useState } from 'react';
import { useLeaderboard } from '../../context/LeaderboardContext';
import { useAdminLeaderboard } from '../../context/AdminLeaderboardContext';
import { Plus, Trash2, RotateCcw, Save, Eye, EyeOff, Search, Download, Lock, X } from 'lucide-react';
import BulkUpload from './BulkUpload';
import { cn } from '../../utils/cn';
import SEO from '../../components/seo/SEO';

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
    addTeam, 
    resetScores, 
    visibility, 
    toggleVisibility,
    resetData 
  } = useLeaderboard();

  // Use the new Optimistic Context
  const { localTeams, updateScoreOptimistic, isSyncing } = useAdminLeaderboard();

  // Local State
  const [newTeamName, setNewTeamName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Security Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState(null); 
  const [confirmText, setConfirmText] = useState('');
  const [error, setError] = useState('');

  const handleAddTeam = (e) => {
    e.preventDefault();
    if (newTeamName.trim()) {
      addTeam(newTeamName);
      setNewTeamName('');
    }
  };

  const filteredTeams = localTeams.filter(team => 
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDownloadCSV = () => {
    const headers = ['Rank', 'Team Name', 'Games Playing', 'Ice Cream', 'Dart', 'Balloon', 'Face Painting', 'Overall %'];
    const rows = localTeams.map(team => [
      team.rank,
      `"${team.name.replace(/"/g, '""')}"`, // Escape quotes
      team.gamesPlaying,
      team.iceCreamScore,
      team.dartScore,
      team.balloonScore,
      team.facePaintingScore,
      team.finalPercent
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'leaderboard.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Security Handling
  const initiateAction = (actionFunc, actionTitle) => {
    setPendingAction({ func: actionFunc, title: actionTitle });
    setIsModalOpen(true);
    setConfirmText('');
    setError('');
  };

  const handleConfirmAction = () => {
    if (confirmText === 'CONFIRM') { 
      if (pendingAction?.func) {
        pendingAction.func();
      }
      setIsModalOpen(false);
      setPendingAction(null);
    } else {
      setError("Please type 'CONFIRM'");
    }
  };

  return (
    <div className="space-y-8 pb-20 relative">
      <SEO title="Admin Dashboard | VITB GOT LATENT" description="Manage teams and scores." />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-text-main">Admin Dashboard</h1>
           <p className="text-text-muted">Manage teams, scores, and visibility</p>
        </div>
        
        <div className="flex gap-2 items-center flex-wrap">
            {isSyncing && (
                <span className="text-sm text-text-muted animate-pulse flex items-center gap-2 mr-4">
                     <Save size={16} /> Saving...
                </span>
            )}
           <button 
             onClick={() => initiateAction(resetScores, "Reset All Scores")} 
             className="btn bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
           >
               <RotateCcw size={16} className="mr-2" />
               Reset Scores
           </button>
           <button 
             onClick={() => initiateAction(resetData, "Reset Database")} 
             className="btn bg-red-500/10 text-red-500 hover:bg-red-500/20 border border-red-500/20"
           >
               <Trash2 size={16} className="mr-2" />
               Reset DB
           </button>
           <button onClick={handleDownloadCSV} className="btn bg-bg-card-hover border border-border hover:bg-bg-card-hover/80 text-text-main">
               <Download size={16} className="mr-2" />
               CSV
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
                  label="Overall %" 
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
                  label="Face Paint Score" 
                  checked={visibility.facePainting} 
                  onChange={() => toggleVisibility('facePainting')} 
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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-text-main">
                  <Save size={20} className="text-primary" />
                  Manage Scores
              </h2>
              
              {/* Search Bar */}
              <div className="relative w-full md:w-64">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
                  <input 
                      type="text" 
                      placeholder="Search teams..." 
                      className="w-full pl-10 pr-4 py-2 bg-bg-card-hover border border-border rounded-lg focus:outline-none focus:border-primary text-text-main placeholder:text-text-muted"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                  />
              </div>
          </div>

          <div className="overflow-x-auto">
              <table className="w-full text-left">
                  <thead className="bg-bg-card-hover text-text-muted uppercase text-sm font-semibold">
                      <tr>
                          <th className="p-4 rounded-tl-lg text-xs">Rank</th>
                          <th className="p-4 text-xs">Team Name</th>
                          <th className="p-4 text-center text-xs">Type</th>
                          <th className="p-4 text-center text-xs">Ice Cream</th>
                          <th className="p-4 text-center text-xs">Dart</th>
                          <th className="p-4 text-center text-xs">Balloon</th>
                          <th className="p-4 text-center text-xs">Face Paint</th>
                          <th className="p-4 text-right rounded-tr-lg text-xs">Overall</th>
                      </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                      {filteredTeams.map((team, index) => (
                          <tr key={team.id} className="hover:bg-bg-card-hover/50 transition-colors">
                               <td className="p-4 font-bold text-text-muted text-sm">#{team.rank}</td>
                              <td className="p-4 font-medium text-text-main text-sm">{team.name}</td>
                              <td className="p-4 text-center text-[10px] text-text-muted font-mono">{team.gamesPlaying}G</td>
                              
                              {/* Score Columns with +/- buttons */}
                              {[
                                { field: 'iceCreamScore', label: 'ice' },
                                { field: 'dartScore', label: 'dart' },
                                { field: 'balloonScore', label: 'balloon' },
                                { field: 'facePaintingScore', label: 'face' }
                              ].map(({ field }) => (
                                  <td key={field} className="p-4">
                                      <div className="flex items-center justify-center gap-1.5">
                                          {field === 'iceCreamScore' && team.gamesPlaying === 3 ? (
                                              <span className="text-text-dim/20 italic text-[10px]">Exc</span>
                                          ) : (
                                              <>
                                                  <button 
                                                    onClick={() => updateScoreOptimistic(team.id, field, -1)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-bg-card border border-border hover:border-red-500/50 hover:text-red-500 transition-colors text-xs"
                                                  >
                                                      -
                                                  </button>
                                                  <span className="w-6 text-center font-bold text-text-main text-sm">{team[field]}</span>
                                                  <button 
                                                    onClick={() => updateScoreOptimistic(team.id, field, 1)}
                                                    className="w-6 h-6 flex items-center justify-center rounded-full bg-bg-card border border-border hover:border-green-500/50 hover:text-green-500 transition-colors text-xs"
                                                  >
                                                      +
                                                  </button>
                                              </>
                                          )}
                                      </div>
                                  </td>
                              ))}

                              <td className="p-4 text-right font-bold text-primary text-sm whitespace-nowrap">
                                  {team.finalPercent}%
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
          {filteredTeams.length === 0 && (
              <div className="p-8 text-center text-text-muted">
                  {searchQuery ? "No teams found matching your search." : "No teams found. Add a team above to get started."}
              </div>
          )}
      </section>

      {/* Security Confirmation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 fade-in">
            <div className="bg-bg-card border border-border rounded-xl p-6 max-w-sm w-full shadow-2xl scale-in">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-text-main flex items-center gap-2">
                        <Lock className="text-primary" size={20} />
                        Security Check
                    </h3>
                    <button onClick={() => setIsModalOpen(false)} className="text-text-muted hover:text-text-main">
                        <X size={20} />
                    </button>
                </div>
                
                <p className="text-text-muted mb-4 text-sm">
                    Are you sure you want to <strong>{pendingAction?.title}</strong>? This action cannot be undone.
                </p>

                <div className="space-y-4">
                    <div>
                        <input 
                            type="text" 
                            name="confirmation_text_field"
                            autoComplete="off"
                            value={confirmText}
                            onChange={(e) => {
                                setConfirmText(e.target.value);
                                setError('');
                            }}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleConfirmAction();
                            }}
                            placeholder="Type 'CONFIRM' to proceed"
                            className="w-full bg-bg-card-hover border border-border rounded-lg px-4 py-2 focus:outline-none focus:border-primary text-text-main placeholder:text-text-muted text-center tracking-widest font-mono text-lg uppercase"
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
                    </div>

                    <div className="flex gap-3">
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            className="flex-1 py-2 rounded-lg text-text-muted hover:bg-bg-card-hover transition-colors text-sm font-medium"
                        >
                            Cancel
                        </button>
                        <button 
                            onClick={handleConfirmAction}
                            className="flex-1 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors text-sm font-medium"
                        >
                            Confirm
                        </button>
                    </div>
                </div>
            </div>
        </div>
      )}

    </div>
  );
};

export default AdminPanel;
